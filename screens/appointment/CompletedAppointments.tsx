import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import StarRating from "react-native-star-rating-widget";
import Modal from "react-native-modal";
import { doctorlist, Appointment } from "../../types/types";
import { getUserID } from "../../services/storage";
import { getAppointment } from "../../api/Appointment";
import { formatDateTime } from "../../utils/formatDateTime";

import LoadingAnimation from "../../components/ui/LoadingAnimation";

export default function CompletedAppointments({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const patientId = await getUserID(); // Lấy patientId từ AsyncStorage
        if (!patientId) {
          console.error("Không tìm thấy patientId trong AsyncStorage");
          return;
        }

        const status = 2;
        const data = await getAppointment(Number(patientId), status);
        setAppointments(data);
      } catch (error) {
        console.error("Lỗi khi lấy lịch hẹn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleRatingPress = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const confirmRating = () => {
    console.log("Đã gửi đánh giá:", {
      rating,
      comment,
      doctor: selectedAppointment?.doctor,
    });
    setModalVisible(false);
    setRating(0);
    setComment("");
  };

  return (
    <View className="flex-1 bg-gray-100">
      {loading && <LoadingAnimation />}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white rounded-lg shadow-md p-4 mb-4 mx-4 mt-4"
            onPress={() =>
              navigation.navigate("AppointmentDetails", {
                doctor: {
                  id: item.id,
                  name: item.doctor,
                  specialty: item.specialty,
                  hospital: item.hospital,
                  rating: 4.5,
                  reviews: 120,
                  image: item.image,
                },
                date: item.date,
                startTime: item.startTime,
              })
            }
          >
            {/* Ngày giờ */}
            <Text className="text-gray-600 font-semibold mb-2">
              {formatDateTime(item.startTime)}
            </Text>
            <View className="h-[1px] bg-gray-300 my-2" />
            {/* Thông tin bác sĩ */}
            <View className="flex-row items-center">
              <View className="w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center">
                <Image
                  source={item.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="ml-4">
                <Text className="font-bold text-lg">{item.doctor}</Text>
                <Text className="text-gray-500">{item.specialty}</Text>
                <Text className="text-gray-400">{item.hospital}</Text>
              </View>
            </View>
            {/* Nút đánh giá */}
            <TouchableOpacity
              className="mt-4 bg-gray-900 p-2 rounded-full"
              onPress={() => handleRatingPress(item)}
            >
              <Text className="text-center text-white font-semibold">
                Đánh giá
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      {/* Modal đánh giá bác sĩ */}
      <Modal
        isVisible={modalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="bg-white rounded-2xl p-6">
          <Text className="text-lg font-bold text-center">Đánh giá bác sĩ</Text>
          {/* Chọn sao */}
          <Text className="mt-4 font-semibold">Điểm đánh giá</Text>
          <View className="flex-row items-center justify-center">
            <StarRating rating={rating} onChange={setRating} />
          </View>
          {/* Nhận xét */}
          <Text className="mt-4 font-semibold">Nhận xét</Text>
          <View className="bg-gray-100 rounded-lg p-2">
            <TextInput
              className="text-gray-900"
              value={comment}
              numberOfLines={5}
              multiline
              onChangeText={(text) => setComment(text)}
              placeholder="Nhập nhận xét của bạn..."
            />
          </View>
          {/* Nút hành động */}
          <View className="flex-row justify-end mt-4 gap-4">
            <TouchableOpacity
              className="px-4 py-2 bg-gray-100 rounded-full"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-gray-900">Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 bg-gray-900 rounded-full"
              onPress={confirmRating}
            >
              <Text className="text-white font-semibold">Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
