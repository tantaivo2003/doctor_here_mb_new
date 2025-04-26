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

const activityMetrics = [
  { key: "step_count_records", label: "Số bước đi", unit: "bước" },
  { key: "walking_distance_records", label: "Quãng đường đi bộ", unit: "km" },
];

const ActivityScreen = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [activityData, setActivityData] = useState<{
    [key: string]: number | null;
  }>({
    step_count_records: null,
    walking_distance_records: null,
  });
  const [stepRecords, setStepRecords] = useState<
    { date: string; value: number }[]
  >([]);
  const [distanceRecords, setDistanceRecords] = useState<
    { date: string; value: number }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let updatedData: { [key: string]: number | null } = {};
      for (let metric of activityMetrics) {
        const data = await getHealthData(metric.key);
        updatedData[metric.key] =
          data.length > 0 ? data[data.length - 1].value : null;
      }
      setActivityData(updatedData);
    };

    const fetchActivityRecords = async () => {
      const stepsData = await getHealthData("step_count_records");
      const distanceData = await getHealthData("walking_distance_records");
      setStepRecords(stepsData);
      setDistanceRecords(distanceData);
      setLoading(false);
    };

    fetchData();
    fetchActivityRecords();
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
      setActivityData((prev) => ({ ...prev, [selectedMetric]: numericValue }));
      setModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <View>
          <View className="flex-row justify-between mb-4">
            {activityMetrics.map((metric) => (
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
                    metric.key === "step_count_records"
                      ? require("../../assets/healthMetrics/stepCount.png")
                      : require("../../assets/healthMetrics/distance.png")
                  }
                  className="w-16 h-16 mr-4"
                  resizeMode="contain"
                />
                <View className="flex-1">
                  <Text className="text-gray-600">{metric.label}</Text>
                  <Text className="text-lg font-bold">
                    {activityData[metric.key]
                      ? `${activityData[metric.key]} ${metric.unit}`
                      : "Chưa có dữ liệu"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-lg font-bold mb-4">Biểu đồ Số bước đi</Text>
          <HealthMetricsLineChart healthMetricsLineData={stepRecords} />

          <Text className="text-lg font-bold mt-6 mb-4">
            Biểu đồ Quãng đường đi bộ
          </Text>
          <HealthMetricsLineChart healthMetricsLineData={distanceRecords} />
        </View>
      )}

      <Modal
        isVisible={modalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        onBackdropPress={() => setModalVisible(false)}
      >
        <View className="bg-white rounded-lg p-6">
          <Text className="text-lg font-bold text-center mb-4">
            Nhập {activityMetrics.find((m) => m.key === selectedMetric)?.label}{" "}
            ({activityMetrics.find((m) => m.key === selectedMetric)?.unit})
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

export default ActivityScreen;
