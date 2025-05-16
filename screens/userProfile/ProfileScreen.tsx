import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getAuthData, storeAvt } from "../../services/storage";
import { fetchPatientDetail } from "../../api/Patient";
import { clearAsyncStorage } from "../../services/storage";
import { useAuth } from "../../context/AuthContext";
import LoadingModal from "../../components/ui/LoadingModal";
import MenuItem from "../../components/ui/MenuItem";
export default function ProfileScreen({ navigation }: any) {
  const { logout } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const HealthMetricsMenu = [
    {
      icon: "barbell", // hoặc icon phù hợp
      title: "Chỉ số BMI",
      screen: "BMIScreen",
      color: "#34D399",
    },
    {
      icon: "heart",
      title: "Huyết áp",
      screen: "BloodPressureScreen",
      color: "#F87171",
    },
    {
      icon: "pulse",
      title: "Nhịp tim",
      screen: "HeartRateScreen",
      color: "#60A5FA",
    },
    {
      icon: "walk",
      title: "Hoạt động",
      screen: "ActivityScreen",
      color: "#FBBF24",
    },
  ];

  // Load avatar từ AsyncStorage mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      const fetchAvatar = async () => {
        try {
          setLoading(true);
          const authData = await getAuthData();
          const userId = authData?.userId || null;
          const userName = authData?.username || null;
          const fullName = authData?.fullName || null;
          const uri = authData?.avtUrl || null;

          setUserId(userId);
          setUsername(userName);
          setFullName(fullName);
          if (uri) setAvatar(uri);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAvatar();
    }, [])
  );

  const handleSignOut = async () => {
    // Xóa thông tin người dùng khỏi AsyncStorage
    await clearAsyncStorage();
    logout();
  };

  return (
    <View className="flex-1 bg-white p-5">
      {loading ? (
        <LoadingModal />
      ) : (
        <>
          {/* Avatar và tên */}
          <View className="items-center mb-6">
            <TouchableOpacity className="relative">
              <Image
                source={
                  avatar
                    ? { uri: avatar }
                    : require("../../assets/avatar-placeholder.png")
                }
                className="w-48 h-48 rounded-full"
              />
            </TouchableOpacity>
            <Text className="mt-4 text-xl font-semibold">{fullName}</Text>
          </View>

          {/* Các mục */}
          <View className="mt-8">
            <MenuItem
              icon="person"
              title="Thông tin cá nhân"
              onPress={() => navigation.navigate("PersonalInfo")}
              color="#3B82F6" // xanh lá nhạt
            />
            <MenuItem
              icon="clipboard"
              title="Thông tin y tế"
              onPress={() => navigation.navigate("HealthInsurance")}
              color="#A7F3D0" // vàng nhạt
            />

            <MenuItem
              icon="help-circle"
              title="Hỗ trợ"
              onPress={() => navigation.navigate("NotificationTest")}
              color="#FBBF24" // vàng nhạt
            />
            <MenuItem
              icon="document-text"
              title="Điều khoản sử dụng"
              onPress={() => navigation.navigate("TermsOfUse")}
              color="#FBBF24" // hồng nhạt
            />
            <MenuItem
              icon="log-out"
              title="Đăng xuất"
              onPress={handleSignOut}
              color="#F87171" // đỏ nhẹ
            />
          </View>
        </>
      )}
    </View>
  );
}
