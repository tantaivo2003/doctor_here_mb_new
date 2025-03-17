import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import DoctorCard from "../components/ui/DoctorCard";

export default function DoctorDetail({ navigation, route }: any) {
  const { doctor } = route.params;

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 150 }}
        className="p-4"
        showsVerticalScrollIndicator={false}
      >
        <DoctorCard {...doctor} />

        <View className="flex-row justify-between p-4">
          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <FontAwesome5 name="award" size={20} color="#374151" />
            </View>
            <Text className="text-lg font-bold text-gray-800 mt-1">10+</Text>
            <Text className="text-sm text-gray-500">kinh nghiệm</Text>
          </View>

          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <FontAwesome5 name="star" size={20} color="#374151" />
            </View>
            <Text className="text-lg font-bold text-gray-800 mt-1">5</Text>
            <Text className="text-sm text-gray-500">đánh giá</Text>
          </View>

          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <MaterialIcons
                name="chat-bubble-outline"
                size={20}
                color="#374151"
              />
            </View>
            <Text className="text-lg font-bold text-gray-800 mt-1">1,872</Text>
            <Text className="text-sm text-gray-500">nhận xét</Text>
          </View>
        </View>

        <Text className="text-xl font-bold text-gray-800 my-5">Về bác sĩ</Text>
        <Text className="text-gray-600">
          Một bác sĩ chuyên khoa tim mạch tận tâm, mang đến bề dày kinh nghiệm
          cho bệnh nhân
        </Text>

        <Text className="text-xl font-bold text-gray-800 my-5">
          Giờ làm việc
        </Text>
        <Text className="text-gray-600">Thứ 2 đến thứ 6, từ 8:00 - 17:00</Text>

        <View className="flex flex-row justify-between items-center mt-10 mb-5">
          <Text className="text-xl font-bold text-gray-800">
            Nhận xét của người dùng
          </Text>
          <TouchableOpacity>
            <Text className="text-blue-500">Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-5">
          <Image
            source={require("../assets/doctor_picture/jessica.png")}
            className="w-16 h-16 rounded-full"
          />
          <View className="ml-5">
            <Text className="text-lg font-bold text-gray-900">
              Sarah Johnson
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-sm font-semibold text-gray-700">5.0</Text>
              <View className="flex-row ml-2">
                {[...Array(5)].map((_, i) => (
                  <FontAwesome key={i} name="star" size={14} color="#FACC15" />
                ))}
              </View>
            </View>
          </View>
        </View>

        <Text className="text-gray-600">
          Bác sĩ là một chuyên gia thực thụ, người thực sự quan tâm đến bệnh
          nhân của mình.
        </Text>
      </ScrollView>

      {/* Thanh nút cố định */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
        <TouchableOpacity className="bg-teal-500 py-3 rounded-full items-center mb-2">
          <Text className="text-white font-semibold">Nhắn tin với bác sĩ</Text>
        </TouchableOpacity>

        <View className="flex-row justify-between">
          <TouchableOpacity
            className="flex-1 bg-teal-500 py-3 rounded-full items-center mr-2"
            onPress={() => navigation.navigate("OnlineAppointment", { doctor })}
          >
            <Text className="text-white font-semibold">
              Đặt lịch tư vấn trực tuyến
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-gray-900 py-3 rounded-full items-center"
            onPress={() =>
              navigation.navigate("OfflineAppointment", { doctor })
            }
          >
            <Text className="text-white font-semibold">
              Đặt lịch khám trực tiếp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
