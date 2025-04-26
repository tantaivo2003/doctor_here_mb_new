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
import { BLOOD_PRESSURE_PERMISSIONS } from "../../services/healthConnect/permissions";
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
import { set } from "date-fns";

const displayOptions = [
  { title: "Ngày", icon: "calendar" },
  { title: "Tuần", icon: "calendar-week" },
  { title: "Tháng", icon: "calendar-month" },
  { title: "Năm", icon: "calendar-multiple" },
];

const BloodPressureScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  const [latestSystolicRecord, setLatestSystolicRecord] =
    useState<HealthRecord | null>(null);
  const [latestDiastolicRecord, setLatestDiastolicRecord] =
    useState<HealthRecord | null>(null);

  const [diastolicRecords, setDiastolicRecords] = useState<HealthRecord[]>([]);
  const [systolicRecords, setSystolicRecords] = useState<HealthRecord[]>([]);

  const [systolicDisplayOption, setSystolicDisplayOption] = useState("Tuần");
  const [diastolicDisplayOption, setDiastolicDisplayOption] = useState("Tuần");

  const [isChangeSystolic, setIsChangeSystolic] = useState(false);
  const [isChangeDiastolic, setIsChangeDiastolic] = useState(false);

  const [changeSystolicValue, setChangeSystolicValue] = useState("");
  const [changeDiastolicValue, setChangeDiastolicValue] = useState("");

  const init = async () => {
    await initializeHealthConnect();
    const hasPermission = await checkAndRequestPermissions(
      BLOOD_PRESSURE_PERMISSIONS
    );
    return hasPermission;
  };

  const fetchLatestData = async () => {
    const latestBloodPressureRecord = await fetchLatestHealthRecord(
      "BloodPressure"
    );

    if (latestBloodPressureRecord) {
      setLatestSystolicRecord({
        value: latestBloodPressureRecord.systolic,
        date: latestBloodPressureRecord.time,
      });
      setLatestDiastolicRecord({
        value: latestBloodPressureRecord.diastolic,
        date: latestBloodPressureRecord.time,
      });
    }
  };

  const fetchRecords = async () => {
    const now = new Date();
    const past = new Date();
    past.setMonth(now.getMonth() - 12); // lấy trong 12 tháng gần nhất

    const diastolicInterval = convertOptionToInterval(diastolicDisplayOption);
    const systolicInterval = convertOptionToInterval(systolicDisplayOption);

    const diastolicData = await fetchAndGroupHealthRecords(
      "BloodPressure",
      past.toISOString(),
      now.toISOString(),
      diastolicInterval,
      true,
      false
    );

    const systolicData = await fetchAndGroupHealthRecords(
      "BloodPressure",
      past.toISOString(),
      now.toISOString(),
      systolicInterval,
      false,
      true
    );

    if (diastolicData) {
      setDiastolicRecords(diastolicData);
    }
    if (systolicData) {
      setSystolicRecords(systolicData);
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
      fetchLatestData();
      fetchRecords();

      setLoading(false);
    };

    initAndFetch();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [diastolicDisplayOption, systolicDisplayOption]);

  const handleSaveData = async (value: string, label: string) => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      if (label === "huyết áp tâm thu") {
        const systolicValue = parseFloat(value);
        if (isNaN(systolicValue)) {
          Toast.show({
            type: "error",
            text1: "Giá trị huyết áp tâm thu không hợp lệ!",
          });
          return;
        }
        await insertHealthRecord("BloodPressure", {
          systolic: changeSystolicValue,
          diastolic: latestDiastolicRecord?.value,
        });
        setLatestSystolicRecord({ value: systolicValue, date: now });
      } else {
        const diastolicValue = parseFloat(value);
        if (isNaN(diastolicValue)) {
          Toast.show({
            type: "error",
            text1: "Giá trị huyết áp tâm trương không hợp lệ!",
          });
          return;
        }
        await insertHealthRecord("BloodPressure", {
          systolic: latestSystolicRecord?.value,
          diastolic: changeDiastolicValue,
        });
        setLatestDiastolicRecord({ value: diastolicValue, date: now });
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
            label="Huyết áp tâm thu"
            unit="mmHg"
            value={latestSystolicRecord?.value}
            imageSource={require("../../assets/healthMetrics/bloodPressure1.png")}
            onPress={() => setIsChangeSystolic(true)}
          />
          <HealthMetricCard
            label="Huyết áp tâm trương"
            unit="mmHg"
            value={latestDiastolicRecord?.value}
            imageSource={require("../../assets/healthMetrics/bloodPressure2.png")}
            onPress={() => setIsChangeDiastolic(true)}
          />
        </View>
      )}

      {systolicRecords.length > 0 && (
        <>
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-bold">
                Biểu đồ huyết áp tâm trương
              </Text>
            </View>
            <View className="w-40">
              <SelectField
                label=""
                data={displayOptions}
                value={systolicDisplayOption || ""}
                placeholder="Kiểu hiển thị"
                onChange={(val) => setSystolicDisplayOption(val)}
              />
            </View>
          </View>
          <HealthMetricsLineChart healthMetricsLineData={systolicRecords} />
        </>
      )}
      {/* Biểu đồ height */}
      {diastolicRecords.length > 0 && (
        <>
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-bold">
                Biểu đồ huyết áp tâm thu
              </Text>
            </View>
            <View className="w-40">
              <SelectField
                label=""
                data={displayOptions}
                value={diastolicDisplayOption || ""}
                placeholder="Kiểu hiển thị"
                onChange={(val) => setDiastolicDisplayOption(val)}
              />
            </View>
          </View>
          <HealthMetricsLineChart healthMetricsLineData={diastolicRecords} />
        </>
      )}

      <HealthDataInputModal
        isVisible={isChangeSystolic}
        label={"huyết áp tâm thu"}
        setModalVisible={setIsChangeSystolic}
        value={changeSystolicValue}
        setValue={setChangeSystolicValue}
        handleSaveData={handleSaveData}
      />

      <HealthDataInputModal
        isVisible={isChangeDiastolic}
        label={"huyết áp tâm trương"}
        setModalVisible={setIsChangeDiastolic}
        value={changeDiastolicValue}
        setValue={setChangeDiastolicValue}
        handleSaveData={handleSaveData}
      />
    </ScrollView>
  );
};
export default BloodPressureScreen;
