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
import ShortcutButton from "../ui/ShortCutButton";
import SearchIcon from "../icons/SearchIcon";
import DoctorCard from "../ui/DoctorCard";

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
    image: require("../../assets/doctor_picture/jessica.png"),
  },
  {
    name: "Trần Thị B",
    specialty: "Chuyên khoa tim mạch",
    hospital: "Bệnh viện Chợ Rẫy",
    rating: 4.8,
    reviews: 150,
    image: require("../../assets/doctor_picture/sarah.png"),
  },
  {
    name: "Nguyễn Văn A",
    specialty: "Chuyên khoa nội",
    hospital: "Bệnh viện Bạch Mai",
    rating: 4.5,
    reviews: 100,
    image: require("../../assets/doctor_picture/jessica.png"),
  },
  {
    name: "Trần Thị B",
    specialty: "Chuyên khoa tim mạch",
    hospital: "Bệnh viện Chợ Rẫy",
    rating: 4.8,
    reviews: 150,
    image: require("../../assets/doctor_picture/sarah.png"),
  },
  {
    name: "Nguyễn Văn A",
    specialty: "Chuyên khoa nội",
    hospital: "Bệnh viện Bạch Mai",
    rating: 4.5,
    reviews: 100,
    image: require("../../assets/doctor_picture/jessica.png"),
  },
  {
    name: "Trần Thị B",
    specialty: "Chuyên khoa tim mạch",
    hospital: "Bệnh viện Chợ Rẫy",
    rating: 4.8,
    reviews: 150,
    image: require("../../assets/doctor_picture/sarah.png"),
  },
  {
    name: "Nguyễn Văn A",
    specialty: "Chuyên khoa nội",
    hospital: "Bệnh viện Bạch Mai",
    rating: 4.5,
    reviews: 100,
    image: require("../../assets/doctor_picture/jessica.png"),
  },
  {
    name: "Trần Thị B",
    specialty: "Chuyên khoa tim mạch",
    hospital: "Bệnh viện Chợ Rẫy",
    rating: 4.8,
    reviews: 150,
    image: require("../../assets/doctor_picture/sarah.png"),
  },
];

export default function FavoriteDoctor({ navigation }: any) {
  const handleDoctorPress = (doctor: any) => {
    navigation.navigate("DoctorDetail", { doctor });
  };
  return (
    <ScrollView
      className="flex-1 bg-white p-4"
      showsVerticalScrollIndicator={false}
    >
      {doctors.map((doctor, index) => (
        <View key={index} className="mb-3">
          <DoctorCard {...doctor} onPress={() => handleDoctorPress(doctor)} />
        </View>
      ))}
    </ScrollView>
  );
}
