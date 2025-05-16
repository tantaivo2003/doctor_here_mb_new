import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface NotificationTagProps {
  message: string | null;
  onPress?: () => void; // Hàm callback khi người dùng click vào thông báo
  backgroundColor: string; // Màu nền
  textColor: string; // Màu chữ
  iconName: string; // Tên icon
}

const NotificationTag11: React.FC<NotificationTagProps> = ({
  message,
  onPress,
  backgroundColor,
  textColor,
  iconName,
}) => {
  if (!message) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        className={`${backgroundColor} w-full flex-row justify-between items-center px-5 py-5 my-5 rounded-lg z-50`}
      >
        <View className="flex-row items-center space-x-3">
          <MaterialCommunityIcons name={iconName} size={24} color="white" />
          <Text className={`${textColor} ml-5 text-lg font-semibold`}>
            {message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationTag11;
