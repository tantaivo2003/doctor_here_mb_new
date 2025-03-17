import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { FC } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { MessageItem } from "./MessageItem";
import { messagesList } from "../../components/types"; // Đảm bảo import đúng

const MessagesScreen: FC = () => {
  const handlePressMessage = (doctorId: number) => {
    console.log("Đi tới chat của bác sĩ ID:", doctorId);
  };

  return (
    <View className="flex-1 bg-white px-4">
      {/* Danh sách tin nhắn */}
      <FlatList
        data={messagesList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MessageItem
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

export default MessagesScreen;
