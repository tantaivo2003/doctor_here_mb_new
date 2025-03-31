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

// Danh sách các chỉ số nhịp tim và nhịp thở
const heartRateMetrics = [
  { key: "heart_rate_records", label: "Nhịp tim", unit: "BPM" },
  { key: "respiratory_rate_records", label: "Nhịp thở", unit: "lần/phút" },
];

const HeartRateScreen = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [heartRateData, setHeartRateData] = useState<{
    [key: string]: number | null;
  }>({
    heart_rate_records: null,
    respiratory_rate_records: null,
  });

  const [heartRateRecords, setHeartRateRecords] = useState<
    { date: string; value: number }[]
  >([]);
  const [respiratoryRateRecords, setRespiratoryRateRecords] = useState<
    { date: string; value: number }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let updatedData: { [key: string]: number | null } = {};
      for (let metric of heartRateMetrics) {
        const data = await getHealthData(metric.key);
        updatedData[metric.key] =
          data.length > 0 ? data[data.length - 1].value : null;
      }
      setHeartRateData(updatedData);
    };

    const fetchHeartRateRecords = async () => {
      const heartRateData = await getHealthData("heart_rate_records");
      const respiratoryRateData = await getHealthData(
        "respiratory_rate_records"
      );

      setHeartRateRecords(heartRateData);
      setRespiratoryRateRecords(respiratoryRateData);
      setLoading(false);
    };

    fetchData();
    fetchHeartRateRecords();
  }, []);

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
      setHeartRateData((prev) => ({ ...prev, [selectedMetric]: numericValue }));
      setModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    } finally {
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

  const { color, textColor, status, advice } = getHeartRateStatus(
    heartRateData.heart_rate_records || 0,
    heartRateData.respiratory_rate_records || 0
  );
  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          <View className="flex-row justify-between mb-4">
            {heartRateMetrics.map((metric) => (
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
                    metric.key === "heart_rate_records"
                      ? require("../../assets/healthMetrics/heartRate.png")
                      : require("../../assets/healthMetrics/respiratoryRate.png")
                  }
                  className="w-16 h-16 mr-4"
                  resizeMode="contain"
                />
                <View className="flex-1">
                  <Text className="text-gray-600">{metric.label}</Text>
                  <Text className="text-lg font-bold">
                    {heartRateData[metric.key]
                      ? `${heartRateData[metric.key]} ${metric.unit}`
                      : "Chưa có dữ liệu"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/* Trạng thái nhịp tim/thở */}
          {heartRateData.heart_rate_records != null && (
            <View className={`${color} p-4 rounded-lg mb-4`}>
              <Text className={`${textColor} font-semibold text-center`}>
                Trạng thái nhịp tim/thở của bạn:{" "}
                <Text className="font-bold">{status}</Text>. {advice}
              </Text>
            </View>
          )}
          {/* Biểu đồ Nhịp tim */}
          <Text className="text-lg font-bold mb-4">Biểu đồ Nhịp tim</Text>
          <HealthMetricsLineChart healthMetricsLineData={heartRateRecords} />

          {/* Biểu đồ Nhịp thở */}
          <Text className="text-lg font-bold mt-6 mb-4">Biểu đồ Nhịp thở</Text>
          <HealthMetricsLineChart
            healthMetricsLineData={respiratoryRateRecords}
          />
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
            Nhập {heartRateMetrics.find((m) => m.key === selectedMetric)?.label}{" "}
            ({heartRateMetrics.find((m) => m.key === selectedMetric)?.unit})
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

export default HeartRateScreen;
