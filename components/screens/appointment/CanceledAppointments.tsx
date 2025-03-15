import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";

import { doctorlist, appointments } from "../types";

import Modal from "react-native-modal";
export default function CanceledAppointments({ navigation }: any) {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleCanceled = () => {
    setModalVisible(true);
  };

  return (
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
        </TouchableOpacity>
      )}
    />
  );
}
