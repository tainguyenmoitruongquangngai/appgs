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
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { AppHeader } from "../components/AppHeader";
import { DataInputField } from "../components/DataInputField";
import { MonitoringCard } from "../components/MonitoringCard";
import { LoadingScreen } from "../components/LoadingScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { dataTransmissionService, BusinessConstructionDto } from "../api/index";

// Định nghĩa các thông số giám sát
const monitoringFactors = [
  {
    key: "MUATHUONGLUU",
    label: "Mưa thượng lưu",
    unit: "mm",
    icon: "rainy-outline",
    required: true,
  },
  {
    key: "THUONGLUU",
    label: "Mực nước thượng lưu",
    unit: "m",
    icon: "water-outline",
    required: true,
  },
  {
    key: "HALUU",
    label: "Mực nước hạ lưu",
    unit: "m",
    icon: "water-outline",
    required: true,
  },
  {
    key: "DUNGTICH",
    label: "Dung tích hồ",
    unit: "triệu m³",
    icon: "cube-outline",
    required: true,
  },
  {
    key: "QDEN",
    label: "Lưu lượng đến",
    unit: "m³/s",
    icon: "arrow-down-outline",
    required: true,
  },
  {
    key: "QUATRAN",
    label: "Lưu lượng qua tràn",
    unit: "m³/s",
    icon: "arrow-forward-outline",
    required: false,
  },
  {
    key: "NHAMAY",
    label: "Lưu lượng qua nhà máy",
    unit: "m³/s",
    icon: "flash-outline",
    required: false,
  },
  {
    key: "DCTT",
    label: "Lưu lượng dòng chảy tối thiểu",
    unit: "m³/s",
    icon: "water-outline",
    required: true,
  },
  {
    key: "LUULUONGHADU",
    label: "Lưu lượng hạ du",
    unit: "m³/s",
    icon: "arrow-up-outline",
    required: false,
  },
  {
    key: "DUKIENLUULUONGHADU",
    label: "Dự kiến lưu lượng hạ du",
    unit: "m³/s",
    icon: "trending-up-outline",
    required: false,
  },
  {
    key: "MUCNUOCHODUKIEN12GIO",
    label: "Mực nước hồ dự kiến 12 giờ",
    unit: "m",
    icon: "time-outline",
    required: false,
  },
];

