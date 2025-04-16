import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Appointment } from "../../types/types";
import { getUserID } from "../../services/storage";
import { getAppointment } from "../../api/Appointment";
import { formatDateTime } from "../../utils/formatDateTime";

import LoadingModal from "../../components/ui/LoadingModal";

export default function CanceledAppointments({ navigation }: any) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const fetchAppointments = async () => {
        setLoading(true);
        try {
          const patientId = await getUserID();
          if (!patientId) {
            console.error("Không tìm thấy patientId trong AsyncStorage");
            return;
          }

          const status = 3; // Chỉ lấy các lịch hẹn sắp tới
          const data = await getAppointment(patientId, status);
          setAppointments(data);
        } catch (error) {
          console.error("Lỗi khi lấy lịch hẹn:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAppointments();
    }, [])
  );
  if (loading && appointments.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-500 text-lg">Không có lịch hẹn nào</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white rounded-lg shadow-md p-4 mb-4 mx-4 mt-4"
            onPress={() =>
              navigation.navigate("AppointmentDetails", {
                doctor: {
                  id: item.id,
                  name: item.doctor,
                  specialty: item.specialty,
                  hospital: item.hospital,
                  rating: 4.5,
                  reviews: 120,
                  image: item.image,
                },
                date: item.date,
                startTime: item.startTime,
              })
            }
          >
            {/* Ngày giờ */}
            <Text className="text-gray-600 font-semibold mb-2">
              {formatDateTime(item.startTime)}
            </Text>
            <View className="h-[1px] bg-gray-300 my-2" />
            {/* Thông tin bác sĩ */}
            <View className="flex-row items-center">
              <View className="w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center">
                <Image
                  source={
                    item.image
                      ? { uri: item.image }
                      : require("../../assets/avatar-placeholder.png")
                  }
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="ml-4">
                <Text className="font-bold text-lg">{item.doctor}</Text>
                <Text className="text-gray-500">{item.specialty}</Text>
                <Text className="text-gray-400">{item.hospital}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {loading && <LoadingModal />}
    </View>
  );
}
