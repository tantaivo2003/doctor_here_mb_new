import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// UI Components
import Toast from "react-native-toast-message";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import HealthMetricsLineChart from "../../components/HealthMetrics/HealthMetricsLineChart";
import HealthMetricCard from "../../components/HealthMetrics/HealthMetricCard";
import HealthDataInputModal from "../../components/HealthMetrics/HealthDataInputModal";
import { useTimeFilter } from "./useTimeFilter";
import TimeNavigator from "../../components/ui/TimeNavigator";

// Local storage
import { getUserID } from "../../services/storage";

// Health Connect Permissions & Initialization
import { HEART_SCREEN_PERMISSIONS } from "../../services/healthConnect/permissions";
import {
  checkAndRequestPermissions,
  revokePermissions,
  readGrantedPermissions,
} from "../../services/healthConnect/healthConnectPermissions";
import { initializeHealthConnect } from "../../services/healthConnect/healthConnect";

// Health Records
import { fetchHealthRecords } from "../../utils/readHealthRecords";
import { insertHealthRecord } from "../../utils/insertHealthRecord";
import {
  groupHealthRecordsByPeriod,
  fetchAndGroupHealthRecords,
} from "../../utils/groupHealthRecordsByPeriod";

// Utility functions
import SelectField from "../../components/ui/SelectField";
import {
  convertOptionToInterval,
  mapDisplayOptionToType,
} from "../../utils/validators";

// Types
import { HealthRecord } from "../../types/types";

import {
  fetchBreathRateData,
  fetchHeartRateData,
  fetchLatestHealthRecord,
  postSimpleMetric,
} from "../../api/HealthMetrics";
import { set } from "date-fns";

