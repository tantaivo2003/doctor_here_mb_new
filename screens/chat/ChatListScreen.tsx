import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { FC } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { ChatListItem } from "../../components/chat/ChatListItem";
import { chatList } from "../../types/types";

const ChatListScreen: FC = ({ navigation }: any) => {
  const handlePressMessage = (doctorId: number) => {
    console.log("Đi tới chat của bác sĩ ID:", doctorId);
    navigation.navigate("ChatDetailScreen", { doctorId });
  };

  return (
    <View className="flex-1 bg-white px-4">
      {/* Danh sách tin nhắn */}
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatListItem
            doctor={item}
            onPress={() => handlePressMessage(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500">Không có tin nhắn</Text>
        }
      />
    </View>
  );
};

export default ChatListScreen;
