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
import { storeHealthData, getHealthData } from "../../services/storage";

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
  fetchLatestHealthRecord,
  getTodayHealthRecord,
  getActivityRecord,
} from "../../utils/readHealthRecords";
import { insertHealthRecord } from "../../utils/insertHealthRecord";
import {
  groupHealthRecordsByPeriod,
  fetchAndGroupHealthRecords,
} from "../../utils/groupHealthRecordsByPeriod";

// Utility functions
import { calculateBMI } from "../../utils/calHealthMetrics";
import { convertOptionToInterval } from "../../utils/validators";
// Types
import { HealthRecord } from "../../types/types";

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

  const init = async () => {
    // Khởi tạo Health Connect
    await initializeHealthConnect();
    const hasPermission = await checkAndRequestPermissions(BMI_PERMISSIONS);
    return hasPermission;
  };
  // Lấy dữ liệu đã lưu khi mở màn hình
  const fetchLatestData = async () => {
    const latestWeightRecord = await fetchLatestHealthRecord("Weight");
    const latestHeightRecord = await fetchLatestHealthRecord("Height");

    if (latestWeightRecord) {
      setLatestWeightRecord(latestWeightRecord);
    }
    if (latestHeightRecord) {
      setLatestHeightRecord(latestHeightRecord);
    }

    // set bmi
    if (latestWeightRecord && latestHeightRecord) {
      const bmi = calculateBMI(
        latestHeightRecord.value,
        latestWeightRecord.value
      );

      setBmi(bmi);
      await storeHealthData("bmi_records", bmi); // Lưu BMI vào local storage
    }
  };
  const fetchRecords = async () => {
    const now = new Date();
    const past = new Date();
    past.setMonth(now.getMonth() - 12); // lấy trong 12 tháng gần nhất

    const heightInterval = convertOptionToInterval(heightDisplayOption);
    const weightInterval = convertOptionToInterval(weightDisplayOption);

    const heightData = await fetchAndGroupHealthRecords(
      "Height",
      past.toISOString(),
      now.toISOString(),
      heightInterval
    );

    const weightData = await fetchAndGroupHealthRecords(
      "Weight",
      past.toISOString(),
      now.toISOString(),
      weightInterval
    );

    if (heightData) {
      setHeightRecords(heightData);
    }
    if (weightData) {
      setWeightRecords(weightData);
    }

    console.log("heightData", heightData);
    console.log("weightData", weightData);
  };

  useEffect(() => {
    const initAndFetch = async () => {
      setLoading(true);
      const hasPermission = await init();
      if (!hasPermission) {
        navigation.navigate("Home");
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
  }, [heightDisplayOption, weightDisplayOption]);

  // Xử lý lưu dữ liệu
  const handleSaveData = async (value: string, label: string) => {
    setLoading(true);

    try {
      const now = new Date().toISOString();

      if (label === "Chiều cao") {
        const heightValue = parseFloat(value) / 100; // cm -> m
        const recordId = await insertHealthRecord("Height", heightValue);

        setLatestHeightRecord({ value: heightValue, date: now });
        setChangeHeightValue("");
        setIsChangeHeight(false);
        Toast.show({ type: "success", text1: "Đã lưu chiều cao!" });
      } else if (label === "Cân nặng") {
        const weightValue = parseFloat(value);
        const recordId = await insertHealthRecord("Weight", weightValue);

        setLatestWeightRecord({ value: weightValue, date: now });
        setChangeWeightValue("");
        setIsChangeWeight(false);
        Toast.show({ type: "success", text1: "Đã lưu cân nặng!" });
      }

      // Cập nhật BMI nếu đủ cả height và weight, sử dụng hàm calculateBMI
      const height =
        (label === "Chiều cao"
          ? parseFloat(value) / 100
          : latestHeightRecord?.value) ?? null;
      const weight =
        (label === "Cân nặng"
          ? parseFloat(value)
          : latestWeightRecord?.value) ?? null;

      if (height && weight) {
        const newBmi = calculateBMI(height, weight);
        setBmi(newBmi);
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      Toast.show({ type: "error", text1: "Lỗi khi lưu dữ liệu!" });
    } finally {
      setLoading(false);
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
          {/* Nút để thu hồi quyền*/}
          <TouchableOpacity
            className="px-4 py-2 mb-5 bg-gray-100 rounded-full"
            onPress={() => {
              readGrantedPermissions();
            }}
          >
            <Text className="text-gray-900">Danh sách quyền</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-4 py-2 mb-5 bg-gray-100 rounded-full"
            onPress={async () => {
              await checkAndRequestPermissions(BMI_PERMISSIONS);
            }}
          >
            <Text className="text-gray-900">Xin cấp quyền</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-4 py-2 mb-5 bg-gray-100 rounded-full"
            onPress={async () => {
              const rawRecords = await fetchHealthRecords(
                "Height", // 👈 bạn có thể thay bằng "Weight", ...
                "2025-04-01T00:00:00.000Z",
                "2025-04-24T23:59:59.999Z"
              );

              if (!rawRecords) {
                console.log("Không đọc được dữ liệu.");
                return;
              }

              // 🧠 Gọi hàm xử lý nhóm dữ liệu
              const grouped = groupHealthRecordsByPeriod(
                rawRecords, // dữ liệu đã được xử lý sơ bộ
                "YEARS", // 👈 thay đổi theo "DAYS" | "WEEKS" | "MONTHS" | "YEARS"
                "Height" // 👈 loại chỉ số để xử lý thông minh hơn
              );

              console.log("✅ Dữ liệu đã nhóm:", grouped);
            }}
          >
            <Text className="text-gray-900">Đọc & Nhóm dữ liệu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-4 py-2 mb-5 bg-gray-100 rounded-full"
            onPress={async () => {
              const records = await getActivityRecord(
                "Steps",
                "2025-04-22T00:00:00.000Z",
                "2025-04-24T23:59:59.999Z",
                "DAYS"
              );
              if (records) {
                // Làm gì đó với records
                console.log("Tổng số bản ghi:", records.length);
                console.log("Bản ghi", records);
              } else {
                console.log("Không đọc được dữ liệu.");
              }
            }}
          >
            <Text className="text-gray-900">Đọc dữ liệu 2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-4 py-2 mb-5 bg-gray-100 rounded-full"
            onPress={async () => {
              const records = await fetchLatestHealthRecord("Steps");
              if (records) {
                // Làm gì đó với records
                console.log("Tổng số bản ghi:", records.length);
                console.log("Bản ghi", records);
              } else {
                console.log("Không đọc được dữ liệu.");
              }
            }}
          >
            <Text className="text-gray-900">Đọc dữ liệu mới nhất</Text>
          </TouchableOpacity>
          {/* Thông tin chiều cao và cân nặng */}
          <View className="flex-row justify-between mb-4">
            <HealthMetricCard
              label="Chiều cao"
              unit="cm"
              value={
                latestHeightRecord
                  ? (latestHeightRecord.value * 100).toFixed(0)
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
          {heightRecords.length > 0 && (
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
              <HealthMetricsLineChart healthMetricsLineData={heightRecords} />
            </>
          )}

          {weightRecords.length > 0 && (
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
              <HealthMetricsLineChart healthMetricsLineData={weightRecords} />
            </>
          )}
          {bmiRecords.length > 0 && (
            <>
              <Text className="text-lg font-bold mb-4">Biểu đồ BMI</Text>
              <HealthMetricsLineChart healthMetricsLineData={bmiRecords} />
            </>
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
