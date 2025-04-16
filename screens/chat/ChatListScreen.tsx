import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { FC, useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { ChatListItem } from "../../components/chat/ChatListItem";
import { chatList } from "../../types/types";
import {
  storeUserID,
  getUserID,
  storeFavoriteDoctors,
} from "../../services/storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

interface Conversation {
  cuoc_hoi_thoai: number;
  nguoi_dung: {
    ma: string;
    avt_url: string | null;
    ho_va_ten: string;
  };
  so_tin_moi: number;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
const ChatListScreen: FC = ({ navigation }: any) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const userID = "BN0000006"; // Thay thế bằng ID người dùng thực tế

  useEffect(() => {
    console.log("UserID: ", getUserID());
    fetch(`${API_BASE_URL}/api/conversation/user/${userID}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Lấy danh sách trò chuyện", data);
        setConversations(data);
      });

    return () => {};
  }, [userID]);

  const handlePressMessage = (
    convID: number,
    doctorAvtUrl: string,
    doctorID: string
  ) => {
    console.log("Đi tới chat với ID: ", convID);
    navigation.navigate("ChatDetailScreen", { convID, doctorAvtUrl, doctorID });
  };

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      {/* Danh sách tin nhắn */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.cuoc_hoi_thoai.toString()}
        renderItem={({ item }) => (
          <ChatListItem
            // doctor={item}
            // onPress={() => handlePressMessage(item.id)}
            doctor={{
              id: item.cuoc_hoi_thoai,
              name: item.nguoi_dung.ho_va_ten,
              message: "Tin nhắn mới",
              avatar: item.nguoi_dung.avt_url,
              unreadCount: item.so_tin_moi,
              time: new Date().toISOString(), // Replace with actual time if available
              isOnline: false, // Replace with actual online status if available
            }}
            onPress={() =>
              handlePressMessage(
                item.cuoc_hoi_thoai,
                item.nguoi_dung.avt_url || "",
                item.nguoi_dung.ma
              )
            }
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
