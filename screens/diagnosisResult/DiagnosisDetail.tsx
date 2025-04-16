import { View, Text, ScrollView, Image } from "react-native";
import { useState, useEffect } from "react";
import LoadingModal from "../../components/ui/LoadingModal";
import { fetchDiagnosisDetail } from "../../api/Diagnosis";
import { DiagnosisDetail } from "../../types/types";
import { formatDateTime } from "../../utils/formatDateTime";
import { MaterialIcons } from "@expo/vector-icons";

export default function DiagnosisDetails({ route }: any) {
  const { diagnosis } = route.params;
  const [detail, setDetail] = useState<DiagnosisDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const result = await fetchDiagnosisDetail(diagnosis.id);
        setDetail(result);
        console.log("Diagnosis detail:", result);
      } catch (error) {
        console.error("Error loading diagnosis detail:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [diagnosis.id]);

  if (loading || !detail) {
    return <LoadingModal />;
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Thông tin bác sĩ */}

      <View className="flex-row items-center bg-white rounded-lg shadow-md">
        <View className="w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center">
          <Image
            source={
              detail.doctorAvatarUrl
                ? { uri: detail.doctorAvatarUrl }
                : require("../../assets/avatar-placeholder.png")
            }
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="ml-4">
          <Text className="font-bold text-lg">{detail.doctorFullName}</Text>
          <Text className="text-gray-500">{detail.doctorSpecialty}</Text>
          <View className="flex-row items-center mt-1">
            <MaterialIcons name="location-on" size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">
              {detail.clinicAddress}
            </Text>
          </View>
        </View>
      </View>
      {/* Diagnosis info */}
      <View className="bg-white rounded-2xl shadow-md p-4 mt-3 border border-gray-200">
        <Text className="font-semibold text-lg text-gray-800 mb-2">
          Thông tin khám bệnh
        </Text>
        <View className="border-b border-gray-200 pb-2 mb-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Ngày khám:</Text>
            <Text className="text-gray-800">
              {formatDateTime(detail.startTime, "date")}
            </Text>
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-gray-600">Giờ khám:</Text>
            <Text className="text-gray-800">
              {formatDateTime(detail.startTime, "time")}
            </Text>
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-gray-600">Kết quả chẩn đoán:</Text>
            <Text className="text-gray-800 font-semibold">
              {detail.diagnosisResult}
            </Text>
          </View>
        </View>

        {detail.additionalNote && (
          <View className="border-b border-gray-200 pb-2 mb-2">
            <Text className="text-gray-600 mb-1">Ghi chú của bác sĩ:</Text>
            <Text className="text-gray-800 italic">
              {detail.additionalNote}
            </Text>
          </View>
        )}

        {detail.medicines && detail.medicines.length > 0 && (
          <View className="mb-2">
            <Text className="font-semibold text-md text-gray-800 mb-2">
              Đơn thuốc
            </Text>
            {detail.medicines.map((medicine) => (
              <View key={medicine.id} className="flex-row justify-between py-1">
                <Text className="text-gray-700">{medicine.name}</Text>
                <Text className="text-gray-700">
                  {medicine.quantity} {medicine.unit}
                </Text>
              </View>
            ))}
            <View className="mt-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Ngày bắt đầu:</Text>
                <Text className="text-gray-800">
                  {detail.prescriptionStartDate}
                </Text>
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-gray-600">Ngày kết thúc:</Text>
                <Text className="text-gray-800">
                  {detail.prescriptionEndDate}
                </Text>
              </View>
            </View>
            {detail.prescriptionNote && (
              <Text className="text-gray-600 italic mt-2">
                Lưu ý: {detail.prescriptionNote}
              </Text>
            )}
          </View>
        )}

        {/* Thông tin thanh toán (dựa trên ảnh bạn cung cấp) */}
        <View className="mt-4 border-t border-gray-200 pt-2">
          <Text className="font-semibold text-md text-gray-800 mb-2">
            Chi tiết thanh toán
          </Text>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Phí khám:</Text>
            <Text className="text-gray-800">
              {detail.appointmentId ? "100.000 VND" : "N/A"}
            </Text>
            {/* Dùng appointmentId để giả định có phí khám */}
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-gray-600">Phí tiện ích:</Text>
            <Text className="text-gray-800">0 VND</Text>
          </View>
          <View className="flex-row justify-between mt-2 border-t border-gray-200 pt-2">
            <Text className="font-semibold text-gray-800">
              Tổng thanh toán:
            </Text>
            <Text className="font-semibold text-gray-800">
              {detail.appointmentId ? "100.000 VND" : "N/A"}
            </Text>
          </View>
          <View className="mt-3">
            <Text className="text-gray-600">Phương thức thanh toán:</Text>
            <Text className="text-gray-800 font-semibold">Trả tiền mặt</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