export default function TransferData() {
  const router = useRouter();
  const { getUserInfo, isLoading } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [constructionName, setConstructionName] = useState("");
  const [selectedConstruction, setSelectedConstruction] =
    useState<BusinessConstructionDto | null>(null);
  const [constructions, setConstructions] = useState<BusinessConstructionDto[]>(
    []
  );
  const [showConstructionPicker, setShowConstructionPicker] = useState(false);
  const [loadingConstructions, setLoadingConstructions] = useState(false);
  const [datetime, setDatetime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUserInfo();
    loadConstructions();
  }, []);

  const loadUserInfo = async () => {
    try {
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  };

  const loadConstructions = async () => {
    setLoadingConstructions(true);
    try {
      const constructionData =
        await dataTransmissionService.getClientConstructions();
      setConstructions(constructionData || []);
    } catch (error) {
      console.error("Error loading constructions:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải danh sách công trình. Vui lòng thử lại."
      );
    } finally {
      setLoadingConstructions(false);
    }
  };

  const handleConstructionSelect = (construction: BusinessConstructionDto) => {
    setSelectedConstruction(construction);
    setConstructionName(construction.construction.tenCT || "");
    setShowConstructionPicker(false);

    // Xóa lỗi khi đã chọn công trình
    if (errors.constructionName) {
      setErrors((prev) => ({ ...prev, constructionName: "" }));
    }
  };

  const handleValueChange = (key: string, value: string) => {
    // Chỉ cho phép số và dấu thập phân
    const numericValue = value.replace(/[^0-9.]/g, "");
    setValues((prev) => ({ ...prev, [key]: numericValue }));

    // Xóa lỗi khi user bắt đầu nhập
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDatetime(selectedDate);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Kiểm tra công trình đã được chọn
    if (!selectedConstruction || !constructionName.trim()) {
      newErrors.constructionName = "Vui lòng chọn công trình";
    }

    // Kiểm tra các trường bắt buộc
    monitoringFactors.forEach((factor) => {
      if (factor.required && !values[factor.key]?.trim()) {
        newErrors[factor.key] = `${factor.label} là bắt buộc`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin đã nhập");
      return;
    }

    setIsSubmitting(true);
    try {
      // Chuẩn bị dữ liệu gửi
      const submissionData = {
        constructionId: selectedConstruction?.construction.id,
        constructionName,
        constructionCode: selectedConstruction?.construction.maCT,
        licenseNumber: selectedConstruction?.latestLicense?.soGP,
        datetime: datetime.toISOString(),
        data: monitoringFactors.map((factor) => ({
          factor: factor.key,
          label: factor.label,
          value: values[factor.key] || "",
          unit: factor.unit,
          required: factor.required,
        })),
        submittedBy: userInfo?.userName,
        submittedAt: new Date().toISOString(),
      };

      console.log("Submission data:", submissionData);

      // TODO: Gửi dữ liệu lên server
      // await dataTransmissionService.submitData(submissionData);

      Alert.alert("Thành công", "Dữ liệu đã được gửi thành công!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải thông tin..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <AppHeader
        title="Truyền dữ liệu giám sát"
        subtitle="Nhập số liệu vận hành hồ chứa"
        onBackPress={() => router.back()}
        rightIcon="information-circle-outline"
        onRightPress={() =>
          Alert.alert(
            "Thông tin",
            "Nhập đầy đủ các thông số bắt buộc được đánh dấu (*)"
          )
        }
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Thông tin cơ bản */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

          <DataInputField
            label="Tên công trình"
            value={constructionName || "Chọn công trình..."}
            placeholder="Chọn công trình..."
            editable={false}
            onPress={() => setShowConstructionPicker(true)}
            icon="business-outline"
            required
            error={errors.constructionName}
          />

          <DataInputField
            label="Thời gian nhập dữ liệu"
            value={datetime.toLocaleString("vi-VN")}
            placeholder="Chọn thời gian..."
            editable={false}
            onPress={() => setShowDatePicker(true)}
            icon="time-outline"
            required
          />

          {userInfo?.userName && (
            <DataInputField
              label="Người nhập"
              value={userInfo.userName}
              editable={false}
              icon="person-outline"
            />
          )}
        </View>

        {/* Trạng thái hệ thống */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng thái hệ thống</Text>

          <MonitoringCard
            title="Kết nối máy chủ"
            description="Trạng thái kết nối đến hệ thống trung tâm"
            status="online"
            lastUpdate="2 phút trước"
            icon="server-outline"
          />

          <MonitoringCard
            title="Thiết bị giám sát"
            description="Cảm biến và thiết bị đo đạc"
            status="online"
            lastUpdate="1 phút trước"
            icon="hardware-chip-outline"
          />
        </View>

        {/* Dữ liệu quan trắc */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dữ liệu quan trắc</Text>

          {monitoringFactors.map((factor) => (
            <DataInputField
              key={factor.key}
              label={factor.label}
              value={values[factor.key] || ""}
              unit={factor.unit}
              placeholder="Nhập giá trị..."
              keyboardType="numeric"
              onChangeText={(text) => handleValueChange(factor.key, text)}
              icon={factor.icon}
              required={factor.required}
              error={errors[factor.key]}
            />
          ))}
        </View>

        {/* Nút gửi */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Icon
              name={isSubmitting ? "hourglass-outline" : "cloud-upload-outline"}
              size={20}
              color="#fff"
              style={styles.submitIcon}
            />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "ĐANG GỬI..." : "GỬI DỮ LIỆU"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Time Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={datetime}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Construction Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showConstructionPicker}
        onRequestClose={() => setShowConstructionPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn công trình</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowConstructionPicker(false)}
              >
                <Icon name="close-outline" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {loadingConstructions ? (
              <View style={styles.loadingContainer}>
                <Icon name="hourglass-outline" size={32} color="#007AFF" />
                <Text style={styles.loadingText}>
                  Đang tải danh sách công trình...
                </Text>
              </View>
            ) : constructions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="business-outline" size={48} color="#6B7280" />
                <Text style={styles.emptyText}>Không có công trình nào</Text>
                <Text style={styles.emptySubtext}>
                  Vui lòng liên hệ quản trị viên để được cấp quyền truy cập
                </Text>
              </View>
            ) : (
              <FlatList
                data={constructions}
                keyExtractor={(item) => item.construction.id?.toString() || "0"}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.constructionItem,
                      selectedConstruction?.construction.id ===
                        item.construction.id && styles.selectedConstructionItem,
                    ]}
                    onPress={() => handleConstructionSelect(item)}
                  >
                    <View style={styles.constructionInfo}>
                      <Text style={styles.constructionName}>
                        {item.construction.tenCT || "Chưa có tên"}
                      </Text>
                      <Text style={styles.constructionCode}>
                        Mã: {item.construction.maCT || "Chưa có mã"}
                      </Text>
                      <Text style={styles.constructionLocation}>
                        {item.construction.viTriCT || "Chưa có địa chỉ"}
                      </Text>
                      {item.latestLicense && (
                        <Text style={styles.licenseInfo}>
                          GP: {item.latestLicense.soGP}
                        </Text>
                      )}
                    </View>
                    <View style={styles.constructionStatus}>
                      <Icon
                        name={
                          item.connectionAccount?.status
                            ? "checkmark-circle"
                            : "warning"
                        }
                        size={20}
                        color={
                          item.connectionAccount?.status ? "#10B981" : "#F59E0B"
                        }
                      />
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.constructionList}
                showsVerticalScrollIndicator={false}
              />
            )}
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
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  submitSection: {
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  submitIcon: {
    marginRight: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "50%",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  constructionList: {
    flex: 1,
  },
  constructionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedConstructionItem: {
    backgroundColor: "#EBF8FF",
    borderBottomColor: "#007AFF",
  },
  constructionInfo: {
    flex: 1,
  },
  constructionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  constructionCode: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "monospace",
    marginBottom: 2,
  },
  constructionLocation: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  licenseInfo: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  constructionStatus: {
    marginLeft: 12,
  },
  // Legacy styles for backward compatibility
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  datetimeButton: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  dataRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#035291",
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-end",
    height: 90,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonBack: {
    padding: 10,
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 10,
  },
  iconWhite: {
    color: "#fff",
  },
  buttonSubmit: {
    backgroundColor: "#035291",
    padding: 10,
    borderRadius: 6,
    marginTop: 16,
  },
});
