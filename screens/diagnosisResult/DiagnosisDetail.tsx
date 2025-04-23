import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import LoadingModal from "../../components/ui/LoadingModal";
import { fetchDiagnosisDetail } from "../../api/Diagnosis";
import { DiagnosisDetail } from "../../types/types";
import { formatDateTime } from "../../utils/formatDateTime";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function DiagnosisDetails({ route }: any) {
  const { diagnosis } = route.params;
  const [detail, setDetail] = useState<DiagnosisDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);

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

  // Xử lý nhấn vào hình ảnh
  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Lưu URI của hình ảnh được chọn
    setIsZoomModalVisible(true); // Hiển thị modal để phóng to hình ảnh
  };

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
      <Text className="font-semibold text-lg text-gray-800 my-3">
        Thông tin khám bệnh
      </Text>
      <View className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
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
            <Text className="text-gray-800 font-semibold mb-1">
              Ghi chú của bác sĩ:
            </Text>
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

        {/* Hình ảnh bổ sung */}
        {detail.images.length > 0 && (
          <>
            <Text className="text-xl font-bold text-gray-800 my-3">
              Hình ảnh bổ sung
            </Text>

            <View className="flex-row flex-wrap gap-3 ml-2 mb-4 ">
              {detail.images.map((uri: any, index: any) => (
                <View
                  key={index}
                  className="w-[31%] relative rounded-xl overflow-hidden border border-gray-200"
                >
                  <TouchableOpacity onPress={() => handleImagePress(uri)}>
                    <Image
                      source={{ uri }}
                      key={index}
                      className="w-full h-64"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      <Modal
        visible={isZoomModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsZoomModalVisible(false)}
      >
        <View className="flex justify-center items-center bg-black bg-opacity-70 h-full w-full">
          {selectedImage && (
            <View className="w-full h-full justify-center items-center">
              <Image
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: "80%", resizeMode: "contain" }}
              />

              <TouchableOpacity
                onPress={() => setIsZoomModalVisible(false)}
                className="absolute top-0 right-4 z-50"
              >
                <Ionicons name="close-circle" size={36} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}
