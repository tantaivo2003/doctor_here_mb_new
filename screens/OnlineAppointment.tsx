import { useState } from "react";
import DateTimePicker, {
  DateType,
  getDefaultStyles,
} from "react-native-ui-datepicker";
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Modal,
} from "react-native";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt
import { Ionicons } from "@expo/vector-icons";
import DoctorCalendarUI from "../components/ui/DoctorCalendarUI";
import { GioHen } from "../types/types";
import { pickImageFromLibrary } from "../utils/imagePicker";
import ZoomImageModal from "../components/ui/ZoomImageModal";

import NotificationModal from "../components/ui/NotificationModal";

export default function OnlineAppointment({ navigation, route }: any) {
  const { doctor } = route.params;
  const [selectedDate, setSelectedDate] = useState<DateType>();
  const [selectedTime, setSelectedTime] = useState<GioHen>();
  const [reason, setReason] = useState(""); // Lý do khám / triệu chứng
  const [images, setImages] = useState<string[]>([]); // Danh sách ảnh đã chọn
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationType, setNotificationType] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSelectDateTime = (date: string, time: GioHen) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  // Xử lý chọn ảnh
  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) {
      setImages((prevImages) => [...prevImages, uri]);
    }
  };

  // Xử lý nhấn vào hình ảnh
  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Lưu URI của hình ảnh được chọn
    setIsModalVisible(true); // Hiển thị modal để phóng to hình ảnh
  };
  const handleContinue = () => {
    if (!reason.trim()) {
      setNotificationType("error");
      setNotificationMessage("Vui lòng nhập lý do khám.");
      setNotificationVisible(true);
      return;
    }
    if (!selectedDate) {
      setNotificationType("error");
      setNotificationMessage("Vui lòng chọn ngày khám.");
      setNotificationVisible(true);
      return;
    }
    navigation.navigate("ConfirmAppointment", {
      doctor: doctor,
      date: selectedDate,
      time: selectedTime,
      reason: reason,
      images: images,
    });
  };
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row my-2 items-center justify-between">
        <Text className="text-xl font-bold text-gray-800">
          Lý do khám / triệu chứng
        </Text>
      </View>
      <TextInput
        className="border p-4 rounded-xl mb-4"
        placeholder="Lý do khám / triệu chứng"
        value={reason}
        onChangeText={setReason}
      />

      <DoctorCalendarUI
        doctorId={doctor.id}
        isOnlineMethod={true}
        onSelectDateTime={handleSelectDateTime}
        handleContinue={handleContinue}
      />

      <View className="flex-row my-2 items-center justify-between">
        <Text className="text-xl font-bold text-gray-800">
          Hình ảnh bổ sung
        </Text>
        <TouchableOpacity
          onPress={pickImage}
          className=""
          disabled={images.length >= 3}
        >
          <Text className="font-semibold text-blue-500">
            {images.length >= 3 ? "Tối đa 3 ảnh" : "Thêm hình ảnh"}
          </Text>
        </TouchableOpacity>
      </View>
      {images.length === 0 ? (
        <Text className="text-center items-center mt-5">
          Bạn có thể bổ sung hình ảnh ở đây
        </Text>
      ) : (
        <View className="flex-row flex-wrap gap-3 ml-2 mb-4 ">
          {images.map((uri, index) => (
            <View
              key={index}
              className="w-[31%] relative rounded-xl overflow-hidden border border-gray-200"
            >
              <TouchableOpacity onPress={() => handleImagePress(uri)}>
                <Image
                  source={{ uri }}
                  key={index}
                  className="w-full h-64"
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                onPress={() => {
                  const newImages = [...images];
                  newImages.splice(index, 1);
                  setImages(newImages);
                }}
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        className="w-full bg-blue-500 py-3 rounded-full items-center mr-2 mt-5 mb-10"
        onPress={() => handleContinue()}
      >
        <Text className="text-white font-semibold">Tiếp tục</Text>
      </TouchableOpacity>
      <NotificationModal
        visible={notificationVisible}
        type={notificationType}
        message={notificationMessage}
        onClose={() => setNotificationVisible(false)}
      />

      <ZoomImageModal
        visible={isModalVisible}
        imageUri={selectedImage}
        onClose={() => setIsModalVisible(false)}
      />
    </ScrollView>
  );
}
