import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Appointment } from "../../types/types";
import { getUserID } from "../../services/storage";
import { getAppointment } from "../../api/Appointment";

import { formatDateTime } from "../../utils/formatDateTime";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import { ScrollView } from "react-native-gesture-handler";
export default function UpcomingAppointments({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const patientId = await getUserID(); // Lấy patientId từ AsyncStorage
        if (!patientId) {
          console.error("Không tìm thấy patientId trong AsyncStorage");
          return;
        }

        const status = 1; // Chỉ lấy các lịch hẹn sắp tới
        const data = await getAppointment(Number(patientId), status);
        setAppointments(data);
      } catch (error) {
        console.error("Lỗi khi lấy lịch hẹn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelPress = (appointment: any) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const confirmCancel = () => {
    console.log("Đã hủy lịch hẹn:", selectedAppointment);
    setModalVisible(false);
  };

  return (
    <View>
      {loading && <LoadingAnimation />}
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
                  source={item.image}
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
            {/* Nút hủy*/}
            <TouchableOpacity
              className="mt-4 bg-gray-100 p-2 rounded-full"
              onPress={() => handleCancelPress(item)}
            >
              <Text className="text-center font-semibold">Hủy</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      {/* Modal Xác Nhận Hủy */}
      <Modal
        isVisible={modalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="justify-center items-center">
          <View className="bg-white rounded-2xl p-6 items-center">
            <Text className="text-lg font-bold text-center">
              Xác nhận hủy lịch hẹn
            </Text>

            <Text className="text-center text-gray-500 my-5">
              Bạn có chắc muốn hủy lịch hẹn với Bác sĩ{" "}
              {selectedAppointment?.doctor} không?
            </Text>
            <View className="flex-row justify-around mt-4 gap-5">
              <TouchableOpacity
                className="py-3 px-6 bg-gray-100 w-2/5 items-center rounded-full"
                onPress={() => setModalVisible(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 px-6 bg-gray-900 w-2/5 items-center rounded-full"
                onPress={confirmCancel}
              >
                <Text className="text-white">Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
