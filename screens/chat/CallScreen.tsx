import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import NotificationModal from "../../components/ui/NotificationModal";
import Modal from "react-native-modal";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { getAvt } from "../../services/storage";

const VideoCallScreen: React.FC = ({ navigation }: any) => {
  const [patientAvt, setPatientAvt] = useState<string | null>(null);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState({});
  const localVideoRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationType, setNotificationType] = useState("success"); // Hoặc "error"
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const avt = await getAvt();
      setPatientAvt(avt);
    };
  }, []);
  // Hàm xử lý việc tắt/bật micro
  const toggleAudio = () => {
    // TODO: Logic để tắt/bật audio cục bộ (thường thông qua SDK gọi video)
    setIsAudioMuted(!isAudioMuted);
  };

  // Hàm xử lý việc tắt/bật video
  const toggleVideo = () => {
    // TODO: Logic để tắt/bật video cục bộ (thường thông qua SDK gọi video)
    setIsVideoEnabled(!isVideoEnabled);
  };

  // Hàm xử lý việc kết thúc cuộc gọi
  const hangUp = () => {
    // TODO: Logic để kết thúc cuộc gọi
    // Ví dụ: Gửi tín hiệu kết thúc cuộc gọi đến những người tham gia khác
    // Ví dụ: Điều hướng người dùng ra khỏi màn hình gọi video
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-black">
      {/* View hiển thị màn hình của bệnh nhân*/}

      <View className="absolute top-4 right-4 w-32 h-48 rounded-md z-10">
        {isVideoEnabled ? (
          <Text>Video</Text>
        ) : (
          <Image
            source={
              patientAvt
                ? { uri: patientAvt }
                : require("../../assets/avatar-placeholder.png")
            }
            className="h-full w-full rounded-md"
          />
        )}
      </View>

      {/* View hiển thị video của bác sĩ */}
      <View className="flex-1 justify-center items-center">
        <Image
          source={{
            uri: "https://res.cloudinary.com/dpquv4bcu/image/upload/v1744614905/avatar/e9juhyvm3o5t44cuk9v6.jpg",
          }}
          className="h-full w-full rounded-md"
        />
      </View>

      {/* View chứa các nút điều khiển */}
      <View className="absolute bottom-8 left-0 right-0 flex-row justify-center items-center gap-10">
        {/* Nút tắt/bật micro */}

        <TouchableOpacity
          onPress={toggleAudio}
          className="bg-teal-600 rounded-full p-4"
        >
          {isAudioMuted ? (
            <Feather name="mic-off" size={30} color="white" />
          ) : (
            <Feather name="mic" size={30} color="white" />
          )}
        </TouchableOpacity>
        {/* Nút kết thúc cuộc gọi */}
        <TouchableOpacity
          onPress={hangUp}
          className="bg-red-500 rounded-full p-4"
        >
          <MaterialIcons name="call-end" size={30} color="white" />
        </TouchableOpacity>
        {/* Nút tắt/bật video */}
        <TouchableOpacity
          onPress={toggleVideo}
          className="bg-teal-600 rounded-full p-4"
        >
          {isVideoEnabled ? (
            <Feather name="video" size={30} color="white" />
          ) : (
            <Feather name="video-off" size={30} color="white" />
          )}
        </TouchableOpacity>

        {/* TODO: Thêm các nút điều khiển khác như chuyển camera */}
      </View>

      {/* Modal thông báo */}
      <NotificationModal
        visible={notificationVisible}
        type={notificationType}
        message={notificationMessage}
        onClose={() => setNotificationVisible(false)}
      />

      {/* Modal gia hạn */}
      <Modal
        isVisible={modalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="justify-center items-center">
          <View className="bg-white rounded-2xl p-6 items-center">
            <Text className="text-lg font-bold text-center">
              Xóa khỏi bác sĩ yêu thích?
            </Text>

            <View className="flex-row justify-around mt-4 gap-5">
              <TouchableOpacity
                className="py-3 px-6 bg-gray-100 w-2/5 items-center rounded-full"
                onPress={() => setModalVisible(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity className="py-3 px-6 bg-gray-900 w-2/5 items-center rounded-full">
                <Text className="text-white">Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VideoCallScreen;
