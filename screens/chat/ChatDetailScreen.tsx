import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { FC, useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { messagesList, Message } from "../../types/types";
import { MessageItem } from "../../components/chat/MessageItem";
const ChatDetailScreen: FC = ({ navigation }: any) => {
  const [messages, setMessages] = useState<Message[]>(messagesList);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    const newMessage = {
      id: Date.now(),
      sender: "user",
      type: "text",
      content: inputText,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center p-3 bg-white border-b border-gray-300">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="angle-left" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/doctor_picture/jessica.png")}
          className="w-10 h-10 rounded-full ml-3"
        />
        <Text className="ml-3 font-bold text-lg">BS. Trung Hiếu</Text>
        <TouchableOpacity className="ml-auto">
          <Ionicons name="call-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Danh sách tin nhắn */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MessageItem message={item} />}
        className="flex-1"
      />

      {/* Thanh nhập tin nhắn */}
      <View className="flex-row items-center p-3">
        <TextInput
          className="flex-1 bg-gray-200 p-4 rounded-full"
          placeholder="Nhập tin nhắn của bạn"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity className="ml-3" onPress={sendMessage}>
          <FontAwesome name="send" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatDetailScreen;
