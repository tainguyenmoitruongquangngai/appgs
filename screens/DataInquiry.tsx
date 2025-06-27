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
  RefreshControl,
  Share,
  Dimensions,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { AppHeader } from "../components/AppHeader";
import { InfoCard } from "../components/InfoCard";
import { LoadingScreen } from "../components/LoadingScreen";
import { EmptyState } from "../components/EmptyState";
import Icon from "react-native-vector-icons/Ionicons";
import {
  giamSatService,
  StoragePreDataDto,
  dataTransmissionService,
  BusinessConstructionDto,
} from "../api/index";

const { width: screenWidth } = Dimensions.get("window");

interface DataRecord {
  id: string;
  constructionName: string;
  constructionCode: string;
  parameterName: string;
  value: number;
  unit: string;
  time: Date;
  deviceStatus: number;
  status: boolean;
}

interface GroupedData {
  date: string;
  time: string;
  constructionCode: string;
  constructionName: string;
  data: { [key: string]: { value: number; unit: string } };
  deviceStatus: number;
  status: boolean;
}

interface StatsSummary {
  totalRecords: number;
  onlineRecords: number;
  offlineRecords: number;
  averageParameterCount: number;
  latestUpdate: Date | null;
  dateRange: string;
}

interface ParameterFilter {
  id: string;
  name: string;
  displayName: string;
  selected: boolean;
}

