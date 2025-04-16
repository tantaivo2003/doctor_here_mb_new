import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import { storeHealthData, getHealthData } from "../../services/storage";
import HealthMetricsLineChart from "../../components/HealthMetrics/HealthMetricsLineChart";

// Danh sách các chỉ số huyết áp
const bloodPressureMetrics = [
  { key: "systolic_pressure_records", label: "Huyết áp tâm thu", unit: "mmHg" },
  {
    key: "diastolic_pressure_records",
    label: "Huyết áp tâm trương",
    unit: "mmHg",
  },
];

const BloodPressureScreen = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [bloodPressureData, setBloodPressureData] = useState<{
    [key: string]: number | null;
  }>({
    systolic_pressure_records: null,
    diastolic_pressure_records: null,
  });

  const [systolicRecords, setSystolicRecords] = useState<
    { date: string; value: number }[]
  >([]);
  const [diastolicRecords, setDiastolicRecords] = useState<
    { date: string; value: number }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu đã lưu khi mở màn hình
  useEffect(() => {
    const fetchData = async () => {
      let updatedData: { [key: string]: number | null } = {};
      for (let metric of bloodPressureMetrics) {
        const data = await getHealthData(metric.key);
        updatedData[metric.key] =
          data.length > 0 ? data[data.length - 1].value : null;
      }
      setBloodPressureData(updatedData);
      setLoading(false);
    };

    const fetchBloodPressureRecords = async () => {
      const systolicData = await getHealthData("systolic_pressure_records");
      const diastolicData = await getHealthData("diastolic_pressure_records");

      setSystolicRecords(systolicData);
      setDiastolicRecords(diastolicData);
    };

    fetchData();
    fetchBloodPressureRecords();
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
      setBloodPressureData((prev) => ({
        ...prev,
        [selectedMetric]: numericValue,
      }));

      setModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic < 90 || diastolic < 60) {
      return {
        color: "bg-blue-100",
        textColor: "text-blue-700",
        status: "Huyết áp thấp",
        advice: "Bạn nên bổ sung muối và nước đầy đủ.",
      };
    } else if (systolic < 120 && diastolic < 80) {
      return {
        color: "bg-green-100",
        textColor: "text-green-700",
        status: "Huyết áp bình thường",
        advice: "Hãy duy trì lối sống lành mạnh!",
      };
    } else if (systolic <= 139 || diastolic <= 89) {
      return {
        color: "bg-yellow-100",
        textColor: "text-yellow-700",
        status: "Tiền tăng huyết áp",
        advice: "Bạn cần chú ý chế độ ăn uống và tập luyện.",
      };
    } else {
      return {
        color: "bg-red-100",
        textColor: "text-red-700",
        status: "Huyết áp cao",
        advice: "Bạn nên gặp bác sĩ để được tư vấn chi tiết.",
      };
    }
  };

  const { color, textColor, status, advice } = getBloodPressureStatus(
    bloodPressureData.systolic_pressure_records || 0,
    bloodPressureData.diastolic_pressure_records || 0
  );

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          {/* Thông tin huyết áp */}
          <View className="flex-row justify-between mb-4">
            {bloodPressureMetrics.map((metric) => (
              <TouchableOpacity
                key={metric.key}
                className="flex-1 bg-gray-100 p-2 rounded-lg mx-1 flex-row items-center"
                onPress={() => {
                  setSelectedMetric(metric.key);
                  setValue("");
                  setModalVisible(true);
                }}
              >
                {/* Hình ảnh */}
                <Image
                  source={
                    metric.key === "systolic_pressure_records"
                      ? require("../../assets/healthMetrics/bloodPressure1.png")
                      : require("../../assets/healthMetrics/bloodPressure2.png")
                  }
                  className="w-16 h-16 mr-4"
                  resizeMode="contain"
                />
                <View className="flex-1">
                  <Text className="text-gray-600">{metric.label}</Text>
                  <Text className="text-lg font-bold">
                    {bloodPressureData[metric.key]
                      ? `${bloodPressureData[metric.key]} ${metric.unit}`
                      : "Chưa có dữ liệu"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {bloodPressureData.systolic_pressure_records !== null && (
            <View className={`${color} p-4 rounded-lg mb-4`}>
              <Text className={`${textColor} font-semibold text-center`}>
                Trạng thái huyết áp của bạn:{" "}
                <Text className="font-bold">{status}</Text>. {advice}
              </Text>
            </View>
          )}
          {/* Biểu đồ huyết áp tâm thu */}
          <Text className="text-lg font-bold mb-4">
            Biểu đồ Huyết áp Tâm thu
          </Text>
          <HealthMetricsLineChart healthMetricsLineData={systolicRecords} />

          {/* Biểu đồ huyết áp tâm trương */}
          <Text className="text-lg font-bold mt-6 mb-4">
            Biểu đồ Huyết áp Tâm trương
          </Text>
          <HealthMetricsLineChart healthMetricsLineData={diastolicRecords} />
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
            Nhập{" "}
            {bloodPressureMetrics.find((m) => m.key === selectedMetric)?.label}{" "}
            ({bloodPressureMetrics.find((m) => m.key === selectedMetric)?.unit})
          </Text>
          <View className="flex-row items-center border border-gray-300 p-2 rounded-xl mb-4">
            <FontAwesome name="pencil" size={20} color="gray" />
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

export default BloodPressureScreen;
