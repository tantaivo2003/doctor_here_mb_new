import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";

const appointments = [
  {
    id: "1",
    doctor: "BS. Trung Hiếu",
    specialty: "Ngoại khoa",
    hospital: "BV Hùng Vương",
    date: "24/10/2024",
    time: "10:00 AM",
    image: require("../../../assets/doctor_picture/sarah.png"),
  },
  {
    id: "2",
    doctor: "BS. Trung Hiếu",
    specialty: "Ngoại khoa",
    hospital: "BV Hùng Vương",
    date: "24/10/2024",
    time: "10:00 AM",
    image: require("../../../assets/doctor_picture/sarah.png"),
  },
  {
    id: "3",
    doctor: "BS. Trung Hiếu",
    specialty: "Ngoại khoa",
    hospital: "BV Hùng Vương",
    date: "24/10/2024",
    time: "10:00 AM",
    image: require("../../../assets/doctor_picture/sarah.png"),
  },
  {
    id: "4",
    doctor: "BS. Trung Hiếu",
    specialty: "Ngoại khoa",
    hospital: "BV Hùng Vương",
    date: "24/10/2024",
    time: "10:00 AM",
    image: require("../../../assets/doctor_picture/sarah.png"),
  },
  {
    id: "5",
    doctor: "BS. Trung Hiếu",
    specialty: "Ngoại khoa",
    hospital: "BV Hùng Vương",
    date: "24/10/2024",
    time: "10:00 AM",
    image: require("../../../assets/doctor_picture/sarah.png"),
  },
];

export default function CompletedAppointments() {
  return (
    <FlatList
      data={appointments}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
      renderItem={({ item }) => (
        <View className="bg-white rounded-lg shadow-md p-4 mb-4 mx-4 mt-4">
          {/* Ngày giờ */}
          <Text className="text-gray-600 font-semibold mb-2">
            {item.date} - {item.time}
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
              <Text className="text-gray-400">🏥 {item.hospital}</Text>
            </View>
          </View>

          {/* Nút đánh giá */}
          <TouchableOpacity className="mt-4 bg-gray-100 p-2 rounded-lg">
            <Text className="text-center font-semibold">Đánh giá</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}
