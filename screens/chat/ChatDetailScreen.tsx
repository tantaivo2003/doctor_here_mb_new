import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { FC, useEffect, useState, useRef, useLayoutEffect } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { messagesList, Message } from "../../types/types";
import { MessageItem } from "../../components/chat/MessageItem";
import socket, {
  sendMessage,
  onMessageReceived,
  recallMessage,
  onRecallMessage,
} from "../../socket";
import { set } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import { InteractionManager } from "react-native";
import {
  fetchMessagesByConversationID,
  markMessagesAsSeen,
  createConversation,
} from "../../api/Message";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons"; // nếu bạn dùng Expo
const ChatDetailScreen: FC = ({ route, navigation }: any) => {
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [inputText, setInputText] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecallModalVisible, setIsRecallModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { convID, doctorAvtUrl, doctorID, doctorName, userID } = route.params;
  const [conversationID, setConversationID] = useState<string | null>(
    convID || null
  );

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [initialScrollDone, setInitialScrollDone] = useState(false); // Biến để kiểm tra lần đầu cuộn xuống cuối danh sách

  const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

  // Lấy danh sách tin nhắn từ API
  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationID) return;
      const data = await fetchMessagesByConversationID(conversationID);
      setMessages(data);
    };

    loadMessages();
  }, [conversationID]);

  // Coi tin nhắn
  useEffect(() => {
    if (conversationID && userID) {
      markMessagesAsSeen(conversationID, userID);
    }
  }, [conversationID]);

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

    const handleRecallReceived = (body: string) => {
      let parsedBody = JSON.parse(body);

      console.log("Thu hồi tin nhắn: ", parsedBody);

      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (
            message.sender === "bs" &&
            message.type === parsedBody.kieu_noi_dung &&
            message.timestamp === parsedBody.thoi_diem_gui
          ) {
            return {
              ...message,
              type: "recall",
              content: "",
            };
          }
          return message;
        })
      );
    };

    socket.off("recall_message");

    socket.on("recall_message", handleRecallReceived);

    // Cleanup để hủy sự kiện khi component unmount
    return () => {
      socket.off("chat_message", handleMessageReceived);
      socket.off("recall_message", handleRecallReceived);
    };
  }, []); // Chỉ chạy một lần khi component mount

  const handleRecallMessage = (
    content: string,
    time: string,
    type: string,
    url: string
  ) => {
    if (!conversationID) return;

    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (
          message.sender === "bn" &&
          message.type === type &&
          message.timestamp === time
        ) {
          return {
            ...message,
            type: "recall",
            content: "",
          };
        }
        return message;
      })
    );

    recallMessage(userID, doctorID, content, time, type, url);
  };

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
  const handleSendMessage = async () => {
    if (inputText.trim() === "" && files.length === 0) return; // Nếu không có nội dung hoặc file, không gửi
    // Nếu chưa có convID thì tạo mới
    let currentConvID = conversationID;
    if (!currentConvID) {
      try {
        const newConversation = await createConversation(
          userID,
          doctorID || ""
        );
        if (newConversation?.id) {
          setConversationID(newConversation.id);
          currentConvID = newConversation.id;
        } else {
          Toast.show({
            type: "error",
            text1: "Lỗi",
            text2: "Lỗi khi tạo cuộc trò chuyện.",
          });
        }
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Lỗi khi tạo cuộc trò chuyện.",
        });
        return;
      }
    }

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
              userID,
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
    const messageIndex = messages.length - 1 - index;
    const currentDate = formatDate(messages[messageIndex].timestamp);
    const nextDate =
      messageIndex > 0
        ? formatDate(messages[messageIndex - 1].timestamp)
        : null;

    const showDate = currentDate !== nextDate;

    return (
      <MessageItem
        message={item}
        showDate={showDate} // Chỉ truyền true nếu ngày khác ngày trước đó
        onImagePress={() => handleImagePress(item.content)}
        onLongPress={() => {
          console.log("Nhấn giữ tin nhắn");
          if (item.sender === "bs") return; // Không cho phép thu hồi tin nhắn của bác sĩ
          setSelectedMessage(item); // Lưu tin nhắn được chọn
          console.log("Tin nhắn được chọn: ", item);
          setIsRecallModalVisible(true); // Hiển thị modal thu hồi tin nhắn
        }} // Gọi hàm thu hồi tin nhắn khi nhấn giữ
      />
    );
  };

  // Hàm format ngày cho so sánh
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Xử lý nhấn vào hình ảnh
  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Lưu URI của hình ảnh được chọn
    setIsModalVisible(true); // Hiển thị modal để phóng to hình ảnh
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center p-3 bg-white border-b border-gray-300">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="angle-left" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={
            doctorAvtUrl
              ? { uri: doctorAvtUrl }
              : require("../../assets/avatar-placeholder.png")
          }
          className="w-10 h-10 rounded-full ml-3"
        />
        <Text className="ml-3 font-bold text-lg">BS. {doctorName}</Text>
        {/* <TouchableOpacity
          className="ml-auto"
          onPress={() => {
            navigation.navigate("VideoCallScreen", { doctorID });
          }}
        >
          <Ionicons name="call-outline" size={24} color="black" />
        </TouchableOpacity> */}
      </View>

      {/* Danh sách tin nhắn */}
      {messages.length === 0 && (
        <View className="flex-1 justify-center items-center px-4">
          <View className="items-center">
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={100}
              color="#9CA3AF"
            />
            <Text className="text-xl font-semibold text-gray-700 mt-6 mb-2">
              Chưa có tin nhắn nào
            </Text>
            <Text className="text-base text-gray-500 text-center">
              Bắt đầu trò chuyện để kết nối với bác sĩ và nhận tư vấn sức khỏe.
            </Text>
          </View>
        </View>
      )}
      <FlatList
        ref={flatListRef}
        data={messages.slice().reverse()} // đảo ngược mảng để hiển thị tin nhắn mới ở cuối
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        className="flex-1"
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end", // Đẩy nội dung về cuối
          paddingBottom: 12,
        }}
        inverted // Lật danh sách để tin nhắn mới hiển thị ở dưới cùng
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

      {/* Modal thao tác với tin nhắn */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRecallModalVisible}
        onRequestClose={() => setIsRecallModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/30 justify-end"
          onPress={() => setIsRecallModalVisible(false)}
        >
          <View className="bg-white rounded-t-2xl px-5 pt-5 pb-10">
            <TouchableOpacity
              className="items-center p-4 rounded"
              onPress={() => {
                if (selectedMessage) {
                  const url =
                    selectedMessage.type === "image"
                      ? selectedMessage.content
                      : "";

                  handleRecallMessage(
                    selectedMessage.content,
                    selectedMessage.timestamp,
                    selectedMessage.type,
                    url
                  );
                }

                setIsRecallModalVisible(false);
                setSelectedMessage(null);
                setIsRecallModalVisible(false);
              }}
            >
              <MaterialIcons name="delete" size={32} color="#dc2626" />
              <Text className="text-base text-red-600 mt-2">
                Thu hồi tin nhắn
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ChatDetailScreen;
