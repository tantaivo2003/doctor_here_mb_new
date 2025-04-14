import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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

import LoadingModal from "../../components/ui/LoadingModal";
import NotificationModal from "../../components/ui/NotificationModal";
import { createRating } from "../../api/Rating";

export default function CompletedAppointments({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState(true); // true for success, false for error

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchAppointments = async () => {
        setLoading(true);
        try {
          const patientId = await getUserID();
          if (!patientId) {
            console.error("Không tìm thấy patientId trong AsyncStorage");
            return;
          }

          const status = 2; // Chỉ lấy các lịch hẹn sắp tới
          const data = await getAppointment(patientId, status);
          setAppointments(data);
        } catch (error) {
          console.error("Lỗi khi lấy lịch hẹn:", error);
          setNotificationMessage("Lỗi khi lấy lịch hẹn");
          setNotificationType(false);
          setNotificationVisible(true);
        } finally {
          setLoading(false);
        }
      };

      fetchAppointments();
    }, [])
  );

  const handleRatingPress = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const confirmRating = async () => {
    try {
      const patientCode = await getUserID();

      if (!selectedAppointment?.id || !patientCode) {
        return;
      }

      const payload = {
        score: rating,
        content: comment,
        appointmentId: selectedAppointment.id,
        patientCode,
      };

      console.log("Sending rating:", payload);
      await createRating(payload);

      // Reset UI state
      setModalVisible(false);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      setNotificationMessage("Lỗi khi gửi đánh giá");
      setNotificationType(false);
      setNotificationVisible(true);
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-500 text-lg">Không có lịch hẹn nào</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-gray-100">
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
                  source={
                    item.image
                      ? { uri: item.image }
                      : require("../../assets/avatar-placeholder.png")
                  }
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
      {/* Loading Modal */}
      {loading && <LoadingModal />}
      {/* Notification Modal */}
      <NotificationModal
        visible={notificationVisible}
        message={notificationMessage}
        type={notificationType ? "success" : "error"}
        onClose={() => setNotificationVisible(false)}
      />
    </View>
  );
}
