import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getAuthData, storeAvt } from "../../services/storage";
import { fetchPatientDetail } from "../../api/Patient";

import LoadingModal from "../../components/ui/LoadingModal";
export default function ProfileScreen({ navigation }: any) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

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
            />
            <MenuItem
              icon="clipboard"
              title="Thông tin y tế"
              onPress={() => navigation.navigate("HealthInsurance")}
            />
            <MenuItem
              icon="settings"
              title="Cài đặt"
              onPress={() => navigation.navigate("Settings")}
            />
            <MenuItem
              icon="help-circle"
              title="Hỗ trợ"
              onPress={() => navigation.navigate("NotificationTest")}
            />
            <MenuItem
              icon="document-text"
              title="Điều khoản sử dụng"
              onPress={() => navigation.navigate("TermsOfUse")}
            />
            <MenuItem
              icon="log-out"
              title="Đăng xuất"
              onPress={() => {
                // Confirm logout
              }}
              color="red"
            />
          </View>
        </>
      )}
    </View>
  );
}

function MenuItem({ icon, title, onPress, color = "black" }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-gray-100"
    >
      <View className="flex-row items-center">
        <Ionicons name={icon} size={22} color={color} />
        <Text className={`ml-4 text-lg`} style={{ color }}>
          {title}
        </Text>
      </View>

      <AntDesign name="rightcircleo" size={24} color="black" />
    </TouchableOpacity>
  );
}
