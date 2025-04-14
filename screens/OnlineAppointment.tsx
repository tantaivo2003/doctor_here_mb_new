import { useState } from "react";
import DateTimePicker, {
  DateType,
  getDefaultStyles,
} from "react-native-ui-datepicker";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt
import { Ionicons } from "@expo/vector-icons";
import CalendarUI from "../components/ui/CalendarUI";
import { GioHen } from "../types/types";
import { pickImageFromLibrary } from "../utils/imagePicker";

import NotificationModal from "../components/ui/NotificationModal";

export default function OnAppointment({ navigation, route }: any) {
  const { doctor } = route.params;
  const [selectedDate, setSelectedDate] = useState<DateType>();
  const [selectedTime, setSelectedTime] = useState<GioHen>();
  const [reason, setReason] = useState(""); // Lý do khám / triệu chứng
  const [images, setImages] = useState<string[]>([]); // Danh sách ảnh đã chọn

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

  const handleContinue = () => {
    if (!reason.trim()) {
      setNotificationType("error");
      setNotificationMessage("Vui lòng nhập lý do khám.");
      setNotificationVisible(true);
      return;
    }
    navigation.navigate("ConfirmAppointment", {
      doctor: doctor,
      date: selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : null,
      time: selectedTime,
      reason: reason,
      images: images,
    });
  };
  return (
    <ScrollView
      className="flex-1 bg-white p-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row my-5 items-center justify-between">
        <Text className="text-xl font-bold text-gray-800">
          Thông tin bổ sung
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
      <TextInput
        className="border p-4 rounded-xl mb-4"
        placeholder="Lý do khám / triệu chứng"
        value={reason}
        onChangeText={setReason}
      />

      {images.length > 0 && (
        <View className="flex-row flex-wrap gap-3 ml-2 mb-4 ">
          {images.map((uri, index) => (
            <View
              key={index}
              className="w-[31%] relative rounded-xl overflow-hidden border border-gray-200"
            >
              <Image
                source={{ uri }}
                key={index}
                className="w-full h-64"
                resizeMode="cover"
              />
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

      <CalendarUI onSelectDateTime={handleSelectDateTime} />

      <TouchableOpacity
        className="flex-1 bg-blue-500 py-3 rounded-full items-center mr-2 mt-5 mb-10"
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
    </ScrollView>
  );
}
