import React, { useState, useEffect } from "react";
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
import { Doctor } from "../types/types";
import { getAllDoctors } from "../api/Doctor";

import LoadingAnimation from "../components/ui/LoadingAnimation";

export default function FindDoctor({ navigation, route }: any) {
  const [searchTerm, setSearchTerm] = useState(route.params?.searchTerm || "");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const doctors = await getAllDoctors();
      setDoctors(doctors);
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  // Hàm lọc bác sĩ theo từ khóa
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchTerm, doctors]);

  const handleDoctorPress = (doctor: any) => {
    console.log(doctor);
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
      {loading ? (
        <View className="items-center justify-center">
          <LoadingAnimation />
        </View>
      ) : filteredDoctors.length === 0 ? (
        <Text className="text-center text-gray-500 mt-5">
          Không tìm thấy bác sĩ nào!
        </Text>
      ) : (
        filteredDoctors.map((doctor, index) => (
          <View key={index} className="mb-3">
            <DoctorCard {...doctor} onPress={() => handleDoctorPress(doctor)} />
          </View>
        ))
      )}
    </ScrollView>
  );
}
