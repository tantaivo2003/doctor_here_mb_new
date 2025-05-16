import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// UI Components
import Toast from "react-native-toast-message";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import HealthMetricsLineChart from "../../components/HealthMetrics/HealthMetricsLineChart";
import HealthMetricCard from "../../components/HealthMetrics/HealthMetricCard";
import HealthDataInputModal from "../../components/HealthMetrics/HealthDataInputModal";
import SelectField from "../../components/ui/SelectField";

// Local storage
import {
  storeHealthData,
  getHealthData,
  getUserID,
} from "../../services/storage";

// Health Connect Permissions & Initialization
import { BMI_PERMISSIONS } from "../../services/healthConnect/permissions";
import {
  checkAndRequestPermissions,
  revokePermissions,
  readGrantedPermissions,
} from "../../services/healthConnect/healthConnectPermissions";
import { initializeHealthConnect } from "../../services/healthConnect/healthConnect";

// Health Records
import {
  fetchHealthRecords,
  getTodayHealthRecord,
  getActivityRecord,
} from "../../utils/readHealthRecords";
import { insertHealthRecord } from "../../utils/insertHealthRecord";
import {
  groupHealthRecordsByPeriod,
  fetchAndGroupHealthRecords,
} from "../../utils/groupHealthRecordsByPeriod";

import {
  fetchBMIData,
  fetchHeightData,
  fetchWeightData,
  fetchLatestHealthRecord,
  postBMI,
  postSimpleMetric,
} from "../../api/HealthMetrics";

// Utility functions
import {
  calculateBMI,
  calculateBMIRecords,
} from "../../utils/calHealthMetrics";
import {
  convertOptionToInterval,
  mapDisplayOptionToType,
} from "../../utils/validators";
import { useTimeFilter } from "./useTimeFilter";
import TimeNavigator from "../../components/ui/TimeNavigator";
// Types
import { HealthRecord } from "../../types/types";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { G } from "react-native-svg";
const displayOptions = [
  { title: "Tuần", icon: "calendar-week" },
  { title: "Tháng", icon: "calendar-month" },
  { title: "Năm", icon: "calendar-multiple" },
];

const BMIScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  const [latestHeightRecord, setLatestHeightRecord] =
    useState<HealthRecord | null>(null);
  const [latestWeightRecord, setLatestWeightRecord] =
    useState<HealthRecord | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);

  const [heightRecords, setHeightRecords] = useState<HealthRecord[]>([]);
  const [weightRecords, setWeightRecords] = useState<HealthRecord[]>([]);
  const [bmiRecords, setBmiRecords] = useState<HealthRecord[]>([]);

  const [heightDisplayOption, setHeightDisplayOption] = useState("Tuần");
  const [weightDisplayOption, setWeightDisplayOption] = useState("Tuần");

  const [isChangeHeight, setIsChangeHeight] = useState(false);
  const [isChangeWeight, setIsChangeWeight] = useState(false);

  const [changeHeightValue, setChangeHeightValue] = useState("");
  const [changeWeightValue, setChangeWeightValue] = useState("");

  const { currentDate, getStartEndDate, handleChange } = useTimeFilter();
  const [displayOption, setDisplayOption] = useState("Tuần");

  const {
    currentDate: heightDate,
    getStartEndDate: getHeightStartEndDate,
    handleChange: handleHeightChange,
  } = useTimeFilter();

  const {
    currentDate: weightDate,
    getStartEndDate: getWeightStartEndDate,
    handleChange: handleWeightChange,
  } = useTimeFilter();

  // const init = async () => {
  //   // Khởi tạo Health Connect
  //   await initializeHealthConnect();
  //   const hasPermission = await checkAndRequestPermissions(BMI_PERMISSIONS);
  //   return hasPermission;
  // };

  // Lấy dữ liệu mới nhất đã lưu khi mở màn hình
  useEffect(() => {
    const getHeightAndWeight = async () => {
      setLoading(true);
      const ptID = await getUserID();
      if (!ptID) {
        console.error("Không tìm thấy ID người dùng");
        return;
      }

      const height = await fetchLatestHealthRecord("height", ptID);
      const weight = await fetchLatestHealthRecord("weight", ptID);

      if (height && !Array.isArray(height) && "value" in height) {
        setLatestHeightRecord(height as HealthRecord);
      }

      if (weight && !Array.isArray(weight) && "value" in weight) {
        setLatestWeightRecord(weight as HealthRecord);
      }
      if (
        height &&
        !Array.isArray(height) &&
        "value" in height &&
        weight &&
        !Array.isArray(weight) &&
        "value" in weight
      ) {
        const newBmi = calculateBMI(height.value / 100, weight.value);
        setBmi(newBmi);
      }
      setLoading(false);
    };

    getHeightAndWeight();
  }, []);

  // Lấy dữ liệu chiều cao và cân nặng khi thay đổi thời gian
  useEffect(() => {
    const loadHeight = async () => {
      const heightData = await fetchHeight(
        heightDisplayOption,
        getHeightStartEndDate
      );
      if (heightData) {
        setHeightRecords(heightData);
        console.log("heightData:", heightData);
      }
    };

    loadHeight();
  }, [heightDisplayOption, heightDate]);

  const fetchHeight = async (
    displayOption: string,
    getStartEndDate: (displayOption: string) => {
      startDate: Date;
      endDate: Date;
    }
  ) => {
    try {
      setLoading(true);
      const ptID = await getUserID();
      if (!ptID) {
        console.error("Không tìm thấy ID người dùng");
        return null;
      }

      const type = mapDisplayOptionToType(displayOption);
      const { startDate, endDate } = getStartEndDate(displayOption);

      const heightData = await fetchHeightData(ptID, type, startDate, endDate);
      return heightData;
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu chiều cao", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadWeight = async () => {
      const weightData = await fetchWeight(
        weightDisplayOption,
        getWeightStartEndDate
      );
      if (weightData) {
        setWeightRecords(weightData);
        console.log("weightData:", weightData);
      }
    };

    loadWeight();
  }, [weightDisplayOption, weightDate]);
  const fetchWeight = async (
    displayOption: string,
    getStartEndDate: (displayOption: string) => {
      startDate: Date;
      endDate: Date;
    }
  ) => {
    try {
      setLoading(true);
      const ptID = await getUserID();
      if (!ptID) {
        console.error("Không tìm thấy ID người dùng");
        return;
      }

      const type = mapDisplayOptionToType(displayOption);
      const { startDate, endDate } = getStartEndDate(displayOption);

      const weightData = await fetchWeightData(ptID, type, startDate, endDate);
      return weightData;
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu cân nặng", err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu BMI khi thay đổi thời gian
  // Lấy dữ liệu BMI khi thay đổi thời gian
  useEffect(() => {
    const loadBMI = async () => {
      setLoading(true);
      try {
        const weightData = await fetchWeight(displayOption, getStartEndDate);
        const heightData = await fetchHeight(displayOption, getStartEndDate);

        if (weightData) {
          console.log("weightData:", weightData);
        }
        if (heightData) {
          console.log("heightData:", heightData);
        }

        if (weightData && heightData) {
          const bmiData = calculateBMIRecords(heightData, weightData);
          setBmiRecords(bmiData);
          console.log("bmiData:", bmiData);
        } else {
          setBmiRecords([]);
        }
      } catch (error) {
        console.error("Lỗi khi tính BMI:", error);
        setBmiRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadBMI();
  }, [displayOption, currentDate]);

  // Xử lý lưu dữ liệu
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

      if (label === "Chiều cao") {
        const heightValue = parseFloat(value);
        if (isNaN(heightValue)) {
          Toast.show({
            type: "error",
            text1: "Giá trị nhịp tim không hợp lệ!",
          });
          return;
        }

        // Them vao health connect
        const recordId = await insertHealthRecord(
          "Height",
          heightValue / 100,
          now
        ); // cm -> m

        // Thêm vào server:
        await postSimpleMetric(ptID, "height", heightValue, now);
        setLatestHeightRecord({ value: heightValue, date: now });
        Toast.show({ type: "success", text1: "Đã lưu chiều cao!" });
      } else if (label === "Cân nặng") {
        const weightValue = parseFloat(value);
        if (isNaN(weightValue)) {
          Toast.show({
            type: "error",
            text1: "Giá trị nhịp tim không hợp lệ!",
          });
          return;
        }

        // Them vao health connect
        const recordId = await insertHealthRecord(
          "Weight",
          weightValue / 100,
          now
        ); // cm -> m

        // Thêm vào server:
        await postSimpleMetric(ptID, "weight", weightValue, now);
        setLatestHeightRecord({ value: weightValue, date: now });
        Toast.show({ type: "success", text1: "Đã lưu cân nặng!" });
      }

      // Cập nhật BMI nếu đủ cả height và weight, sử dụng hàm calculateBMI
      const height =
        (label === "Chiều cao"
          ? parseFloat(value)
          : latestHeightRecord?.value) ?? null;
      const weight =
        (label === "Cân nặng"
          ? parseFloat(value)
          : latestWeightRecord?.value) ?? null;

      if (height && weight) {
        const newBmi = calculateBMI(height / 100, weight);
        setBmi(newBmi);
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      Toast.show({ type: "error", text1: "Lỗi khi lưu dữ liệu!" });
    } finally {
      setLoading(false);
      navigation.replace("BMIScreen");
    }
  };

  // Xác định màu sắc và lời khuyên dựa trên BMI
  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) {
      return {
        color: "bg-blue-200",
        textColor: "text-blue-800",
        advice: "Bạn đang thiếu cân. Hãy ăn uống đầy đủ và tập luyện hợp lý!",
      };
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return {
        color: "bg-green-200",
        textColor: "text-green-800",
        advice:
          "BMI của bạn trong mức bình thường. Hãy duy trì lối sống lành mạnh!",
      };
    } else if (bmi >= 25 && bmi < 29.9) {
      return {
        color: "bg-yellow-200",
        textColor: "text-yellow-800",
        advice:
          "Bạn đang thừa cân. Hãy điều chỉnh chế độ ăn và tập luyện nhiều hơn!",
      };
    } else {
      return {
        color: "bg-red-200",
        textColor: "text-red-800",
        advice: "Bạn đang béo phì. Hãy thay đổi lối sống để bảo vệ sức khỏe!",
      };
    }
  };
  const { color, textColor, advice } = getBMIStatus(bmi || 0);
  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          {/* Thông tin chiều cao và cân nặng */}
          <View className="flex-row justify-between mb-4">
            <HealthMetricCard
              label="Chiều cao"
              unit="cm"
              value={
                latestHeightRecord
                  ? latestHeightRecord.value.toFixed(0)
                  : undefined
              }
              imageSource={require("../../assets/healthMetrics/height.png")}
              onPress={() => {
                setIsChangeHeight(true);
              }}
            />

            <HealthMetricCard
              label="Cân nặng"
              unit="kg"
              value={latestWeightRecord?.value}
              imageSource={require("../../assets/healthMetrics/weight.png")}
              onPress={() => {
                setIsChangeWeight(true);
              }}
            />
          </View>

          {/* Chỉ số BMI */}
          {bmi != null && (
            <View className={`${color} p-4 rounded-lg mb-4`}>
              <Text className={`${textColor} font-semibold text-center`}>
                Chỉ số BMI hiện tại của bạn là{" "}
                <Text className="font-bold">{bmi}</Text>. {advice}
              </Text>
            </View>
          )}
          {/* Biểu đồ height */}

          <>
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-lg font-bold">Biểu đồ chiều cao</Text>
              </View>
              <View className="w-40">
                <SelectField
                  label=""
                  data={displayOptions}
                  value={heightDisplayOption || ""}
                  placeholder="Kiểu hiển thị"
                  onChange={(val) => setHeightDisplayOption(val)}
                />
              </View>
            </View>
            <TimeNavigator
              displayOption={heightDisplayOption}
              currentDate={heightDate}
              onChange={handleHeightChange}
            />
            {heightRecords.length > 0 ? (
              <HealthMetricsLineChart healthMetricsLineData={heightRecords} />
            ) : (
              <View className="items-center justify-center my-10">
                <Text className="text-gray-500">Không có dữ liệu</Text>
              </View>
            )}
          </>

          <>
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-lg font-bold">Biểu đồ cân nặng</Text>
              </View>
              <View className="w-40">
                <SelectField
                  label=""
                  data={displayOptions}
                  value={weightDisplayOption || ""}
                  placeholder="Kiểu hiển thị"
                  onChange={(val) => setWeightDisplayOption(val)}
                />
              </View>
            </View>
            <TimeNavigator
              displayOption={weightDisplayOption}
              currentDate={weightDate}
              onChange={handleWeightChange}
            />
            {weightRecords.length > 0 ? (
              <HealthMetricsLineChart healthMetricsLineData={weightRecords} />
            ) : (
              <View className="items-center justify-center my-10">
                <Text className="text-gray-500">Không có dữ liệu</Text>
              </View>
            )}
          </>

          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-bold">Biểu đồ BMI</Text>
            </View>
            <View className="w-40">
              <SelectField
                label=""
                data={displayOptions}
                value={displayOption || ""}
                placeholder="Kiểu hiển thị"
                onChange={(val) => setDisplayOption(val)}
              />
            </View>
          </View>
          <TimeNavigator
            displayOption={displayOption}
            currentDate={currentDate}
            onChange={handleChange}
          />
          {bmiRecords.length > 0 ? (
            <HealthMetricsLineChart healthMetricsLineData={bmiRecords} />
          ) : (
            <View className="items-center justify-center my-10">
              <Text className="text-gray-500">Không có dữ liệu</Text>
            </View>
          )}
        </>
      )}

      {/* Modal nhập liệu */}
      <HealthDataInputModal
        isVisible={isChangeHeight}
        label={"Chiều cao"}
        setModalVisible={setIsChangeHeight}
        value={changeHeightValue}
        setValue={setChangeHeightValue}
        handleSaveData={handleSaveData}
      />

      <HealthDataInputModal
        isVisible={isChangeWeight}
        label={"Cân nặng"}
        setModalVisible={setIsChangeWeight}
        value={changeWeightValue}
        setValue={setChangeWeightValue}
        handleSaveData={handleSaveData}
      />
    </ScrollView>
  );
};

export default BMIScreen;
