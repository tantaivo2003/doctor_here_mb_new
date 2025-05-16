import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// UI Components
import Toast from "react-native-toast-message";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import HealthMetricsDoubleLineChart from "../../components/HealthMetrics/HealthMetricsDoubleLineChart";
import HealthMetricCard from "../../components/HealthMetrics/HealthMetricCard";
import HealthDataInputModal from "../../components/HealthMetrics/HealthDataInputModal";
import { useTimeFilter } from "./useTimeFilter";
import TimeNavigator from "../../components/ui/TimeNavigator";

// Local storage
import { getUserID } from "../../services/storage";

// Health Connect Permissions & Initialization
import { BLOOD_PRESSURE_PERMISSIONS } from "../../services/healthConnect/permissions";
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
import { FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
// Types
import { HealthRecord, BloodPressureHealthRecord } from "../../types/types";
import { set } from "date-fns";

import {
  fetchBloodPressureData,
  fetchLatestHealthRecord,
  postBloodPressure,
} from "../../api/HealthMetrics";

const displayOptions = [
  { title: "Tuần", icon: "calendar-week" },
  { title: "Tháng", icon: "calendar-month" },
  { title: "Năm", icon: "calendar-multiple" },
];

const BloodPressureScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  const [latestBloodPressureRecord, setLatestBloodPressure] =
    useState<BloodPressureHealthRecord | null>(null);
  const [bloodPressureRecords, setBloodPressureRecords] = useState<
    BloodPressureHealthRecord[]
  >([]);

  const [bloodPressureDisplayOption, setBloodPressureDisplayOption] =
    useState("Tuần");

  const [isChangeBloodPressure, setIsChangeBloodPressure] = useState(false);
  const [changeSystolicValue, setChangeSystolicValue] = useState("120");
  const [changeDiastolicValue, setChangeDiastolicValue] = useState("80");

  const {
    currentDate: bloodPressureDate,
    getStartEndDate: getBloodPressureStartEndDate,
    handleChange: handleBloodPressureChange,
  } = useTimeFilter();

  // const init = async () => {
  //   await initializeHealthConnect();
  //   const hasPermission = await checkAndRequestPermissions(
  //     BLOOD_PRESSURE_PERMISSIONS
  //   );
  //   return hasPermission;
  // };

  // Lấy dữ liệu mới nhất đã lưu khi mở màn hình
  useEffect(() => {
    const getBloodPressure = async () => {
      setLoading(true);
      const ptID = await getUserID();
      if (!ptID) {
        console.error("Không tìm thấy ID người dùng");
        return;
      }
      const result = await fetchLatestHealthRecord("blood_pressure", ptID);

      if (
        result &&
        !Array.isArray(result) &&
        "systolic" in result &&
        "diastolic" in result
      ) {
        setLatestBloodPressure(result);
      } else {
        console.warn(
          "Dữ liệu không đúng kiểu BloodPressureHealthRecord",
          result
        );
      }
      setLoading(false);
    };

    getBloodPressure();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ptID = await getUserID();
        if (!ptID) {
          console.error("Không tìm thấy ID người dùng");
          return;
        }
        const type = mapDisplayOptionToType(bloodPressureDisplayOption);
        const { startDate, endDate } = getBloodPressureStartEndDate(
          bloodPressureDisplayOption
        );

        const bloodPressureData = await fetchBloodPressureData(
          ptID,
          type,
          startDate,
          endDate
        );
        setBloodPressureRecords(bloodPressureData);
        console.log("bloodPressureData Data:", bloodPressureData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu BMI", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bloodPressureDisplayOption, bloodPressureDate]);

  const handleSaveData = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();

      const systolicValue = parseFloat(changeSystolicValue);
      const diastolicValue = parseFloat(changeDiastolicValue);

      if (isNaN(systolicValue) || isNaN(diastolicValue)) {
        Toast.show({
          type: "error",
          text1: "Giá trị huyết áp không hợp lệ!",
        });
        return;
      }
      await insertHealthRecord(
        "BloodPressure",
        {
          systolic: systolicValue,
          diastolic: diastolicValue,
        },
        now
      );
      // Lấy ID người dùng
      const ptID = await getUserID();
      if (!ptID) {
        Toast.show({
          type: "error",
          text1: "Không tìm thấy ID người dùng!",
        });
        return;
      }

      // Gửi dữ liệu lên server
      await postBloodPressure(ptID, systolicValue, diastolicValue, now);

      setLatestBloodPressure({
        date: now,
        systolic: systolicValue,
        diastolic: diastolicValue,
      });
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      Toast.show({ type: "error", text1: "Lỗi khi lưu dữ liệu!" });
    } finally {
      setLoading(false);
      navigation.replace("BloodPressureScreen");
    }
  };

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic < 90 || diastolic < 60) {
      return {
        color: "bg-blue-100",
        textColor: "text-blue-700",
        status: "Huyết áp thấp",
        advice: "Bạn nên ăn uống đầy đủ và kiểm tra sức khỏe định kỳ.",
      };
    } else if (systolic <= 120 && diastolic <= 80) {
      return {
        color: "bg-green-100",
        textColor: "text-green-700",
        status: "Huyết áp bình thường",
        advice: "Tiếp tục duy trì chế độ sống lành mạnh!",
      };
    } else if (systolic <= 139 || diastolic <= 89) {
      return {
        color: "bg-yellow-100",
        textColor: "text-yellow-700",
        status: "Tiền tăng huyết áp",
        advice:
          "Theo dõi thường xuyên và điều chỉnh chế độ ăn uống, sinh hoạt.",
      };
    } else {
      return {
        color: "bg-red-100",
        textColor: "text-red-700",
        status: "Huyết áp cao",
        advice: "Bạn nên gặp bác sĩ để được tư vấn và điều trị kịp thời.",
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
            label="Huyết áp tâm thu"
            unit="mmHg"
            value={latestBloodPressureRecord?.systolic}
            imageSource={require("../../assets/healthMetrics/bloodPressure1.png")}
            onPress={() => setIsChangeBloodPressure(true)}
          />
          <HealthMetricCard
            label="Huyết áp tâm trương"
            unit="mmHg"
            value={latestBloodPressureRecord?.diastolic}
            imageSource={require("../../assets/healthMetrics/bloodPressure2.png")}
            onPress={() => setIsChangeBloodPressure(true)}
          />
        </View>
      )}
      {latestBloodPressureRecord != null &&
        (() => {
          const { color, textColor, status, advice } = getBloodPressureStatus(
            latestBloodPressureRecord.systolic,
            latestBloodPressureRecord.diastolic
          );

          return (
            <View className={`${color} p-4 rounded-lg mb-4`}>
              <Text className={`${textColor} font-semibold text-center`}>
                {status}: Huyết áp của bạn là{" "}
                <Text className="font-bold">
                  {latestBloodPressureRecord.systolic}/
                  {latestBloodPressureRecord.diastolic} mmHg
                </Text>
                . {advice}
              </Text>
            </View>
          );
        })()}

      <>
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-bold">Biểu đồ huyết áp</Text>
          </View>
          <View className="w-40">
            <SelectField
              label=""
              data={displayOptions}
              value={bloodPressureDisplayOption || ""}
              placeholder="Kiểu hiển thị"
              onChange={(val) => setBloodPressureDisplayOption(val)}
            />
          </View>
        </View>
        <TimeNavigator
          displayOption={bloodPressureDisplayOption}
          currentDate={bloodPressureDate}
          onChange={handleBloodPressureChange}
        />

        {bloodPressureRecords.length > 0 ? (
          <HealthMetricsDoubleLineChart
            bloodPressureData={bloodPressureRecords}
          />
        ) : (
          <View className="items-center justify-center my-10">
            <Text className="text-gray-500">Không có dữ liệu</Text>
          </View>
        )}
      </>

      <Modal
        isVisible={isChangeBloodPressure}
        animationIn="zoomIn"
        animationOut="zoomOut"
        onBackdropPress={() => setIsChangeBloodPressure(false)}
      >
        <View className="bg-white rounded-lg p-6">
          <Text className="text-lg font-bold text-center mb-4">
            Nhập huyết áp
          </Text>

          <View className="flex-row justify-center w-full items-center">
            <View className="flex-row w-60 items-center justify-center border border-gray-300 rounded-md px-3 py-2">
              <TextInput
                keyboardType="numeric"
                placeholder="Tâm thu"
                className="w-1/2 h-8 text-center text-base"
                value={changeSystolicValue.toString()}
                onChangeText={(val) => setChangeSystolicValue(val)}
              />
              <Text className="text-lg font-semibold">/</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Tâm trương"
                className="w-1/2 h-8 text-center text-base"
                value={changeDiastolicValue.toString()}
                onChangeText={(val) => setChangeDiastolicValue(val)}
              />
            </View>
          </View>

          <View className="flex-row justify-end gap-4 mt-4">
            <TouchableOpacity
              className="px-4 py-2 bg-gray-100 rounded-full"
              onPress={() => {
                setIsChangeBloodPressure(false);
              }}
            >
              <Text className="text-gray-900">Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 bg-gray-900 rounded-full"
              onPress={() => {
                handleSaveData();
                setIsChangeBloodPressure(false);
              }}
            >
              <Text className="text-white font-semibold">Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
export default BloodPressureScreen;