const displayOptions = [
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

  const {
    currentDate: heartRateDate,
    getStartEndDate: getHeartRateStartEndDate,
    handleChange: handleHeartRateChange,
  } = useTimeFilter();
  const {
    currentDate: respiratoryRateDate,
    getStartEndDate: getRespiratoryRateStartEndDate,
    handleChange: handleRespiratoryRateChange,
  } = useTimeFilter();

  // const init = async () => {
  //   await initializeHealthConnect();
  //   const hasPermission = await checkAndRequestPermissions(
  //     HEART_SCREEN_PERMISSIONS
  //   );
  //   return hasPermission;
  // };

  // Lấy dữ liệu mới nhất đã lưu khi mở màn hình
  useEffect(() => {
    const getHeartRate = async () => {
      setLoading(true);
      const ptID = await getUserID();
      if (!ptID) {
        console.error("Không tìm thấy ID người dùng");
        return;
      }

      const heartbeat = await fetchLatestHealthRecord("heartbeat", ptID);
      const breath = await fetchLatestHealthRecord("breath", ptID);

      if (heartbeat && !Array.isArray(heartbeat) && "value" in heartbeat) {
        setLatestHeartRateRecord(heartbeat as HealthRecord);
      }

      if (breath && !Array.isArray(breath) && "value" in breath) {
        setLatestRespiratoryRateRecord(breath as HealthRecord);
      }

      setLoading(false);
    };

    getHeartRate();
  }, []);

  useEffect(() => {
    const fetchHeartRate = async () => {
      try {
        setLoading(true);
        const ptID = await getUserID();
        if (!ptID) {
          console.error("Không tìm thấy ID người dùng");
          return;
        }

        const type = mapDisplayOptionToType(heartRateDisplayOption);
        const { startDate, endDate } = getHeartRateStartEndDate(
          heartRateDisplayOption
        );

        const heartRateData = await fetchHeartRateData(
          ptID,
          type,
          startDate,
          endDate
        );
        setHeartRateRecords(heartRateData);
        console.log("heartRateData:", heartRateData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu nhịp tim", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeartRate();
  }, [heartRateDisplayOption, heartRateDate]);

  useEffect(() => {
    const fetchRespiratoryRate = async () => {
      try {
        setLoading(true);
        const ptID = await getUserID();
        if (!ptID) {
          console.error("Không tìm thấy ID người dùng");
          return;
        }

        const type = mapDisplayOptionToType(respiratoryRateDisplayOption);
        const { startDate, endDate } = getRespiratoryRateStartEndDate(
          respiratoryRateDisplayOption
        );

        const respiratoryRateData = await fetchBreathRateData(
          ptID,
          type,
          startDate,
          endDate
        );
        setRespiratoryRateRecords(respiratoryRateData);
        console.log("respiratoryRateData:", respiratoryRateData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu nhịp thở", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRespiratoryRate();
  }, [respiratoryRateDisplayOption, respiratoryRateDate]);

  const handleSaveData = async (value: string, label: string) => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const ptID = await getUserID();
      if (!ptID) {
        Toast.show({
          type: "error",
          text1: "Không tìm thấy ID người dùng!",
        });
        return;
      }
      if (label === "nhịp tim") {
        const heartRate = parseFloat(value);
        if (isNaN(heartRate)) {
          Toast.show({
            type: "error",
            text1: "Giá trị nhịp tim không hợp lệ!",
          });
          return;
        }
        await insertHealthRecord("HeartRate", heartRate, now);
        await postSimpleMetric(ptID, "heartbeat", heartRate, now);
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
        await insertHealthRecord("RespiratoryRate", respiratoryRate, now);
        await postSimpleMetric(ptID, "breath", respiratoryRate, now);
        setLatestRespiratoryRateRecord({ value: respiratoryRate, date: now });
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      Toast.show({ type: "error", text1: "Lỗi khi lưu dữ liệu!" });
    } finally {
      setLoading(false);
      navigation.replace("HeartRateScreen");
    }
  };

  const getHeartRateStatus = (heartRate: number, respiratoryRate: number) => {
    if (heartRate < 60 || respiratoryRate < 12) {
      return {
        color: "bg-blue-100",
        textColor: "text-blue-700",
        status: "Nhịp tim/thở thấp",
        advice:
          "Bạn nên tham khảo ý kiến bác sĩ nếu có triệu chứng bất thường.",
      };
    } else if (heartRate <= 100 && respiratoryRate <= 20) {
      return {
        color: "bg-green-100",
        textColor: "text-green-700",
        status: "Nhịp tim/thở bình thường",
        advice: "Tiếp tục duy trì lối sống lành mạnh!",
      };
    } else {
      return {
        color: "bg-red-100",
        textColor: "text-red-700",
        status: "Nhịp tim/thở cao",
        advice: "Bạn nên giảm căng thẳng và theo dõi sức khỏe chặt chẽ.",
      };
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
      {latestHeartRateRecord != null &&
        latestRespiratoryRateRecord != null &&
        (() => {
          const { color, textColor, status, advice } = getHeartRateStatus(
            latestHeartRateRecord.value,
            latestRespiratoryRateRecord.value
          );

          return (
            <View className={`${color} p-4 rounded-lg mb-4`}>
              <Text className={`${textColor} font-semibold text-center`}>
                {status}: Nhịp tim của bạn là{" "}
                <Text className="font-bold">
                  {latestHeartRateRecord.value} bpm
                </Text>{" "}
                và nhịp thở là{" "}
                <Text className="font-bold">
                  {latestRespiratoryRateRecord.value} lần/phút
                </Text>
                . {advice}
              </Text>
            </View>
          );
        })()}

      {/* Biểu đồ height */}
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

        <TimeNavigator
          displayOption={heartRateDisplayOption}
          currentDate={heartRateDate}
          onChange={handleHeartRateChange}
        />

        {heartRateRecords.length > 0 ? (
          <HealthMetricsLineChart healthMetricsLineData={heartRateRecords} />
        ) : (
          <View className="items-center justify-center my-10">
            <Text className="text-gray-500">Không có dữ liệu</Text>
          </View>
        )}
      </>

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
        <TimeNavigator
          displayOption={respiratoryRateDisplayOption}
          currentDate={respiratoryRateDate}
          onChange={handleRespiratoryRateChange}
        />

        {respiratoryRateRecords.length > 0 ? (
          <HealthMetricsLineChart
            healthMetricsLineData={respiratoryRateRecords}
          />
        ) : (
          <View className="items-center justify-center my-10">
            <Text className="text-gray-500">Không có dữ liệu</Text>
          </View>
        )}
      </>

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
