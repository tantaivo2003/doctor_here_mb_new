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
import { Doctor, Specialization } from "../types/types";
import {
  storeUserID,
  getUserID,
  storeFavoriteDoctors,
} from "../services/storage";
import { getLoveList } from "../api/LoveList";
import { registerUser } from "../socket";
import { fetchSpecializations } from "../api/Doctor";
import NotificationTag11 from "../components/ui/NotificationTag";

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
    linkingto: "FamilyStack",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [lovedDoctors, setLovedDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [showAllSpecializations, setShowAllSpecializations] = useState(false);

  useEffect(() => {
    const registerSocket = async () => {
      const userId = await getUserID();
      if (userId) {
        registerUser(userId);
      }
    };
    registerSocket();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchDoctors = async () => {
        const userId = await getUserID();
        if (!userId) return;
        const data = await getLoveList(userId);
        setLovedDoctors(data);
        storeFavoriteDoctors(data);

        const result = await fetchSpecializations();
        setSpecializations(result);
        console.log("Specializations:", result.length);
      };

      fetchDoctors();
    }, [])
  );

  return (
    <ScrollView
      className="flex-1 bg-white p-4"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xl font-bold text-gray-800">
        Xin chào, Tấn Tài!
      </Text>
      <NotificationTag11
        message="Dự đoán bệnh tiểu đường"
        onPress={() => navigation.navigate("DiabetesPredictionScreen")}
        backgroundColor="bg-green-500" // Thay đổi màu nền nếu cần
        textColor="text-white"
        iconName="pill" // Sử dụng icon thuốc
      />

      <View className="flex-row items-center rounded-lg my-3 px-3 py-1 bg-gray-50 text-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500">
        <SearchIcon width={25} height={25} color="#9CA3AF" />
        <TextInput
          placeholder="Tìm kiếm bác sĩ, chuyên khoa"
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="flex-1 outline-none px-2 text-base"
          onPress={() =>
            navigation.navigate("FindDoctorScreen", { parseSearchTerm: "" })
          }
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
      <View className="flex flex-row justify-between mt-10 mb-5">
        <Text className="text-xl font-bold text-gray-800 ">
          Khám theo chuyên khoa
        </Text>
        {!showAllSpecializations && specializations.length > 4 ? (
          <TouchableOpacity
            onPress={() => setShowAllSpecializations(true)}
            className=""
          >
            <Text className="text-blue-500">Xem tất cả</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setShowAllSpecializations(false)}
            className=""
          >
            <Text className="text-blue-500">Đóng</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="bg-white rounded-2xl shadow-lg shadow-gray-400">
        <View className="flex-row flex-wrap justify-between">
          {(showAllSpecializations
            ? specializations
            : specializations.slice(0, 4)
          ).map((item, index) => (
            <View key={index} className="w-[23%] mb-4">
              <ShortcutButton
                title={item.ten_chuyen_khoa}
                imageUrl={item.img_url}
                onPress={() =>
                  navigation.navigate("FindDoctorScreen", {
                    parseSearchTerm: item.ten_chuyen_khoa,
                  })
                }
              />
            </View>
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