export default function DataInquiry() {
  const router = useRouter();

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];

  // State management
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<GroupedData[]>([]);
  const [filteredData, setFilteredData] = useState<GroupedData[]>([]);
  const [stats, setStats] = useState<StatsSummary | null>(null);

  // Filter states
  const [selectedConstruction, setSelectedConstruction] =
    useState<BusinessConstructionDto | null>(null);
  const [constructions, setConstructions] = useState<BusinessConstructionDto[]>(
    []
  );
  const [showConstructionPicker, setShowConstructionPicker] = useState(false);
  const [loadingConstructions, setLoadingConstructions] = useState(false);

  // Parameter filter
  const [parameterFilters, setParameterFilters] = useState<ParameterFilter[]>(
    []
  );
  const [showParameterFilter, setShowParameterFilter] = useState(false);

  // Date range filter
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ); // 7 days ago
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Detail modal
  const [selectedRecord, setSelectedRecord] = useState<GroupedData | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadConstructions();
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (selectedConstruction) {
      loadData();
    }
  }, [selectedConstruction, startDate, endDate]);

  useEffect(() => {
    applyParameterFilters();
  }, [data, parameterFilters]);

  const applyParameterFilters = () => {
    if (
      parameterFilters.length === 0 ||
      parameterFilters.every((f) => f.selected)
    ) {
      setFilteredData(data);
      return;
    }

    const selectedParameterNames = parameterFilters
      .filter((f) => f.selected)
      .map((f) => f.name);

    const filtered = data
      .map((record) => ({
        ...record,
        data: Object.fromEntries(
          Object.entries(record.data).filter(([key]) =>
            selectedParameterNames.includes(key)
          )
        ),
      }))
      .filter((record) => Object.keys(record.data).length > 0);

    setFilteredData(filtered);
  };

  const calculateStats = (dataList: GroupedData[]): StatsSummary => {
    if (dataList.length === 0) {
      return {
        totalRecords: 0,
        onlineRecords: 0,
        offlineRecords: 0,
        averageParameterCount: 0,
        latestUpdate: null,
        dateRange: "Không có dữ liệu",
      };
    }

    const onlineRecords = dataList.filter(
      (r) => r.status && r.deviceStatus === 1
    ).length;
    const offlineRecords = dataList.length - onlineRecords;
    const totalParameters = dataList.reduce(
      (sum, record) => sum + Object.keys(record.data).length,
      0
    );
    const averageParameterCount = Math.round(totalParameters / dataList.length);

    const dates = dataList.map((r) => new Date(r.date + " " + r.time));
    const latestUpdate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const startDateStr = startDate.toLocaleDateString("vi-VN");
    const endDateStr = endDate.toLocaleDateString("vi-VN");
    const dateRange = `${startDateStr} - ${endDateStr}`;

    return {
      totalRecords: dataList.length,
      onlineRecords,
      offlineRecords,
      averageParameterCount,
      latestUpdate,
      dateRange,
    };
  };

  const updateParameterFilters = (dataList: GroupedData[]) => {
    const allParameters = new Set<string>();
    dataList.forEach((record) => {
      Object.keys(record.data).forEach((param) => allParameters.add(param));
    });

    const filters: ParameterFilter[] = Array.from(allParameters).map(
      (param) => ({
        id: param,
        name: param,
        displayName: getParameterDisplayName(param),
        selected: true,
      })
    );

    setParameterFilters(filters);
  };

  const exportData = async () => {
    if (filteredData.length === 0) {
      Alert.alert("Thông báo", "Không có dữ liệu để xuất");
      return;
    }

    try {
      let csvContent = "Ngày,Giờ,Công trình,Trạng thái";

      // Add parameter headers
      const allParameters = new Set<string>();
      filteredData.forEach((record) => {
        Object.keys(record.data).forEach((param) => allParameters.add(param));
      });

      const paramHeaders = Array.from(allParameters)
        .map(
          (param) =>
            `${getParameterDisplayName(param)} (${getUnitForParameter(param)})`
        )
        .join(",");

      csvContent += `,${paramHeaders}\n`;

      // Add data rows
      filteredData.forEach((record) => {
        const statusText = getStatusText(record.status, record.deviceStatus);
        let row = `${record.date},${record.time},${record.constructionName},${statusText}`;

        Array.from(allParameters).forEach((param) => {
          const value = record.data[param]?.value || "";
          row += `,${value}`;
        });

        csvContent += row + "\n";
      });

      await Share.share({
        message: csvContent,
        title: `Dữ liệu giám sát - ${
          selectedConstruction?.construction.tenCT || "Tất cả"
        }.csv`,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      Alert.alert("Lỗi", "Không thể xuất dữ liệu. Vui lòng thử lại.");
    }
  };

  const loadConstructions = async () => {
    setLoadingConstructions(true);
    try {
      const constructionData =
        await dataTransmissionService.getClientConstructions();
      setConstructions(constructionData || []);

      // Auto-select first construction if available
      if (constructionData && constructionData.length > 0) {
        setSelectedConstruction(constructionData[0]);
      }
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

  const loadData = async () => {
    if (!selectedConstruction) return;

    setLoading(true);
    try {
      const constructionCode = selectedConstruction.construction.maCT;
      if (!constructionCode) {
        Alert.alert("Lỗi", "Công trình chưa có mã để tra cứu dữ liệu");
        return;
      }

      const monitoringData = await giamSatService.getMonitoringDetails(
        constructionCode,
        startDate,
        endDate
      );

      const groupedData = groupDataByTime(monitoringData);
      setData(groupedData);
      setFilteredData(groupedData);

      // Calculate statistics
      const statsData = calculateStats(groupedData);
      setStats(statsData);

      // Update parameter filters
      updateParameterFilters(groupedData);
    } catch (error) {
      console.error("Error loading monitoring data:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu giám sát. Vui lòng thử lại.");
      setData([]);
      setFilteredData([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const groupDataByTime = (rawData: StoragePreDataDto[]): GroupedData[] => {
    const grouped: { [key: string]: GroupedData } = {};

    rawData.forEach((item) => {
      if (!item.time || !item.constructionCode) return;

      const timeKey = new Date(item.time).toISOString();

      if (!grouped[timeKey]) {
        grouped[timeKey] = {
          date: new Date(item.time).toLocaleDateString("vi-VN"),
          time: new Date(item.time).toLocaleTimeString("vi-VN"),
          constructionCode: item.constructionCode,
          constructionName:
            selectedConstruction?.construction.tenCT || "Chưa xác định",
          data: {},
          deviceStatus: item.deviceStatus || 0,
          status: item.status || false,
        };
      }

      if (item.parameterName && item.value !== undefined) {
        grouped[timeKey].data[item.parameterName] = {
          value: item.value,
          unit: item.unit || "",
        };
      }

      // Add data from data object if available
      if (item.data) {
        Object.entries(item.data).forEach(([key, value]) => {
          grouped[timeKey].data[key] = {
            value: value,
            unit: getUnitForParameter(key),
          };
        });
      }
    });

    return Object.values(grouped).sort(
      (a, b) =>
        new Date(b.date + " " + b.time).getTime() -
        new Date(a.date + " " + a.time).getTime()
    );
  };

  const getUnitForParameter = (parameterName: string): string => {
    const units: { [key: string]: string } = {
      MUATHUONGLUU: "mm",
      THUONGLUU: "m",
      HALUU: "m",
      DUNGTICH: "triệu m³",
      QDEN: "m³/s",
      QUATRAN: "m³/s",
      NHAMAY: "m³/s",
      DCTT: "m³/s",
      LUULUONGHADU: "m³/s",
      DUKIENLUULUONGHADU: "m³/s",
      MUCNUOCHODUKIEN12GIO: "m",
      nhietDo: "°C",
      PH: "pH",
      BOD: "mg/L",
      COD: "mg/L",
      DO: "mg/L",
      TSS: "mg/L",
      NH4: "mg/L",
    };
    return units[parameterName] || "";
  };

  const getParameterDisplayName = (parameterName: string): string => {
    const names: { [key: string]: string } = {
      MUATHUONGLUU: "Mưa thượng lưu",
      THUONGLUU: "Mực nước thượng lưu",
      HALUU: "Mực nước hạ lưu",
      DUNGTICH: "Dung tích hồ",
      QDEN: "Lưu lượng đến",
      QUATRAN: "Lưu lượng qua tràn",
      NHAMAY: "Lưu lượng qua nhà máy",
      DCTT: "Lưu lượng dòng chảy tối thiểu",
      LUULUONGHADU: "Lưu lượng hạ du",
      DUKIENLUULUONGHADU: "Dự kiến lưu lượng hạ du",
      MUCNUOCHODUKIEN12GIO: "Mực nước hồ dự kiến 12 giờ",
      nhietDo: "Nhiệt độ",
      PH: "Độ pH",
      BOD: "BOD",
      COD: "COD",
      DO: "Oxy hòa tan",
      TSS: "Chất rắn lơ lửng",
      NH4: "Ammonium",
    };
    return names[parameterName] || parameterName;
  };

  const handleConstructionSelect = (construction: BusinessConstructionDto) => {
    setSelectedConstruction(construction);
    setShowConstructionPicker(false);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleRecordPress = (record: GroupedData) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleParameterFilterToggle = (parameterId: string) => {
    setParameterFilters((prev) =>
      prev.map((filter) =>
        filter.id === parameterId
          ? { ...filter, selected: !filter.selected }
          : filter
      )
    );
  };

  const handleSelectAllParameters = () => {
    setParameterFilters((prev) =>
      prev.map((filter) => ({ ...filter, selected: true }))
    );
  };

  const handleDeselectAllParameters = () => {
    setParameterFilters((prev) =>
      prev.map((filter) => ({ ...filter, selected: false }))
    );
  };

  const handleQuickDateRange = (days: number) => {
    const newStartDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const newEndDate = new Date();
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const getStatusColor = (status: boolean, deviceStatus: number) => {
    if (!status) return "#EF4444"; // Red for inactive
    if (deviceStatus === 1) return "#10B981"; // Green for online
    return "#F59E0B"; // Yellow for warning
  };

  const getStatusText = (status: boolean, deviceStatus: number) => {
    if (!status) return "Không hoạt động";
    if (deviceStatus === 1) return "Trực tuyến";
    return "Cảnh báo";
  };

  const getStatusIcon = (status: boolean, deviceStatus: number) => {
    if (!status) return "close-circle";
    if (deviceStatus === 1) return "checkmark-circle";
    return "warning";
  };

  if (loading && !refreshing) {
    return <LoadingScreen message="Đang tải dữ liệu giám sát..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <AppHeader
        title="Tra cứu dữ liệu"
        subtitle="Xem số liệu đã truyền lên hệ thống"
        onBackPress={() => router.back()}
        rightIcon="download-outline"
        onRightPress={exportData}
      />

      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Filters Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}></View>

            {/* Construction Filter */}
            <TouchableOpacity
              style={styles.filterCard}
              onPress={() => setShowConstructionPicker(true)}
            >
              <View style={styles.filterHeader}>
                <Icon name="business-outline" size={22} color="#007AFF" />
                <Text style={styles.filterTitle}>Công trình</Text>
              </View>
              <Text style={styles.filterValue}>
                {selectedConstruction?.construction.tenCT ||
                  "Chọn công trình..."}
              </Text>
              <Icon name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Quick Date Range */}
            <View style={styles.filterCard}>
              <View style={styles.filterHeader}>
                <Icon name="time-outline" size={22} color="#007AFF" />
                <Text style={styles.filterTitle}>Khoảng thời gian nhanh</Text>
              </View>
              <View style={styles.quickDateButtons}>
                <TouchableOpacity
                  style={styles.quickDateBtn}
                  onPress={() => handleQuickDateRange(1)}
                >
                  <Text style={styles.quickDateText}>1 ngày</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDateBtn}
                  onPress={() => handleQuickDateRange(7)}
                >
                  <Text style={styles.quickDateText}>7 ngày</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDateBtn}
                  onPress={() => handleQuickDateRange(30)}
                >
                  <Text style={styles.quickDateText}>30 ngày</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Range Filter */}
            <View style={styles.dateRangeContainer}>
              <TouchableOpacity
                style={styles.dateCard}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Icon name="calendar-outline" size={20} color="#007AFF" />
                <View>
                  <Text style={styles.dateLabel}>Từ ngày</Text>
                  <Text style={styles.dateValue}>
                    {startDate.toLocaleDateString("vi-VN")}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateCard}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Icon name="calendar-outline" size={20} color="#007AFF" />
                <View>
                  <Text style={styles.dateLabel}>Đến ngày</Text>
                  <Text style={styles.dateValue}>
                    {endDate.toLocaleDateString("vi-VN")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Parameter Filter */}
            {parameterFilters.length > 0 && (
              <TouchableOpacity
                style={styles.filterCard}
                onPress={() => setShowParameterFilter(true)}
              >
                <View style={styles.filterHeader}>
                  <Icon name="options-outline" size={22} color="#007AFF" />
                  <Text style={styles.filterTitle}>Lọc tham số</Text>
                </View>
                <Text style={styles.filterValue}>
                  {parameterFilters.filter((f) => f.selected).length} /{" "}
                  {parameterFilters.length} tham số
                </Text>
                <Icon
                  name="chevron-forward-outline"
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Data List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dữ liệu giám sát</Text>
              <Text style={styles.dataCount}>
                {filteredData.length} bản ghi
              </Text>
            </View>

            {filteredData.length === 0 ? (
              <EmptyState
                icon="document-text-outline"
                title="Không có dữ liệu"
                description="Không tìm thấy dữ liệu giám sát trong khoảng thời gian đã chọn."
              />
            ) : (
              <FlatList
                data={filteredData}
                keyExtractor={(item, index) =>
                  `${item.constructionCode}-${item.date}-${item.time}-${index}`
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dataCard}
                    onPress={() => handleRecordPress(item)}
                  >
                    <View style={styles.dataHeader}>
                      <View style={styles.dataTime}>
                        <Text style={styles.dataDate}>{item.date}</Text>
                        <Text style={styles.dataTimeText}>{item.time}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: getStatusColor(
                              item.status,
                              item.deviceStatus
                            ),
                          },
                        ]}
                      >
                        <Icon
                          name={getStatusIcon(item.status, item.deviceStatus)}
                          size={16}
                          color="#fff"
                        />
                        <Text style={styles.statusText}>
                          {getStatusText(item.status, item.deviceStatus)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.dataContent}>
                      <View style={styles.parametersGrid}>
                        {Object.entries(item.data)
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <View key={key} style={styles.parameterItem}>
                              <Text style={styles.parameterName}>
                                {getParameterDisplayName(key)}
                              </Text>
                              <Text style={styles.parameterValue}>
                                {value.value} {value.unit}
                              </Text>
                            </View>
                          ))}
                      </View>

                      {Object.keys(item.data).length > 4 && (
                        <Text style={styles.moreParameters}>
                          +{Object.keys(item.data).length - 4} tham số khác
                        </Text>
                      )}
                    </View>

                    <View style={styles.dataFooter}>
                      <Icon
                        name="chevron-forward-outline"
                        size={20}
                        color="#9CA3AF"
                      />
                    </View>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Construction Picker Modal */}
      <Modal
        visible={showConstructionPicker}
        animationType="slide"
        transparent={true}
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
                <Text style={styles.loadingText}>
                  Đang tải danh sách công trình...
                </Text>
              </View>
            ) : constructions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="business-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyText}>Không có công trình nào</Text>
              </View>
            ) : (
              <FlatList
                style={styles.constructionList}
                data={constructions}
                keyExtractor={(item) =>
                  item.construction.maCT ||
                  item.construction.id?.toString() ||
                  Math.random().toString()
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.constructionItem,
                      selectedConstruction?.construction.maCT ===
                        item.construction.maCT &&
                        styles.selectedConstructionItem,
                    ]}
                    onPress={() => handleConstructionSelect(item)}
                  >
                    <View style={styles.constructionInfo}>
                      <Text style={styles.constructionName}>
                        {item.construction.tenCT}
                      </Text>
                      <Text style={styles.constructionCode}>
                        Mã: {item.construction.maCT}
                      </Text>
                    </View>
                    {selectedConstruction?.construction.maCT ===
                      item.construction.maCT && (
                      <Icon name="checkmark-circle" size={24} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Parameter Filter Modal */}
      <Modal
        visible={showParameterFilter}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowParameterFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lọc tham số</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowParameterFilter(false)}
              >
                <Icon name="close-outline" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.filterActionBtn}
                onPress={handleSelectAllParameters}
              >
                <Text style={styles.filterActionText}>Chọn tất cả</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterActionBtn}
                onPress={handleDeselectAllParameters}
              >
                <Text style={styles.filterActionText}>Bỏ chọn tất cả</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={parameterFilters}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.parameterFilterItem}
                  onPress={() => handleParameterFilterToggle(item.id)}
                >
                  <View style={styles.parameterFilterInfo}>
                    <Text style={styles.parameterFilterName}>
                      {item.displayName}
                    </Text>
                    <Text style={styles.parameterFilterCode}>{item.name}</Text>
                  </View>
                  <View
                    style={[
                      styles.parameterFilterCheckbox,
                      item.selected && styles.parameterFilterCheckboxSelected,
                    ]}
                  >
                    {item.selected && (
                      <Icon name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết dữ liệu</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDetailModal(false)}
              >
                <Icon name="close-outline" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedRecord && (
                <>
                  <View style={styles.detailHeader}>
                    <Text style={styles.detailTime}>
                      {selectedRecord.date} - {selectedRecord.time}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(
                            selectedRecord.status,
                            selectedRecord.deviceStatus
                          ),
                        },
                      ]}
                    >
                      <Icon
                        name={getStatusIcon(
                          selectedRecord.status,
                          selectedRecord.deviceStatus
                        )}
                        size={16}
                        color="#fff"
                      />
                      <Text style={styles.statusText}>
                        {getStatusText(
                          selectedRecord.status,
                          selectedRecord.deviceStatus
                        )}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailContent}>
                    <Text style={styles.detailSectionTitle}>
                      Thông tin công trình
                    </Text>
                    <View style={styles.detailInfoCard}>
                      <Text style={styles.detailInfoLabel}>
                        Tên công trình:
                      </Text>
                      <Text style={styles.detailInfoValue}>
                        {selectedRecord.constructionName}
                      </Text>
                    </View>
                    <View style={styles.detailInfoCard}>
                      <Text style={styles.detailInfoLabel}>Mã công trình:</Text>
                      <Text style={styles.detailInfoValue}>
                        {selectedRecord.constructionCode}
                      </Text>
                    </View>

                    <Text style={styles.detailSectionTitle}>
                      Các tham số đo đạc
                    </Text>
                    {Object.entries(selectedRecord.data).map(([key, value]) => (
                      <View key={key} style={styles.detailParameterCard}>
                        <Text style={styles.detailParameterName}>
                          {getParameterDisplayName(key)}
                        </Text>
                        <Text style={styles.detailParameterValue}>
                          {value.value} {value.unit}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  animatedContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  dataCount: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Statistics Styles
  statsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  statsFooter: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },

  // Filter Styles
  filterCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 12,
  },
  filterValue: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 12,
    flex: 2,
  },

  // Quick Date Buttons
  quickDateButtons: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  quickDateBtn: {
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  quickDateText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },

  // Date Range Styles
  dateRangeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  dateCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },

  // Data Card Styles
  dataCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  dataHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dataTime: {
    flex: 1,
  },
  dataDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  dataTimeText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  dataContent: {
    marginBottom: 12,
  },
  parametersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  parameterItem: {
    width: "48%",
    marginBottom: 8,
  },
  parameterName: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  parameterValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  moreParameters: {
    fontSize: 12,
    color: "#007AFF",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  dataFooter: {
    alignItems: "flex-end",
  },

  // Modal Styles
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
  modalBody: {
    flex: 1,
    padding: 20,
  },

  // Construction List Styles
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
  },

  // Parameter Filter Styles
  filterActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  filterActionText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  parameterFilterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  parameterFilterInfo: {
    flex: 1,
  },
  parameterFilterName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  parameterFilterCode: {
    fontSize: 14,
    color: "#6B7280",
  },
  parameterFilterCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  parameterFilterCheckboxSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },

  // Detail Modal Styles
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  detailTime: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  detailContent: {
    gap: 16,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  detailInfoCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  detailInfoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  detailInfoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  detailParameterCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailParameterName: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
  },
  detailParameterValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
});
