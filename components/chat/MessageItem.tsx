import { View, Text, Image, TouchableOpacity } from "react-native";
import { FC } from "react";
import { Ionicons } from "@expo/vector-icons";

interface MessageItemProps {
  message: {
    sender: string;
    type: string;
    content: string | string[];
    timestamp: string;
  };
}

export const MessageItem: FC<MessageItemProps> = ({ message }) => {
  return (
    <View
      className={`flex-row ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } px-3 my-2`}
    >
      {message.type === "text" && (
        <View
          className={`p-3 rounded-lg ${
            message.sender === "user" ? "bg-green-300" : "bg-white"
          } max-w-[70%]`}
        >
          <Text>{message.content}</Text>
          <Text className="text-xs text-gray-500 mt-1">
            {message.timestamp}
          </Text>
        </View>
      )}

      {message.type === "image" && (
        <View className="flex-row">
          {(message.content as string[]).map((imgSrc, index) => (
            <Image
              key={index}
              source={{ uri: imgSrc }}
              className="w-24 h-24 rounded-lg"
            />
          ))}
          <Text className="text-xs text-gray-500 mt-1">
            {message.timestamp}
          </Text>
        </View>
      )}

      {message.type === "audio" && (
        <TouchableOpacity
          className={`p-3 rounded-lg ${
            message.sender === "user" ? "bg-green-300" : "bg-white"
          } max-w-[70%]`}
        >
          <View className="flex-row items-center">
            <Ionicons name="play-circle" size={24} color="black" />
            <Text className="ml-2">1:24</Text>
          </View>
          <Text className="text-xs text-gray-500 mt-1">
            {message.timestamp}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
