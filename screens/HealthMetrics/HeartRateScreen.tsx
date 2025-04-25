import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// UI Components
import Toast from "react-native-toast-message";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import HealthMetricsLineChart from "../../components/HealthMetrics/HealthMetricsLineChart";
import HealthMetricCard from "../../components/HealthMetrics/HealthMetricCard";
import HealthDataInputModal from "../../components/HealthMetrics/HealthDataInputModal";

// Local storage
import { storeHealthData, getHealthData } from "../../services/storage";

// Health Connect Permissions & Initialization
import { HEART_SCREEN_PERMISSIONS } from "../../services/healthConnect/permissions";
import {
  checkAndRequestPermissions,
  revokePermissions,
  readGrantedPermissions,
} from "../../services/healthConnect/healthConnectPermissions";
import { initializeHealthConnect } from "../../services/healthConnect/healthConnect";

// Health Records
import {
  fetchHealthRecords,
  fetchLatestHealthRecord,
} from "../../utils/readHealthRecords";
import { insertHealthRecord } from "../../utils/insertHealthRecord";
import {
  groupHealthRecordsByPeriod,
  fetchAndGroupHealthRecords,
} from "../../utils/groupHealthRecordsByPeriod";

// Utility functions
import SelectField from "../../components/ui/SelectField";
import { convertOptionToInterval } from "../../utils/validators";

// Types
import { HealthRecord } from "../../types/types";

const displayOptions = [
  { title: "Ngày", icon: "calendar" },
  { title: "Tuần", icon: "calendar-week" },
  { title: "Tháng", icon: "calendar-month" },
  { title: "Năm", icon: "calendar-multiple" },
];

const HeartRateScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  const [latestHeartRateRecord, setLatestHeartRateRecord] =
    useState<HealthRecord | null>(null);
  const [latestRespiratoryRateRecord, setLatestRespiratoryRateRecord] =
    useState<HealthRecord | null>(null);

  const [heartRateRecords, setHeartRateRecords] = useState<HealthRecord[]>([]);
  const [respiratoryRateRecords, setRespiratoryRateRecords] = useState<
    HealthRecord[]
  >([]);

  const [heartRateDisplayOption, setHeartRateDisplayOption] = useState("Tuần");
  const [respiratoryRateDisplayOption, setRespiratoryRateDisplayOption] =
    useState("Tuần");

  const [isChangeHeartRate, setIsChangeHeartRate] = useState(false);
  const [isChangeRespiratoryRate, setIsChangeRespiratoryRate] = useState(false);

  const [changeHeartRateValue, setChangeHeartRateValue] = useState("");
  const [changeRespiratoryRateValue, setChangeRespiratoryRateValue] =
    useState("");

  const init = async () => {
    await initializeHealthConnect();
    const hasPermission = await checkAndRequestPermissions(
      HEART_SCREEN_PERMISSIONS
    );
    return hasPermission;
  };

  const fetchLatestData = async () => {
    const latestHeartRate = await fetchLatestHealthRecord("HeartRate");
    const latestRespiratoryRate = await fetchLatestHealthRecord(
      "RespiratoryRate"
    );

    if (latestHeartRate) {
      setLatestHeartRateRecord({
        value: latestHeartRate.value,
        date: latestHeartRate.date,
      });
    }

    if (latestRespiratoryRate) {
      setLatestRespiratoryRateRecord({
        value: latestRespiratoryRate.value,
        date: latestRespiratoryRate.date,
      });
    }
  };
  const fetchRecords = async () => {
    const now = new Date();
    const past = new Date();
    past.setMonth(now.getMonth() - 12); // lấy trong 12 tháng gần nhất

    const heartRateInterval = convertOptionToInterval(heartRateDisplayOption);
    const respiratoryRateInterval = convertOptionToInterval(
      respiratoryRateDisplayOption
    );

    const heartRateData = await fetchAndGroupHealthRecords(
      "HeartRate",
      past.toISOString(),
      now.toISOString(),
      heartRateInterval
    );

    const respiratoryRateData = await fetchAndGroupHealthRecords(
      "RespiratoryRate",
      past.toISOString(),
      now.toISOString(),
      respiratoryRateInterval
    );
    if (heartRateData) {
      setHeartRateRecords(heartRateData);
    }
    if (respiratoryRateData) {
      setRespiratoryRateRecords(respiratoryRateData);
    }
  };

  useEffect(() => {
    const initAndFetch = async () => {
      setLoading(true);
      const hasPermission = await init();
      if (!hasPermission) {
        navigation.goBack();
        return;
      }
      await fetchLatestData();
      setLoading(false);
    };

    initAndFetch();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [heartRateDisplayOption, respiratoryRateDisplayOption]);

  const handleSaveData = async (value: string, label: string) => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      if (label === "nhịp tim") {
        const heartRate = parseFloat(value);
        if (isNaN(heartRate)) {
          Toast.show({
            type: "error",
            text1: "Giá trị nhịp tim không hợp lệ!",
          });
          return;
        }
        await insertHealthRecord("HeartRate", heartRate);
        setLatestHeartRateRecord({ value: heartRate, date: now });
      } else {
        const respiratoryRate = parseFloat(value);
        if (isNaN(respiratoryRate)) {
          Toast.show({
            type: "error",
            text1: "Giá trị nhịp thở không hợp lệ!",
          });
          return;
        }
        await insertHealthRecord("RespiratoryRate", respiratoryRate);
        setLatestRespiratoryRateRecord({ value: respiratoryRate, date: now });
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      Toast.show({ type: "error", text1: "Lỗi khi lưu dữ liệu!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <View className="flex-row justify-between mb-4">
          <HealthMetricCard
            label="Nhịp tim"
            unit="lần/phút"
            value={latestHeartRateRecord?.value}
            imageSource={require("../../assets/healthMetrics/heartRate.png")}
            onPress={() => setIsChangeHeartRate(true)}
          />
          <HealthMetricCard
            label="Nhịp thở"
            unit="lần/phút"
            value={latestRespiratoryRateRecord?.value}
            imageSource={require("../../assets/healthMetrics/respiratoryRate.png")}
            onPress={() => setIsChangeRespiratoryRate(true)}
          />
        </View>
      )}

      {/* Biểu đồ height */}
      {heartRateRecords.length > 0 && (
        <>
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-bold">Biểu đồ nhịp tim</Text>
            </View>
            <View className="w-40">
              <SelectField
                label=""
                data={displayOptions}
                value={heartRateDisplayOption || ""}
                placeholder="Kiểu hiển thị"
                onChange={(val) => setHeartRateDisplayOption(val)}
              />
            </View>
          </View>
          <HealthMetricsLineChart healthMetricsLineData={heartRateRecords} />
        </>
      )}

      {respiratoryRateRecords.length > 0 && (
        <>
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-bold">Biểu đồ nhịp thở</Text>
            </View>
            <View className="w-40">
              <SelectField
                label=""
                data={displayOptions}
                value={respiratoryRateDisplayOption || ""}
                placeholder="Kiểu hiển thị"
                onChange={(val) => setRespiratoryRateDisplayOption(val)}
              />
            </View>
          </View>
          <HealthMetricsLineChart
            healthMetricsLineData={respiratoryRateRecords}
          />
        </>
      )}

      <HealthDataInputModal
        isVisible={isChangeHeartRate}
        label={"nhịp tim"}
        setModalVisible={setIsChangeHeartRate}
        value={changeHeartRateValue}
        setValue={setChangeHeartRateValue}
        handleSaveData={handleSaveData}
      />

      <HealthDataInputModal
        isVisible={isChangeRespiratoryRate}
        label={"nhịp thở"}
        setModalVisible={setIsChangeRespiratoryRate}
        value={changeRespiratoryRateValue}
        setValue={setChangeRespiratoryRateValue}
        handleSaveData={handleSaveData}
      />
    </ScrollView>
  );
};
export default HeartRateScreen;
