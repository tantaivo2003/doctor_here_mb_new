import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import ShortcutButton from "../components/ui/ShortCutButton";
import SearchIcon from "../components/icons/SearchIcon";
import DoctorCard from "../components/ui/DoctorCard";

interface Doctor {
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  image: any;
}
const doctors: Doctor[] = [
  {
    name: "Nguyễn Văn A",
    specialty: "Chuyên khoa nội",
    hospital: "Bệnh viện Bạch Mai",
    rating: 4.5,
    reviews: 100,
    image: require("../assets/doctor_picture/jessica.png"),
  },
  {
    name: "Trần Thị B",
    specialty: "Chuyên khoa tim mạch",
    hospital: "Bệnh viện Chợ Rẫy",
    rating: 4.8,
    reviews: 150,
    image: require("../assets/doctor_picture/sarah.png"),
  },
  {
    name: "Nguyễn Văn A",
    specialty: "Chuyên khoa nội",
    hospital: "Bệnh viện Bạch Mai",
    rating: 4.5,
    reviews: 100,
    image: require("../assets/doctor_picture/jessica.png"),
  },
  {
    name: "Trần Thị B",
    specialty: "Chuyên khoa tim mạch",
    hospital: "Bệnh viện Chợ Rẫy",
    rating: 4.8,
    reviews: 150,
    image: require("../assets/doctor_picture/sarah.png"),
  },
  {
    name: "Nguyễn Văn A",
    specialty: "Chuyên khoa nội",
    hospital: "Bệnh viện Bạch Mai",
    rating: 4.5,
    reviews: 100,
    image: require("../assets/doctor_picture/jessica.png"),
  },
  {
    name: "Trần Thị B",
    specialty: "Chuyên khoa tim mạch",
    hospital: "Bệnh viện Chợ Rẫy",
    rating: 4.8,
    reviews: 150,
    image: require("../assets/doctor_picture/sarah.png"),
  },
  {
    name: "Nguyễn Văn A",
    specialty: "Chuyên khoa nội",
    hospital: "Bệnh viện Bạch Mai",
    rating: 4.5,
    reviews: 100,
    image: require("../assets/doctor_picture/jessica.png"),
  },
  {
    name: "Trần Thị B",
    specialty: "Chuyên khoa tim mạch",
    hospital: "Bệnh viện Chợ Rẫy",
    rating: 4.8,
    reviews: 150,
    image: require("../assets/doctor_picture/sarah.png"),
  },
];

export default function FindDoctor({ navigation }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const handleDoctorPress = (doctor: any) => {
    navigation.navigate("DoctorDetail", { doctor });
  };
  return (
    <ScrollView
      className="flex-1 bg-white p-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center rounded-lg my-3 px-3 py-1 bg-gray-50 text-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500">
        <SearchIcon width={25} height={25} color="#9CA3AF" />
        <TextInput
          placeholder="Tìm kiếm bác sĩ, chuyên khoa"
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="flex-1 outline-none px-2 text-base"
        />
      </View>

      <Text className="text-xl font-bold text-gray-800">Kết quả tìm kiếm</Text>
      {doctors.map((doctor, index) => (
        <View key={index} className="mb-3">
          <DoctorCard {...doctor} onPress={() => handleDoctorPress(doctor)} />
        </View>
      ))}
    </ScrollView>
  );
}
