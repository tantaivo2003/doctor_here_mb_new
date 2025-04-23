import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { ChatListItem } from "../../components/chat/ChatListItem";
import { chatList } from "../../types/types";
import {
  storeUserID,
  getUserID,
  storeFavoriteDoctors,
} from "../../services/storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import socket, { onMessageReceived } from "../../socket";
import { useFocusEffect } from "@react-navigation/native";

interface Conversation {
  cuoc_hoi_thoai: number;
  thoi_diem_tin_nhan_cuoi: string;
  nguoi_dung: {
    ma: string;
    avt_url: string | null;
    ho_va_ten: string;
  };
  so_tin_moi: number;
  tin_nhan: {
    noi_dung_van_ban: string;
    media_url: string | null;
  };
}

interface Message {
  id: number;
  kieu_noi_dung: string;
  noi_dung_van_ban: string;
  media_url: string | null;
  thoi_diem_gui: string;
  thoi_diem_da_xem: string | null;
  cuoc_hoi_thoai: number;
  ben_gui_di: string;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
const ChatListScreen: FC = ({ navigation }: any) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const userID = "BN0000006"; // Thay thế bằng ID người dùng thực tế

  // useEffect(() => {
  //   console.log("Lắng nghe tin nhắn từ socket");
  //   // Lắng nghe khi có tin nhắn mới
  //   onMessageReceived((message: string) => {
  //     const parsedMessage: Message = JSON.parse(message);
  //     console.log("Tin nhắn mới từ socket", parsedMessage);
  //     // Cập nhật lại cuộc hội thoại tương ứng

  //     setConversations((prevConversations) => {
  //       const updatedConversations = prevConversations.map((conversation) => {
  //         if (conversation.cuoc_hoi_thoai === parsedMessage.cuoc_hoi_thoai) {
  //           return {
  //             ...conversation,
  //             so_tin_moi: conversation.so_tin_moi + 1,
  //             thoi_diem_tin_nhan_cuoi: parsedMessage.thoi_diem_gui,
  //             tin_nhan: {
  //               noi_dung_van_ban: parsedMessage.noi_dung_van_ban,
  //               media_url: parsedMessage.media_url,
  //             },
  //           };
  //         }
  //         return conversation;
  //       });
  //       return updatedConversations;
  //     });
  //   });

  //   return () => {
  //     // Hủy lắng nghe tin nhắn khi component bị hủy
  //     socket.off("chat_message");
  //   };
  // }, [userID]);

  // useEffect(() => {
  //   console.log("UserID: ", getUserID());
  //   fetch(`${API_BASE_URL}/api/conversation/user/${userID}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("Lấy danh sách trò chuyện", data);
  //       setConversations(data);
  //     });

  //   return () => {};
  // }, [userID]);

  const handlePressMessage = (
    convID: number,
    doctorAvtUrl: string,
    doctorID: string
  ) => {
    console.log("Đi tới chat với ID: ", convID);
    navigation.navigate("ChatDetailScreen", { convID, doctorAvtUrl, doctorID });
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("LẮNG nghe tin nhắn từ socket");
      const handleMessage = (message: string) => {
        const parsedMessage: Message = JSON.parse(message);
        console.log("Tin nhắn mới từ socket", parsedMessage);

        setConversations((prevConversations) => {
          const updated = prevConversations.map((conversation) => {
            if (conversation.cuoc_hoi_thoai === parsedMessage.cuoc_hoi_thoai) {
              return {
                ...conversation,
                so_tin_moi: conversation.so_tin_moi + 1,
                thoi_diem_tin_nhan_cuoi: parsedMessage.thoi_diem_gui,
                tin_nhan: {
                  noi_dung_van_ban: parsedMessage.noi_dung_van_ban,
                  media_url: parsedMessage.media_url,
                },
              };
            }
            return conversation;
          });
          return updated;
        });
      };

      socket.on("chat_message", handleMessage); // Bắt sự kiện mỗi khi màn hình focus

      console.log("Màn hình ChatListScreen đã được focus");
      fetch(`${API_BASE_URL}/api/conversation/user/${userID}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Lấy danh sách trò chuyện", data);
          setConversations(data);
        });

      return () => {
        console.log("ChatListScreen bị blur, gỡ socket listener");
        socket.off("chat_message", handleMessage); // Gỡ đúng handler
      };
    }, [userID])
  );

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
              message:
                item.tin_nhan.media_url && item.tin_nhan.media_url !== ""
                  ? "Đã gửi tệp"
                  : item.tin_nhan.noi_dung_van_ban,
              avatar: item.nguoi_dung.avt_url,
              unreadCount: item.so_tin_moi,
              time: new Date(item.thoi_diem_tin_nhan_cuoi).toLocaleTimeString(
                "vi-VN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ),
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
