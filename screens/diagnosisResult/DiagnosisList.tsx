import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { fetchDiagnosisResults } from "../../api/Diagnosis";
import { getUserID } from "../../services/storage";
import { formatDateTime } from "../../utils/formatDateTime";
import LoadingModal from "../../components/ui/LoadingModal";
import { DiagnosisResult } from "../../types/types";
import { MaterialIcons } from "@expo/vector-icons";
export default function DiagnosisList({ navigation }: any) {
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const patientId = await getUserID();
          if (!patientId) {
            console.error("Không tìm thấy patientId trong AsyncStorage");
            return;
          }

          const results = await fetchDiagnosisResults(patientId);

          setDiagnoses(results);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu chẩn đoán:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  if (!loading && diagnoses.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-500 text-lg">
          Không có kết quả khám bệnh
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={diagnoses}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white rounded-lg shadow-md p-4 mb-4 mx-4 mt-4"
            onPress={() =>
              navigation.navigate("DiagnosisDetails", { diagnosis: item })
            }
          >
            <Text className="text-gray-600 font-semibold mb-2">
              {formatDateTime(item.startTime)}
            </Text>
            <View className="h-[1px] bg-gray-300 my-2" />

            <View className="flex-row items-center">
              <View className="w-24 h-24 rounded-xl overflow-hidden">
                <Image
                  source={
                    item.doctorAvatarUrl
                      ? { uri: item.doctorAvatarUrl }
                      : require("../../assets/avatar-placeholder.png")
                  }
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-bold text-lg">{item.doctorName}</Text>
                <Text className="text-gray-500">{item.department}</Text>
                <View className="flex-row items-center mt-1">
                  <MaterialIcons name="location-on" size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-1">
                    {item.clinicAddress}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity className="mt-4 bg-blue-500 p-2 rounded-full">
              <Text className="text-center text-white font-semibold">
                Chi tiết
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      {loading && <LoadingModal />}
    </View>
  );
}
