import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { AppHeader } from "../components/AppHeader";
import { InfoCard } from "../components/InfoCard";
import { StatusIndicator } from "../components/StatusIndicator";
import { QuickActionCard } from "../components/QuickActionCard";
import { EmptyState } from "../components/EmptyState";
import { LoadingScreen } from "../components/LoadingScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { dataTransmissionService, BusinessConstructionDto } from "../api/index";

const { width } = Dimensions.get("window");

interface ConstructionProject {
  id: string;
  name: string;
  licenseNumber: string;
  location: string;
  capacity: string;
  status: "active" | "inactive" | "maintenance";
  startDate: string;
  endDate: string;
  type: string;
  owner: string;
  phone: string;
  email: string;
  description: string;
  waterSource: string;
  designCapacity: string;
  currentLevel: string;
  maxLevel: string;
  minLevel: string;
}

// Hàm chuyển đổi từ BusinessConstructionDto sang UI interface
const mapBusinessDtoToProject = (
  businessDto: BusinessConstructionDto
): ConstructionProject => {
  const dto = businessDto.construction;
  const license = businessDto.latestLicense;
  const connectionAccount = businessDto.connectionAccount;
  const businessInfo = businessDto.businessInfo;

  // Xác định status dựa trên dữ liệu
  let status: "active" | "inactive" | "maintenance" = "active";
  if (dto.daXoa) {
    status = "inactive";
  } else if (dto.chuThich?.toLowerCase().includes("bảo trì")) {
    status = "maintenance";
  } else if (connectionAccount && !connectionAccount.status) {
    status = "maintenance"; // Nếu tài khoản kết nối không hoạt động
  }

  // Tạo địa chỉ từ thông tin vị trí
  let location = dto.viTriCT || "";
  if (dto.vitri && dto.vitri.length > 0) {
    const viTri = dto.vitri[0];
    if (viTri.tenXa && viTri.tenHuyen) {
      location = `${viTri.tenXa}, ${viTri.tenHuyen}`;
    }
  }

  // Xác định công suất/dung tích
  let capacity = "N/A";
  if (dto.thongso?.dungTichToanBo) {
    capacity = `${dto.thongso.dungTichToanBo} triệu m³`;
  } else if (dto.thongso?.qThietKe) {
    capacity = `${dto.thongso.qThietKe} m³/s`;
  } else if (dto.qKTThietKe) {
    capacity = `${dto.qKTThietKe} m³/s`;
  }

  // Lấy thông tin chủ sở hữu từ businessInfo hoặc license
  let owner = "Chưa xác định";
  let phone = "Chưa có";
  let email = "Chưa có";

  if (businessInfo) {
    owner = businessInfo.tenTCCN || "Chưa xác định";
    phone = businessInfo.sdt || "Chưa có";
    email = businessInfo.email || "Chưa có";
  } else if (license) {
    // Có thể lấy thông tin từ license nếu có
    owner =
      license.tochuc_canhan?.tenToChuc ||
      license.tochuc_canhan?.hoTen ||
      "Chưa xác định";
  }

  // Lấy thông tin giấy phép
  let licenseNumber = dto.maCT || "Chưa có mã";
  let startDate = dto.namBatDauVanHanh?.toString() || "Chưa xác định";
  let endDate = "Chưa xác định";

  if (license) {
    licenseNumber = license.soGP || dto.maCT || "Chưa có mã";
    if (license.ngayKy) {
      startDate = new Date(license.ngayKy).toLocaleDateString("vi-VN");
    }
    if (license.ngayHetHieuLuc) {
      endDate = new Date(license.ngayHetHieuLuc).toLocaleDateString("vi-VN");
    }
  }

  return {
    id: dto.id?.toString() || "0",
    name: dto.tenCT || "Chưa có tên",
    licenseNumber: licenseNumber,
    location: location,
    capacity: capacity,
    status: status,
    startDate: startDate,
    endDate: endDate,
    type: dto.loaiCT?.tenLoaiCT || "Chưa phân loại",
    owner: owner,
    phone: phone,
    email: email,
    description: dto.chuThich || dto.mucDichKT || "Không có mô tả",
    waterSource: dto.nguonNuocKT || "Chưa xác định",
    designCapacity: capacity,
    currentLevel: dto.thongso?.hTinh?.toString() || "N/A",
    maxLevel: dto.thongso?.hmax?.toString() || "N/A",
    minLevel: dto.thongso?.hmin?.toString() || "N/A",
  };
};

