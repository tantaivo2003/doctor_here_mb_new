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
          <DoctorCard
            {...doctor}
            isFavorite={true}
            onPress={() => handleDoctorPress(doctor)}
          />
        </View>
      ))}
    </ScrollView>
  );
}
