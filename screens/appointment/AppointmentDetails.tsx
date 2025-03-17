import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import DoctorCard from "../../components/ui/DoctorCard";
import NotificationModal from "../../components/ui/NotificationModal";
export default function AppointmentDetails({ navigation, route }: any) {
  const { doctor, date, time } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <DoctorCard {...doctor} />

      {/* Hộp chứa thông tin */}
      <View className="bg-white rounded-2xl shadow-md p-4 mt-3 border border-gray-200">
        {/* Giờ khám & Ngày khám */}
        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-gray-500">Giờ khám</Text>
            <Text className="font-bold text-gray-900">{time}</Text>
          </View>
          <View>
            <Text className="text-gray-500">Ngày khám</Text>
            <Text className="font-bold text-gray-900">{date}</Text>
          </View>
        </View>

        {/* Thông tin cá nhân */}
        <View className="border-t border-gray-300 pt-4">
          <Text className="text-gray-500">Họ và tên</Text>
          <Text className="font-bold text-gray-900 mb-2">
            Nguyễn Phương Duy
          </Text>

          <Text className="text-gray-500">Giới tính</Text>
          <Text className="font-bold text-gray-900 mb-2">Nam</Text>

          <Text className="text-gray-500">Ngày sinh</Text>
          <Text className="font-bold text-gray-900 mb-2">10/11/2003</Text>

          <Text className="text-gray-500">SĐT</Text>
          <Text className="font-bold text-gray-900 mb-2">0123456789</Text>

          <Text className="text-gray-500">BHYT</Text>
          <Text className="font-bold text-gray-900 mb-2">--------</Text>

          <Text className="text-gray-500">CCCD</Text>
          <Text className="font-bold text-gray-900 mb-2">--------</Text>
        </View>

        {/* Chi phí */}
        <View className="border-t border-gray-300 pt-4 mt-4">
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Phí khám</Text>
            <Text className="font-bold text-gray-900">100.000 VND</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-500">Phí tiện ích</Text>
            <Text className="font-bold text-gray-900">0 VND</Text>
          </View>

          <View className="flex-row justify-between mt-2 border-t border-gray-300 pt-2">
            <Text className="text-gray-500">Tổng thanh toán</Text>
            <Text className="font-bold text-gray-900">100.000 VND</Text>
          </View>
        </View>

        {/* Phương thức thanh toán */}
        <View className="border-t border-gray-300 pt-4 mt-4">
          <Text className="text-gray-500">Phương thức thanh toán</Text>
          <Text className="font-bold text-blue-600">Trả tiền mặt</Text>
        </View>
      </View>
    </ScrollView>
  );
}
