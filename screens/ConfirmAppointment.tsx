import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import DoctorCard from "../components/ui/DoctorCard";
import NotificationModal from "../components/ui/NotificationModal";
import { Patient } from "../types/types";
import { fetchPatientDetail } from "../api/Patient";
import LoadingAnimation from "../components/ui/LoadingAnimation";
import LoadingModal from "../components/ui/LoadingModal";
import { createAppointment } from "../api/Appointment";
import { getUserID } from "../services/storage";
import { formatDateTime } from "../utils/formatDateTime";
import { Ionicons } from "@expo/vector-icons";

export default function ConfirmAppointment({ navigation, route }: any) {
  const { doctor, date, time, reason, images } = route.params;
  const [user, setUser] = useState<Patient>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [notificationType, setNotificationType] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);

  const handleConfirm = async () => {
    setLoadingModal(true);
    const appointmentInformation = {
      textContent: reason.trim(),
      ptID: await getUserID(), // lấy id người dùng từ storage
      drID: doctor.id, // đảm bảo lấy đúng id
      timeslotID: time.id,
      urls: images,
    };

    const success = await createAppointment(appointmentInformation);
    if (success) {
      setModalVisible(true);
      setNotificationType("success");
      setNotificationMessage("Đặt lịch khám thành công!");
    } else {
      setModalVisible(true);
      setNotificationType("error");
      setNotificationMessage("Đã xảy ra lỗi khi đặt lịch khám.");
    }
    setLoadingModal(false);
  };

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        console.log(doctor);
        const result = await fetchPatientDetail();

        if (result) {
          setUser(result);
        } else {
          console.warn("Không tìm thấy thông tin người dùng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserDetail();
  }, []);

  // Xử lý nhấn vào hình ảnh
  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Lưu URI của hình ảnh được chọn
    setIsZoomModalVisible(true); // Hiển thị modal để phóng to hình ảnh
  };
  return (
    <ScrollView className="flex-1 bg-white p-4">
      {loadingModal && <LoadingModal />}
      <DoctorCard {...doctor} />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <LoadingAnimation />
        </View>
      ) : (
        <>
          <Text className="text-xl font-bold text-gray-800 mt-3">
            Thông tin đăng ký
          </Text>
          <View className="bg-white rounded-2xl shadow-md p-4 mt-3 border border-gray-200">
            {/* Lý do khám*/}
            <View className="mb-4">
              <Text className="text-gray-500">Lý do khám</Text>
              <Text className="font-bold text-gray-900">{reason}</Text>
            </View>

            {/* Giờ khám & Ngày khám */}
            <View className="flex-row border-t border-gray-300 justify-between mb-4 pt-4">
              <View>
                <Text className="text-gray-500">Giờ khám</Text>
                <Text className="font-bold text-gray-900">
                  {formatDateTime(time.thoi_diem_bat_dau, "time")} -{" "}
                  {formatDateTime(time.thoi_diem_ket_thuc, "time")}
                </Text>
              </View>
              <View>
                <Text className="text-gray-500">Ngày khám</Text>
                <Text className="font-bold text-gray-900">{date}</Text>
              </View>
            </View>

            {/* Thông tin cá nhân */}
            <View className="border-t border-gray-300 pt-4">
              <Text className="text-gray-500">Họ và tên</Text>
              <Text className="font-bold text-gray-900 mb-2">
                {user?.fullName}
              </Text>

              <Text className="text-gray-500">Giới tính</Text>
              <Text className="font-bold text-gray-900 mb-2">
                {user?.gender}
              </Text>

              <Text className="text-gray-500">Ngày sinh</Text>
              <Text className="font-bold text-gray-900 mb-2">
                {user?.birthDate}
              </Text>

              <Text className="text-gray-500">SĐT</Text>
              <Text className="font-bold text-gray-900 mb-4">
                {user?.phone}
              </Text>
            </View>
            <View className="border-t border-gray-300 pt-4">
              <Text className="text-gray-500">BHYT</Text>
              <Text className="font-bold text-gray-900 mb-2">
                {user?.insurance?.insuranceCode}
              </Text>

              <Text className="text-gray-500">CCCD</Text>
              <Text className="font-bold text-gray-900 mb-2">{user?.cccd}</Text>
            </View>

            {/* Chi phí */}
            {/* <View className="border-t border-gray-300 pt-4 mt-4">
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Phí khám</Text>
            <Text className="font-bold text-gray-900">100.000 VND</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-500">Phí tiện ích</Text>
            <Text className="font-bold text-gray-900">0 VND</Text>
          </View>

          <View className="flex-row justify-between mt-2 border-t border-gray-300 pt-2">
            <Text className="text-gray-500">Tổng thanh toán</Text>
            <Text className="font-bold text-gray-900">100.000 VND</Text>
          </View>
        </View> */}

            {/* Phương thức thanh toán */}
            {/* <View className="border-t border-gray-300 pt-4 mt-4">
          <Text className="text-gray-500">Phương thức thanh toán</Text>
          <Text className="font-bold text-blue-600">Trả tiền mặt</Text>
        </View> */}
          </View>

          {/* Hình ảnh bổ sung */}
          {images.length > 0 && (
            <>
              <Text className="text-xl font-bold text-gray-800 my-3">
                Hình ảnh bổ sung
              </Text>

              <View className="flex-row flex-wrap gap-3 ml-2 mb-4 ">
                {images.map((uri: any, index: any) => (
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
                  </View>
                ))}
              </View>
            </>
          )}
          <TouchableOpacity
            className="flex-1 bg-blue-500 py-3 rounded-full items-center mr-2 my-5"
            onPress={handleConfirm}
          >
            <Text className="text-white font-semibold">Xác nhận</Text>
          </TouchableOpacity>
        </>
      )}
      {/* Hiển thị modal */}
      <NotificationModal
        visible={isModalVisible}
        //nếu time là 09:00 AM thì type là error ngược lại
        type={notificationType}
        message={notificationMessage}
        onClose={() => {
          if (notificationType === "success") {
            setModalVisible(false);
            navigation.popToTop();
          } else {
            setModalVisible(false);
          }
        }}
      />

      <Modal
        visible={isZoomModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsZoomModalVisible(false)}
      >
        <View className="flex justify-center items-center bg-black bg-opacity-70 h-full w-full">
          {selectedImage && (
            <View className="w-full h-full justify-center items-center">
              <Image
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: "80%", resizeMode: "contain" }}
              />

              <TouchableOpacity
                onPress={() => setIsZoomModalVisible(false)}
                className="absolute top-0 right-4 z-50"
              >
                <Ionicons name="close-circle" size={36} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}
