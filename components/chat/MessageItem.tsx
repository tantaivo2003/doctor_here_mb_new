import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { FC, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// Format để so sánh ngày
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

interface MessageItemProps {
  message: {
    sender: string;
    type: string;
    content: string | string[];
    timestamp: string; // ISO date string
  };
  showDate: boolean;
  onImagePress: (imageUri: string) => void; // Hàm để xử lý khi nhấn vào hình ảnh
}

export const MessageItem: FC<MessageItemProps> = ({
  message,
  showDate,
  onImagePress,
}) => {
  const messageDate = formatDate(message.timestamp); // Lấy ngày của tin nhắn hiện tại

  return (
    <View>
      {/* Hiển thị ngày nếu có sự thay đổi */}
      {showDate && (
        <View className="flex items-center my-2">
          <Text className="text-xs text-gray-500 bg-gray-200 p-2 rounded-full">
            {messageDate}
          </Text>
        </View>
      )}

      {/* Hiển thị tin nhắn */}
      <View
        className={`flex-row ${
          message.sender === "bn" ? "justify-end" : "justify-start"
        } px-3 my-2`}
      >
        {message.type === "text" && (
          <View
            className={`p-3 rounded-lg ${
              message.sender === "bn" ? "bg-green-300" : "bg-white"
            } max-w-[70%]`}
          >
            <Text>{message.content}</Text>
            <Text className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        )}

        {message.type === "image" && (
          <TouchableOpacity
            onPress={() => onImagePress(message.content as string)}
          >
            <View className="flex-col">
              <Image
                source={{ uri: message.content as string }}
                className="w-24 h-24 rounded-lg"
              />
              <Text className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {message.type === "audio" && (
          <TouchableOpacity
            className={`p-3 rounded-lg ${
              message.sender === "bn" ? "bg-green-300" : "bg-white"
            } max-w-[70%]`}
          >
            <View className="flex-row items-center">
              <Ionicons name="play-circle" size={24} color="black" />
              <Text className="ml-2">1:24</Text>
            </View>
            <Text className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
