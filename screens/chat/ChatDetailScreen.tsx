import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { FC, useEffect, useState, useRef, useLayoutEffect } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { messagesList, Message } from "../../types/types";
import { MessageItem } from "../../components/chat/MessageItem";
import socket, { sendMessage, onMessageReceived } from "../../socket"; // Hàm WebSocket được export từ socket.ts
import { set } from "date-fns";
import * as ImagePicker from "expo-image-picker"; // Thêm thư viện chọn ảnh
import { InteractionManager } from "react-native";

const ChatDetailScreen: FC = ({ route, navigation }: any) => {
  const flatListRef = useRef<FlatList>(null); // Tạo tham chiếu đến FlatList
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { convID, doctorAvtUrl, doctorID } = route.params;
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [initialScrollDone, setInitialScrollDone] = useState(false); // Biến để kiểm tra lần đầu cuộn xuống cuối danh sách
  let userID = "BN0000006"; // ID người bệnh (lấy từ context hoặc dữ liệu người dùng đã đăng nhập)
  console.log(doctorID);

  const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

  // Lấy danh sách tin nhắn từ API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/message/conversation/${convID}`)
      .then((res) => res.json())
      .then((data) => {
        let formattedData: Message[] = data.map((item: any) => {
          return {
            id: item.id,
            sender: item.ben_gui_di,
            type: item.kieu_noi_dung,
            content:
              item.kieu_noi_dung === "text"
                ? item.noi_dung_van_ban
                : item.media_url,
            timestamp: item.thoi_diem_gui, //"thoi_diem_gui": "2025-03-23T16:27:52.288Z"
          };
        });
        setMessages(formattedData);

        // InteractionManager.runAfterInteractions(() => {
        //   flatListRef.current?.scrollToEnd({ animated: false });
        // });
      });
  }, [convID]);

  // Coi tin nhắn
  useEffect(() => {
    fetch(
      `${API_BASE_URL}/api/message/seen/conversation/${convID}/user/${userID}`,
      {
        method: "PATCH",
      }
    )
      .then((res) => {
        if (res.ok) {
          console.log("Đánh dấu tin nhắn là đã xem thành công");
        } else {
          throw new Error("Đánh dấu tin nhắn là đã xem thất bại");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gửi yêu cầu:", error);
      });
  }, [convID]);

  // Khi nhận tin
  useEffect(() => {
    const handleMessageReceived = (message: string) => {
      let newMessage = JSON.parse(message);

      console.log("Tin nhắn mới:", newMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          sender: "bs", // Bác sĩ gửi tin nhắn
          type: newMessage.kieu_noi_dung,
          content:
            newMessage.kieu_noi_dung === "text"
              ? newMessage.noi_dung_van_ban
              : newMessage.media_url,
          timestamp: newMessage.thoi_diem_gui,
        },
      ]);

      // Cuộn đến cuối danh sách khi có tin nhắn mới
      // Cuộn sau khi cập nhật state (delay để chờ FlatList render)
    };

    // Hủy sự kiện trước đó trước khi lắng nghe sự kiện mới
    socket.off("chat_message");

    // Đăng ký sự kiện mới
    socket.on("chat_message", handleMessageReceived);

    // Cleanup để hủy sự kiện khi component unmount
    return () => {
      socket.off("chat_message", handleMessageReceived);
    };
  }, []); // Chỉ chạy một lần khi component mount

  // Scroll xuống cuối khi mount lần đầu
  useEffect(() => {
    if (messages.length > 0 && !initialScrollDone) {
      // Đợi FlatList render xong
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
        setInitialScrollDone(true);
      }, 1000); // Hoặc 0 nếu nội dung ít
    }
  }, [messages]);

  const handleScroll = (e: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setIsAtBottom(isBottom);
  };

  const handleContentSizeChange = () => {
    if (initialScrollDone && isAtBottom) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  // Hàm chọn ảnh và cập nhật vào files
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = {
        uri: result.assets[0].uri,
        type: "image/jpeg", // Hoặc loại file tương ứng
        name: result.assets[0].uri.split("/").pop(), // Lấy tên file từ uri
      };
      setFiles([...files, file]);
    }
  };

  // Hàm gửi tin nhắn
  const handleSendMessage = () => {
    if (inputText.trim() === "" && files.length === 0) return; // Nếu không có nội dung hoặc file, không gửi

    let time = new Date().toISOString();
    let message = {
      id: Date.now(),
      sender: "bn", // Người bệnh
      type: "text",
      content: inputText, // Nội dung tin nhắn
      timestamp: time,
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    setInputText(""); // Reset input text

    // Nếu có file đính kèm
    if (files.length > 0) {
      let formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folderName", "message_media");

      fetch(`${API_BASE_URL}/api/cloud/upload`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          data.forEach((file: any) => {
            sendMessage(
              userID, // ID người bệnh (lấy từ context hoặc dữ liệu người dùng đã đăng nhập)
              doctorID || "",
              inputText,
              time,
              file.type,
              file.url // URL hình ảnh hoặc file đã upload
            );

            // Cập nhật lại tin nhắn với URL của file đính kèm
            setMessages((prevMessages) =>
              prevMessages.map((msg) => {
                if (msg.id === message.id) {
                  return {
                    ...msg,
                    type: file.type,
                    content: file.url, // Cập nhật URL của file
                  };
                }
                return msg;
              })
            );

            setFiles([]); // Reset files sau khi gửi
          });
        });
    } else {
      // Nếu chỉ có tin nhắn văn bản
      sendMessage(
        userID, // ID người bệnh (lấy từ context hoặc dữ liệu người dùng đã đăng nhập)
        doctorID || "",
        inputText,
        time,
        "text",
        "" // Không có URL cho tin nhắn văn bản
      );
    }
  };

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    const previousDate =
      index > 0 ? formatDate(messages[index - 1].timestamp) : null;

    return (
      <MessageItem
        message={item}
        previousDate={previousDate} // Truyền ngày tin nhắn trước đó để hiển thị ngày khi có sự thay đổi
        onImagePress={() => handleImagePress(item.content)} // Truyền hàm xử lý nhấn vào hình ảnh
      />
    );
  };

  // Hàm format ngày cho so sánh
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Xử lý nhấn vào hình ảnh
  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Lưu URI của hình ảnh được chọn
    setIsModalVisible(true); // Hiển thị modal để phóng to hình ảnh
  };

  return (
    <View className="flex-1 bg-gray-100 pt-16">
      {/* Header */}
      <View className="flex-row items-center p-3 bg-white border-b border-gray-300">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="angle-left" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={
            doctorAvtUrl !== ""
              ? { uri: doctorAvtUrl }
              : require("../../assets/doctor_picture/jessica.png")
          }
          className="w-10 h-10 rounded-full ml-3"
        />
        <Text className="ml-3 font-bold text-lg">BS. Trung Hiếu</Text>
        <TouchableOpacity
          className="ml-auto"
          onPress={() => navigation.navigate("VideoCallScreen", { doctorID })}
        >
          <Ionicons name="call-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Danh sách tin nhắn */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem} // Sử dụng renderItem để hiển thị từng MessageItem
        className="flex-1"
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 12 }}
      />

      {/* Hiển thị tên file đã chọn */}
      {files.length > 0 && (
        <View>
          <Text>Đã chọn {files.length} file</Text>
        </View>
      )}

      {/* Thanh nhập tin nhắn */}
      <View className="flex-row items-center p-3">
        <TextInput
          className="flex-1 bg-gray-200 p-4 rounded-full"
          placeholder="Nhập tin nhắn của bạn"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity className="ml-3" onPress={handleSendMessage}>
          <FontAwesome name="send" size={24} color="blue" />
        </TouchableOpacity>
        {/* Nút chọn ảnh */}
        <TouchableOpacity className="ml-3" onPress={pickImage}>
          <FontAwesome name="image" size={24} color="blue" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex justify-center items-center bg-black bg-opacity-70 h-full w-full">
          <TouchableOpacity
            className="absolute top-10 right-6 z-10"
            onPress={() => setIsModalVisible(false)}
          >
            <Ionicons name="close-circle" size={30} color="white" />
          </TouchableOpacity>

          {/* Kiểm tra và hiển thị hình ảnh nếu có */}
          {selectedImage && (
            <View className="relative w-full h-full justify-center items-center">
              <Image
                source={{ uri: selectedImage }} // Chắc chắn rằng `selectedImage` là một chuỗi URL hợp lệ
                style={{ width: "100%", height: "80%", resizeMode: "contain" }} // Đảm bảo rằng hình ảnh có thể co giãn
              />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ChatDetailScreen;
