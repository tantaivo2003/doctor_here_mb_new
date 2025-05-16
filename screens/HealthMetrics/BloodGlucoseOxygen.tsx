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
  fetchBloodGlucoseData,
  fetchBloodOxygenData,
  fetchLatestHealthRecord,
  postSimpleMetric,
} from "../../api/HealthMetrics";
import { set } from "date-fns";

const displayOptions = [
  { title: "Tuần", icon: "calendar-week" },
  { title: "Tháng", icon: "calendar-month" },
  { title: "Năm", icon: "calendar-multiple" },
];

const BloodGlucoseOxygenScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  const [latestBloodGlucoseRecord, setLatestBloodGlucoseRecord] =
    useState<HealthRecord | null>(null);
  const [latestOxygenSaturationRecord, setLatestOxygenSaturationRecord] =
    useState<HealthRecord | null>(null);

  const [bloodGlucoseRecords, setBloodGlucoseRecords] = useState<
    HealthRecord[]
  >([]);
  const [oxygenSaturationRecords, setOxygenSaturationRecords] = useState<
    HealthRecord[]
  >([]);

  const [bloodGlucoseDisplayOption, setBloodGlucoseDisplayOption] =
    useState("Tuần");
  const [oxygenSaturationDisplayOption, setOxygenSaturationDisplayOption] =
    useState("Tuần");

  const [isChangeBloodGlucose, setIsChangeBloodGlucose] = useState(false);
  const [isChangeOxygenSaturation, setIsChangeOxygenSaturation] =
    useState(false);

  const [changeBloodGlucoseValue, setChangeBloodGlucoseValue] = useState("");
  const [changeOxygenSaturationValue, setChangeOxygenSaturationValue] =
    useState("");

  const {
    currentDate: bloodGlucoseDate,
    getStartEndDate: getBloodGlucoseStartEndDate,
    handleChange: handleBloodGlucoseDateChange,
  } = useTimeFilter();

  const {
    currentDate: oxygenSaturationDate,
    getStartEndDate: getOxygenSaturationStartEndDate,
    handleChange: handleOxygenSaturationDateChange,
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
    const fetchLatestBloodData = async () => {
      setLoading(true);
      const ptID = await getUserID();
      if (!ptID) {
        console.error("Không tìm thấy ID người dùng");
        setLoading(false);
        return;
      }

      const latestBloodGlucose = await fetchLatestHealthRecord(
        "blood_sugar",
        ptID
      );
      const latestOxygenSaturation = await fetchLatestHealthRecord(
        "blood_oxygen",
        ptID
      );

      if (
        latestBloodGlucose &&
        !Array.isArray(latestBloodGlucose) &&
        "value" in latestBloodGlucose
      ) {
        setLatestBloodGlucoseRecord(latestBloodGlucose as HealthRecord);
      }

      if (
        latestOxygenSaturation &&
        !Array.isArray(latestOxygenSaturation) &&
        "value" in latestOxygenSaturation
      ) {
        setLatestOxygenSaturationRecord(latestOxygenSaturation as HealthRecord);
      }

      setLoading(false);
    };

    fetchLatestBloodData();
  }, []);

  useEffect(() => {
    const fetchOxygenSaturationRecords = async () => {
      try {
        setLoading(true);
        const ptID = await getUserID();
        if (!ptID) {
          console.error("Không tìm thấy ID người dùng");
          return;
        }

        const type = mapDisplayOptionToType(oxygenSaturationDisplayOption);
        const { startDate, endDate } = getOxygenSaturationStartEndDate(
          oxygenSaturationDisplayOption
        );

        const oxygenData = await fetchBloodOxygenData(
          ptID,
          type,
          startDate,
          endDate
        );
        setOxygenSaturationRecords(oxygenData);
        console.log("oxygenData:", oxygenData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu oxy máu", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOxygenSaturationRecords();
  }, [oxygenSaturationDisplayOption, oxygenSaturationDate]);

  useEffect(() => {
    const fetchBloodGlucoseRecords = async () => {
      try {
        setLoading(true);
        const ptID = await getUserID();
        if (!ptID) {
          console.error("Không tìm thấy ID người dùng");
          return;
        }

        const type = mapDisplayOptionToType(bloodGlucoseDisplayOption);
        const { startDate, endDate } = getBloodGlucoseStartEndDate(
          bloodGlucoseDisplayOption
        );

        const bloodGlucoseData = await fetchBloodGlucoseData(
          ptID,
          type,
          startDate,
          endDate
        );
        setBloodGlucoseRecords(bloodGlucoseData);
        console.log("bloodGlucoseData:", bloodGlucoseData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu glucose máu", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodGlucoseRecords();
  }, [bloodGlucoseDisplayOption, bloodGlucoseDate]);

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

      if (label === "Đường huyết") {
        const bloodGlucose = parseFloat(value);
        if (isNaN(bloodGlucose)) {
          Toast.show({
            type: "error",
            text1: "Giá trị đường huyết không hợp lệ!",
          });
          return;
        }
        // Insert blood glucose record
        await insertHealthRecord("BloodGlucose", bloodGlucose, now);
        await postSimpleMetric(ptID, "blood_sugar", bloodGlucose, now);
        setLatestBloodGlucoseRecord({ value: bloodGlucose, date: now });
      } else if (label === "Độ bão hòa oxy") {
        const oxygenSaturation = parseFloat(value);
        if (isNaN(oxygenSaturation)) {
          Toast.show({
            type: "error",
            text1: "Giá trị độ bão hòa oxy không hợp lệ!",
          });
          return;
        }
        // Insert oxygen saturation record
        await insertHealthRecord("OxygenSaturation", oxygenSaturation, now);
        await postSimpleMetric(ptID, "blood_oxygen", oxygenSaturation, now);

        // Update oxygen saturation records
        setOxygenSaturationRecords((prevRecords) => [
          ...prevRecords,
          { value: oxygenSaturation, date: now },
        ]);
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      Toast.show({ type: "error", text1: "Lỗi khi lưu dữ liệu!" });
    } finally {
      navigation.replace("BloodGlucoseOxygenScreen");
      setLoading(false);
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
            label="Glucose máu"
            unit="mg/dL"
            value={latestBloodGlucoseRecord?.value}
            imageSource={require("../../assets/healthMetrics/respiratoryRate.png")}
            onPress={() => setIsChangeBloodGlucose(true)}
          />
          <HealthMetricCard
            label="Oxy máu"
            unit="%"
            value={latestOxygenSaturationRecord?.value}
            imageSource={require("../../assets/healthMetrics/respiratoryRate.png")}
            onPress={() => setIsChangeOxygenSaturation(true)}
          />
        </View>
      )}
      {/* {latestBloodGlucoseRecord != null &&
        latestBloodOxygenRecord != null &&
        (() => {
          const { color, textColor, status, advice } = getHeartRateStatus(
            latestBloodGlucoseRecord.value,
            latestBloodOxygenRecord.value
          );

          return (
            <View className={`${color} p-4 rounded-lg mb-4`}>
              <Text className={`${textColor} font-semibold text-center`}>
                {status}: Nhịp tim của bạn là{" "}
                <Text className="font-bold">
                  {latestBloodGlucoseRecord.value} bpm
                </Text>{" "}
                và nhịp thở là{" "}
                <Text className="font-bold">
                  {latestBloodOxygenRecord.value} lần/phút
                </Text>
                . {advice}
              </Text>
            </View>
          );
        })()} */}

      {/* Biểu đồ height */}
      <>
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-bold">Biểu đồ Glucose máu</Text>
          </View>
          <View className="w-40">
            <SelectField
              label=""
              data={displayOptions}
              value={bloodGlucoseDisplayOption || ""}
              placeholder="Kiểu hiển thị"
              onChange={(val) => setBloodGlucoseDisplayOption(val)}
            />
          </View>
        </View>

        <TimeNavigator
          displayOption={bloodGlucoseDisplayOption}
          currentDate={bloodGlucoseDate}
          onChange={handleBloodGlucoseDateChange}
        />

        {bloodGlucoseRecords.length > 0 ? (
          <HealthMetricsLineChart healthMetricsLineData={bloodGlucoseRecords} />
        ) : (
          <View className="items-center justify-center my-10">
            <Text className="text-gray-500">Không có dữ liệu</Text>
          </View>
        )}
      </>

      <>
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-bold">Biểu đồ Oxy máu</Text>
          </View>
          <View className="w-40">
            <SelectField
              label=""
              data={displayOptions}
              value={oxygenSaturationDisplayOption || ""}
              placeholder="Kiểu hiển thị"
              onChange={(val) => setOxygenSaturationDisplayOption(val)}
            />
          </View>
        </View>

        <TimeNavigator
          displayOption={oxygenSaturationDisplayOption}
          currentDate={oxygenSaturationDate}
          onChange={handleOxygenSaturationDateChange}
        />

        {oxygenSaturationRecords.length > 0 ? (
          <HealthMetricsLineChart
            healthMetricsLineData={oxygenSaturationRecords}
          />
        ) : (
          <View className="items-center justify-center my-10">
            <Text className="text-gray-500">Không có dữ liệu</Text>
          </View>
        )}
      </>

      <HealthDataInputModal
        isVisible={isChangeBloodGlucose}
        label={"Đường huyết"}
        setModalVisible={setIsChangeBloodGlucose}
        value={changeBloodGlucoseValue}
        setValue={setChangeBloodGlucoseValue}
        handleSaveData={handleSaveData}
      />

      <HealthDataInputModal
        isVisible={isChangeOxygenSaturation}
        label={"Độ bão hòa oxy"}
        setModalVisible={setIsChangeOxygenSaturation}
        value={changeOxygenSaturationValue}
        setValue={setChangeOxygenSaturationValue}
        handleSaveData={handleSaveData}
      />
    </ScrollView>
  );
};
export default BloodGlucoseOxygenScreen;
