import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";
import { doctorlist, appointments, Appointment } from "../types";

export default function UpcomingAppointments({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

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
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white rounded-lg shadow-md p-4 mb-4 mx-4 mt-4"
            onPress={() =>
              navigation.navigate("AppointmentDetails", {
                doctor: doctorlist[Number(item.id) - 1],
                date: item.date,
                time: item.time,
              })
            }
          >
            {/* Ngày giờ */}
            <Text className="text-gray-600 font-semibold mb-2">
              {item.date} - {item.time}
            </Text>
            <View className="h-[1px] bg-gray-300 my-2" />
            {/* Thông tin bác sĩ */}
            <View className="flex-row items-center">
              <View className="w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center">
                <Image
                  source={doctorlist[Number(item.id) - 1].image}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="ml-4">
                <Text className="font-bold text-lg">
                  {doctorlist[Number(item.id) - 1].name}
                </Text>
                <Text className="text-gray-500">
                  {doctorlist[Number(item.id) - 1].specialty}
                </Text>
                <Text className="text-gray-400">
                  🏥 {doctorlist[Number(item.id) - 1].hospital}
                </Text>
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
