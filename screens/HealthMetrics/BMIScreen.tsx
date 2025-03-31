import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import {
  storeHealthData,
  getHealthData,
  generateAndStoreFakeHealthData,
} from "../../services/storage";
import { calculateBMI } from "../../utils/calHealthMetrics";
import HealthMetricsLineChart from "../../components/HealthMetrics/HealthMetricsLineChart";

// Danh sách các chỉ số sức khỏe
const healthMetrics = [
  { key: "height_records", label: "Chiều cao", unit: "cm" },
  { key: "weight_records", label: "Cân nặng", unit: "kg" },
  { key: "bmi_records", label: "chỉ số BMI", unit: "kg/cm2" },
];

const BMIScreen = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null); // Xác định đang nhập chỉ số nào
  const [value, setValue] = useState(""); // Giá trị nhập vào
  const [healthData, setHealthData] = useState<{
    [key: string]: number | null;
  }>({
    height_records: null,
    weight_records: null,
    bmi_records: null,
  });

  const [bmiRecords, setBmiRecords] = useState<
    { date: string; value: number }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu đã lưu khi mở màn hình
  useEffect(() => {
    const fetchData = async () => {
      let updatedData: { [key: string]: number | null } = {};
      for (let metric of healthMetrics) {
        const data = await getHealthData(metric.key);
        updatedData[metric.key] =
          data.length > 0 ? data[data.length - 1].value : null;
      }
      setHealthData(updatedData);
      // console.log(generateAndStoreFakeHealthData());
    };

    const fetchBMIRecords = async () => {
      const data = await getHealthData("bmi_records");
      setBmiRecords(data);
      setLoading(false);
    };

    fetchData();
    fetchBMIRecords();
  }, []);

  // Xử lý lưu dữ liệu
  const handleSaveData = async () => {
    if (!selectedMetric || !value) return;
    setLoading(true);
    try {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue <= 0) {
        alert("Vui lòng nhập giá trị hợp lệ!");
        return;
      }
      await storeHealthData(selectedMetric, numericValue);
      setHealthData((prev) => ({ ...prev, [selectedMetric]: numericValue })); // Cập nhật UI

      let newHeight = healthData.height_records;
      let newWeight = healthData.weight_records;

      // Cập nhật giá trị mới khi nhập chiều cao hoặc cân nặng
      if (selectedMetric === "height_records") newHeight = numericValue;
      if (selectedMetric === "weight_records") newWeight = numericValue;

      if (newHeight && newWeight) {
        const bmi = calculateBMI(Number(newHeight), Number(newWeight));
        console.log("BMI mới:", bmi);
        await storeHealthData("bmi_records", bmi);
        setHealthData((prev) => ({ ...prev, bmi_records: bmi }));
      }

      setModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
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

  // Lấy status của BMI mới nhất
  const latestBMI = healthData.bmi_records || 0; // Nếu chưa có BMI, mặc định là 0
  const { color, textColor, advice } = getBMIStatus(latestBMI);

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          {/* Thông tin chiều cao và cân nặng */}

          <View className="flex-row justify-between mb-4">
            {healthMetrics.slice(0, 2).map((metric) => (
              <TouchableOpacity
                key={metric.key}
                className="flex-1 bg-gray-100 p-4 rounded-lg mx-1 flex-row items-center"
                onPress={() => {
                  setSelectedMetric(metric.key);
                  setValue("");
                  setModalVisible(true);
                }}
              >
                {/* Hình ảnh */}
                <Image
                  source={
                    metric.key === "height_records"
                      ? require("../../assets/healthMetrics/height.png")
                      : require("../../assets/healthMetrics/weight.png")
                  }
                  className="w-16 h-16 mr-4"
                  resizeMode="contain"
                />

                {/* Phần thông tin */}
                <View className="flex-1">
                  <Text className="text-gray-600">{metric.label}</Text>
                  <Text className="text-lg font-bold">
                    {healthData[metric.key]
                      ? `${healthData[metric.key]} ${metric.unit}`
                      : "Chưa có dữ liệu"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chỉ số BMI */}
          {healthData.bmi_records != null && (
            <View className={`${color} p-4 rounded-lg mb-4`}>
              <Text className={`${textColor} font-semibold text-center`}>
                Chỉ số BMI hiện tại của bạn là{" "}
                <Text className="font-bold">{healthData.bmi_records}</Text>.{" "}
                {advice}
              </Text>
            </View>
          )}
          {/* Biểu đồ BMI */}
          <Text className="text-lg font-bold mb-4">Biểu đồ BMI trung bình</Text>
          <HealthMetricsLineChart healthMetricsLineData={bmiRecords} />
        </>
      )}

      {/* Modal nhập dữ liệu */}
      <Modal
        isVisible={modalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        onBackdropPress={() => setModalVisible(false)}
      >
        <View className="bg-white rounded-lg p-6">
          <Text className="text-lg font-bold text-center mb-4">
            Nhập {healthMetrics.find((m) => m.key === selectedMetric)?.label} (
            {healthMetrics.find((m) => m.key === selectedMetric)?.unit})
          </Text>
          <View className="flex-row items-center border border-gray-300 p-2 rounded-xl mb-4">
            <FontAwesome
              name="pencil"
              size={20}
              color="gray"
              className="ml-3"
            />
            <TextInput
              className="ml-3 flex-1"
              placeholder="Nhập giá trị"
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              inputMode="numeric"
            />
          </View>
          {/* Nút hành động */}
          <View className="flex-row justify-end gap-4">
            <TouchableOpacity
              className="px-4 py-2 bg-gray-100 rounded-full"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-gray-900">Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 bg-gray-900 rounded-full"
              onPress={handleSaveData}
            >
              <Text className="text-white font-semibold">Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default BMIScreen;