export default function GetInfo() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] =
    useState<ConstructionProject | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [projects, setProjects] = useState<ConstructionProject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi API để lấy danh sách công trình
      const congTrinhData =
        await dataTransmissionService.getClientConstructions();

      if (congTrinhData && congTrinhData.length > 0) {
        // Chuyển đổi từ BusinessConstructionDto sang UI interface
        const mappedProjects = congTrinhData.map((businessDto) =>
          mapBusinessDtoToProject(businessDto)
        );
        setProjects(mappedProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách công trình:", error);
      setError("Không thể tải danh sách công trình. Vui lòng thử lại.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectPress = (project: ConstructionProject) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  const handleRefresh = () => {
    loadProjects();
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "#10B981",
          text: "Đang hoạt động",
          icon: "checkmark-circle",
        };
      case "inactive":
        return {
          color: "#EF4444",
          text: "Ngừng hoạt động",
          icon: "close-circle",
        };
      case "maintenance":
        return { color: "#F59E0B", text: "Bảo trì", icon: "construct" };
      default:
        return {
          color: "#6B7280",
          text: "Không xác định",
          icon: "help-circle",
        };
    }
  };

  if (loading) {
    return <LoadingScreen message="Đang tải thông tin công trình..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <AppHeader
        title="Thông tin công trình"
        subtitle="Danh sách các công trình thủy lợi"
        onBackPress={() => router.back()}
        rightIcon="refresh-outline"
        onRightPress={handleRefresh}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle-outline" size={24} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Thống kê tổng quan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng quan</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{projects.length}</Text>
              <Text style={styles.statLabel}>Tổng công trình</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#10B981" }]}>
                {projects.filter((p) => p.status === "active").length}
              </Text>
              <Text style={styles.statLabel}>Đang hoạt động</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#F59E0B" }]}>
                {projects.filter((p) => p.status === "maintenance").length}
              </Text>
              <Text style={styles.statLabel}>Bảo trì</Text>
            </View>
          </View>
        </View>

        {/* Danh sách công trình */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh sách công trình</Text>

          {projects.length === 0 && !error ? (
            <EmptyState
              icon="business-outline"
              title="Không có công trình"
              description="Chưa có thông tin công trình nào được ghi nhận trong hệ thống"
              actionText="Tải lại"
              onAction={handleRefresh}
            />
          ) : (
            projects.map((project) => {
              const statusConfig = getStatusConfig(project.status);
              return (
                <TouchableOpacity
                  key={project.id}
                  style={styles.projectCard}
                  onPress={() => handleProjectPress(project)}
                  activeOpacity={0.7}
                >
                  <View style={styles.projectHeader}>
                    <View style={styles.projectInfo}>
                      <Text style={styles.projectName}>{project.name}</Text>
                      <Text style={styles.projectLicense}>
                        {project.licenseNumber}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${statusConfig.color}15` },
                      ]}
                    >
                      <Icon
                        name={statusConfig.icon}
                        size={14}
                        color={statusConfig.color}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusConfig.color },
                        ]}
                      >
                        {statusConfig.text}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.projectDetails}>
                    <View style={styles.detailRow}>
                      <Icon name="location-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{project.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Icon name="cube-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>
                        Dung tích: {project.capacity}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Icon name="business-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{project.type}</Text>
                    </View>
                  </View>

                  <View style={styles.projectFooter}>
                    <Text style={styles.ownerText}>{project.owner}</Text>
                    <Icon
                      name="chevron-forward-outline"
                      size={20}
                      color="#6B7280"
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thao tác nhanh</Text>

          <QuickActionCard
            title="Tìm kiếm công trình"
            description="Tìm kiếm theo tên hoặc số giấy phép"
            icon="search-outline"
            color="#007AFF"
            onPress={() =>
              Alert.alert("Thông báo", "Tính năng đang phát triển")
            }
          />

          <QuickActionCard
            title="Xuất báo cáo"
            description="Xuất danh sách công trình ra file Excel"
            icon="document-text-outline"
            color="#10B981"
            onPress={() =>
              Alert.alert("Thông báo", "Tính năng đang phát triển")
            }
          />
        </View>
      </ScrollView>

      {/* Modal chi tiết */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết công trình</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close-outline" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {selectedProject && (
                <>
                  <InfoCard
                    title="Thông tin cơ bản"
                    items={[
                      {
                        label: "Tên công trình",
                        value: selectedProject.name,
                        icon: "business-outline",
                      },
                      {
                        label: "Số giấy phép",
                        value: selectedProject.licenseNumber,
                        icon: "document-text-outline",
                      },
                      {
                        label: "Loại công trình",
                        value: selectedProject.type,
                        icon: "construct-outline",
                      },
                      {
                        label: "Địa điểm",
                        value: selectedProject.location,
                        icon: "location-outline",
                      },
                    ]}
                  />

                  <InfoCard
                    title="Thông số kỹ thuật"
                    items={[
                      {
                        label: "Nguồn nước",
                        value: selectedProject.waterSource,
                        icon: "water-outline",
                      },
                      {
                        label: "Dung tích thiết kế",
                        value: selectedProject.designCapacity,
                        icon: "cube-outline",
                      },
                      {
                        label: "Mực nước hiện tại",
                        value: selectedProject.currentLevel,
                        icon: "analytics-outline",
                      },
                      {
                        label: "Mực nước tối đa",
                        value: selectedProject.maxLevel,
                        icon: "trending-up-outline",
                      },
                      {
                        label: "Mực nước tối thiểu",
                        value: selectedProject.minLevel,
                        icon: "trending-down-outline",
                      },
                    ]}
                  />

                  <InfoCard
                    title="Thông tin giấy phép"
                    items={[
                      {
                        label: "Số giấy phép",
                        value: selectedProject.licenseNumber,
                        icon: "document-text-outline",
                      },
                      {
                        label: "Ngày ký",
                        value: selectedProject.startDate,
                        icon: "calendar-outline",
                      },
                      {
                        label: "Ngày hết hiệu lực",
                        value: selectedProject.endDate,
                        icon: "calendar-clear-outline",
                      },
                      {
                        label: "Trạng thái giấy phép",
                        value:
                          selectedProject.status === "active"
                            ? "Còn hiệu lực"
                            : selectedProject.status === "inactive"
                            ? "Hết hiệu lực"
                            : "Tạm ngừng",
                        icon:
                          selectedProject.status === "active"
                            ? "checkmark-circle-outline"
                            : selectedProject.status === "inactive"
                            ? "close-circle-outline"
                            : "warning-outline",
                      },
                    ]}
                  />

                  <InfoCard
                    title="Thông tin chủ sở hữu"
                    items={[
                      {
                        label: "Tên chủ sở hữu",
                        value: selectedProject.owner,
                        icon: "person-outline",
                      },
                      {
                        label: "Số điện thoại",
                        value: selectedProject.phone,
                        icon: "call-outline",
                      },
                      {
                        label: "Email",
                        value: selectedProject.email,
                        icon: "mail-outline",
                      },
                      {
                        label: "Năm bắt đầu vận hành",
                        value: selectedProject.startDate,
                        icon: "play-circle-outline",
                      },
                    ]}
                  />

                  <View style={styles.descriptionCard}>
                    <Text style={styles.descriptionTitle}>
                      Mô tả công trình
                    </Text>
                    <Text style={styles.descriptionText}>
                      {selectedProject.description}
                    </Text>
                  </View>

                  <StatusIndicator
                    status={
                      selectedProject.status === "active"
                        ? "online"
                        : selectedProject.status === "inactive"
                        ? "offline"
                        : "maintenance"
                    }
                    label="Trạng thái hoạt động"
                    description={`Công trình đang ở trạng thái ${getStatusConfig(
                      selectedProject.status
                    ).text.toLowerCase()}`}
                    size="large"
                  />
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setModalVisible(false);
                  Alert.alert("Thông báo", "Tính năng đang phát triển");
                }}
              >
                <Icon name="create-outline" size={20} color="#007AFF" />
                <Text style={styles.actionButtonText}>Chỉnh sửa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#007AFF" }]}
                onPress={() => {
                  setModalVisible(false);
                  router.push("/transfer-data");
                }}
              >
                <Icon name="cloud-upload-outline" size={20} color="#fff" />
                <Text style={[styles.actionButtonText, { color: "#fff" }]}>
                  Truyền dữ liệu
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 10,
  },
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
    marginRight: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  projectLicense: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "monospace",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  projectDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
    flex: 1,
  },
  projectFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  ownerText: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 20,
  },
  descriptionCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#B91C1C",
    lineHeight: 20,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#EF4444",
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
