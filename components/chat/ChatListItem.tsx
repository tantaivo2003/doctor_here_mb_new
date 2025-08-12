import { View, Text, Image, TouchableOpacity } from "react-native";
import { FC } from "react";
import { Chat } from "../../types/types"; // Import kiểu Chat

interface ChatListItemProps {
  doctor: Chat; // Thay thế kiểu object bằng Chat
  is_ai_agent?: boolean;
  onPress: () => void;
}

export const ChatListItem: FC<ChatListItemProps> = ({
  doctor,
  is_ai_agent,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-3 border-b border-gray-200"
    >
      {/* Ảnh bác sĩ */}
      <View className="relative">
        {/* avatar: "https://res.cloudinary.com/dpquv4bcu/image/upload/v1743839971/bs2_rknmrj.jpg */}
        <Image
          className="w-16 h-16 rounded-full"
          source={
            is_ai_agent
              ? require("../../assets/doctor_picture/AIAgent.png")
              : doctor.avatar
              ? { uri: doctor.avatar }
              : require("../../assets/avatar-placeholder.png")
          }
        />

        {/* Chấm xanh trạng thái online */}
        {/* {doctor.isOnline && (
          <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )} */}
      </View>

      {/* Nội dung tin nhắn */}
      <View className="flex-1 ml-3">
        <Text className="font-semibold text-gray-900">{doctor.name}</Text>
        <Text
          className={`text-sm truncate w-48 ${
            doctor.unreadCount > 0 ? "font-bold text-black" : "text-gray-500 "
          }`}
        >
          {doctor.message}
        </Text>
      </View>

      {/* Thời gian & số tin nhắn chưa đọc */}
      <View className="items-end">
        <Text className="text-xs text-gray-400">{doctor.time}</Text>
        {doctor.unreadCount > 0 && (
          <View className="bg-red-500 w-5 h-5 rounded-full items-center justify-center mt-1">
            <Text className="text-white text-xs">{doctor.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
