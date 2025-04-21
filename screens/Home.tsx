import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
import { Doctor } from "../types/types";
import {
  storeUserID,
  getUserID,
  storeFavoriteDoctors,
} from "../services/storage";
import { getLoveList } from "../api/LoveList";

const systemShortcuts = [
  {
    icon: "pills",
    title: "Lịch uống thuốc",
    color: "#EFA8A8",
    linkingto: "MedicineSchedule",
  },
  {
    icon: "file-medical",
    title: "Kết quả khám bệnh",
    color: "#9AC8A5",
    linkingto: "DiagnosisList",
  },
  {
    icon: "heartbeat",
    title: "Chỉ số sức khỏe",
    color: "#F4B183",
    linkingto: "HealthMetricsScreen",
  },
  {
    icon: "users",
    title: "Gia đình",
    color: "#C5AEDC",
    linkingto: "MedicineSchedule",
  },
];

const specialist1Shortcuts = [
  { icon: "tooth", title: "Nha khoa", color: "#FFD700" },
  { icon: "heart", title: "Tim mạch", color: "#FF6F61" },
  { icon: "lungs", title: "Phổi", color: "#A2D5F2" },
  { icon: "stethoscope", title: "Tổng quát", color: "#76C7C0" },
];

const specialist2Shortcuts = [
  { icon: "brain", title: "Não bộ", color: "#D4A5A5" },
  { icon: "digest", title: "Tiêu hóa", color: "#FFB347" },
  { icon: "flask", title: "Xét nghiệm", color: "#9E9AC8" },
  { icon: "syringe", title: "Vắc xin", color: "#8FBC8F" },
];

export default function Home({ navigation }: any) {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lovedDoctors, setLovedDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserID();
      setPatientId(userId);
    };
    fetchUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchDoctors = async () => {
        if (!patientId) return;
        const data = await getLoveList(patientId);
        setLovedDoctors(data);
        storeFavoriteDoctors(data);
      };

      fetchDoctors();
    }, [patientId])
  );

  return (
    <ScrollView
      className="flex-1 bg-white p-4"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xl font-bold text-gray-800">
        Xin chào, Tấn Tài!
      </Text>
      <View className="flex-row items-center rounded-lg my-3 px-3 py-1 bg-gray-50 text-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500">
        <SearchIcon width={25} height={25} color="#9CA3AF" />
        <TextInput
          placeholder="Tìm kiếm bác sĩ, chuyên khoa"
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="flex-1 outline-none px-2 text-base"
          onPress={() => navigation.navigate("FindDoctorScreen")}
          // onSubmitEditing={() =>
          //   navigation.navigate("FindDoctorScreen", { searchTerm })
          // }
        />
      </View>
      <Text className="text-xl font-bold text-gray-800 mb-5">Lối tắt</Text>
      <View className="flex-row justify-between bg-white rounded-2xl shadow-lg shadow-gray-400">
        {systemShortcuts.map((item, index) => (
          <ShortcutButton
            key={index}
            {...item}
            onPress={() => navigation.navigate(item.linkingto)}
          />
        ))}
      </View>

      <Text className="text-xl font-bold text-gray-800 mt-10 mb-5">
        Khám theo chuyên khoa
      </Text>
      <View className="bg-white rounded-2xl shadow-lg shadow-gray-400">
        <View className="flex-row justify-between ">
          {specialist1Shortcuts.map((item, index) => (
            <ShortcutButton
              key={index}
              {...item}
              onPress={() => navigation.navigate("FindDoctorScreen")}
            />
          ))}
        </View>
        <View className="flex-row justify-between">
          {specialist2Shortcuts.map((item, index) => (
            <ShortcutButton
              key={index}
              {...item}
              onPress={() => navigation.navigate("FindDoctorScreen")}
            />
          ))}
        </View>
      </View>

      <View className="flex flex-row justify-between mt-10 mb-5">
        <Text className="text-xl font-bold text-gray-800">
          Bác sĩ bạn yên thích
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FavoriteDoctor", { doctors: lovedDoctors })
          }
        >
          <Text className="text-blue-500">Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <View className="flex flex-row gap-3 mb-10 justify-center">
        {lovedDoctors.slice(0, 3).map((doctor, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white flex flex-col items-center p-4 justify-center rounded-2xl shadow-lg shadow-gray-400"
            onPress={() => navigation.navigate("DoctorDetail", { doctor })}
          >
            <Image
              source={
                doctor.image
                  ? { uri: doctor.image }
                  : require("../assets/avatar-placeholder.png")
              }
              className="w-24 h-24 rounded-lg"
            />
            <Text className="text-sm text-center font-bold max-w-24 mt-3">
              {doctor.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
