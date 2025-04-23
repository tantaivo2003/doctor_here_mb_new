import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from "react-native";
import { useState } from "react";
import DoctorCard from "../../components/ui/DoctorCard";
import { formatDateTime } from "../../utils/formatDateTime";
import { fetchAppointmentDetail } from "../../api/Appointment";
import { AppointmentDetail, Doctor } from "../../types/types";
import Toast from "react-native-toast-message";
import { fetchInsuranceInfo } from "../../api/Patient";
import { InsuranceInfo } from "../../types/types";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { getAuthData } from "../../services/storage";
import { Ionicons } from "@expo/vector-icons";

import LoadingAnimation from "../../components/ui/LoadingAnimation";
export default function AppointmentDetails({ navigation, route }: any) {
  const { appointment } = route.params;
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);

  const [appointmentDetail, setAppointmentDetail] =
    useState<AppointmentDetail>();
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo | null>(
    null
  );

  useEffect(() => {
    const fetchDetail = async () => {
      const detail = await fetchAppointmentDetail(appointment.id);
      if (!detail) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không thể tải thông tin lịch hẹn",
        });
        setLoading(false);
        return;
      }
      setAppointmentDetail(detail);
      console.log(detail.images);
      setLoading(false);
    };

    const getInsuranceInfo = async () => {
      setLoading(true);
      const userData = await getAuthData();

      const data = await fetchInsuranceInfo(userData?.userId || "");
      if (data) {
        setInsuranceInfo(data);
      }
      setLoading(false);
    };
    fetchDetail();
    getInsuranceInfo();
  }, []);

  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Lưu URI của hình ảnh được chọn
    setIsZoomModalVisible(true); // Hiển thị modal để phóng to hình ảnh
  };
  if (!appointmentDetail) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-500 text-lg">
          Không có thông tin lịch hẹn
        </Text>
      </View>
    );
  }
  return (
    <ScrollView
      className="flex-1 bg-white p-4"
      showsVerticalScrollIndicator={false}
    >
      <DoctorCard
        id={appointmentDetail.doctorId}
        name={appointmentDetail.doctorName}
        specialty={appointmentDetail.doctorSpecialty}
        hospital={appointmentDetail.clinicAddress}
        image={appointmentDetail.doctorAvatarUrl}
      />

      {appointmentDetail.rating && (
        <>
          <Text className="text-xl font-bold text-gray-800 mt-2 mb-4">
            Nhận xét của bạn
          </Text>
          <View className="flex-row items-center">
            <Image
              source={
                appointmentDetail.patientAvatarUrl
                  ? { uri: appointmentDetail.patientAvatarUrl }
                  : require("../../assets/avatar-placeholder.png")
              }
              className="w-16 h-16 rounded-full"
            />
            <View className="ml-4">
              <Text className="text-lg font-bold text-gray-900">
                {appointmentDetail.patientName}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-sm font-semibold text-gray-700 mr-2">
                  {appointmentDetail.rating.diem_danh_gia.toFixed(1)}
                </Text>
                <StarRatingDisplay
                  rating={appointmentDetail.rating.diem_danh_gia}
                  starSize={20}
                  starStyle={{ marginHorizontal: 1 }}
                />
              </View>
            </View>
          </View>
          <Text className="text-gray-600 ml-20 mb-5 mt-2">
            {appointmentDetail.rating.noi_dung}
          </Text>
        </>
      )}

      <Text className="text-xl font-bold text-gray-800 mt-3">
        Thông tin đăng ký
      </Text>
      <View className="bg-white rounded-2xl shadow-md p-4 mt-3 mb-3 border border-gray-200">
        {/* Lý do khám*/}
        <View className="mb-4">
          <Text className="text-gray-500">Lý do khám</Text>
          <Text className="font-bold text-gray-900">
            {appointmentDetail.additionalText}
          </Text>
        </View>
        {/* Giờ khám & Ngày khám */}
        <View className="flex-row justify-between border-t border-gray-300 pt-4 mb-4">
          <View>
            <Text className="text-gray-500">Giờ khám</Text>
            <Text className="font-bold text-gray-900">
              {formatDateTime(appointmentDetail.appointmentStart, "time")} -{" "}
              {formatDateTime(appointmentDetail.appointmentEnd, "time")}
            </Text>
          </View>
          <View>
            <Text className="text-gray-500">Ngày khám</Text>
            <Text className="font-bold text-gray-900">
              {formatDateTime(appointmentDetail.appointmentStart, "date")}
            </Text>
          </View>
        </View>

        {/* Thông tin cá nhân */}
        {loading ? (
          <LoadingAnimation />
        ) : (
          <View>
            <View className="border-t border-gray-300 pt-4">
              <Text className="text-gray-500">Họ và tên</Text>
              <Text className="font-bold text-gray-900 mb-2">
                {appointmentDetail?.patientName}
              </Text>

              <Text className="text-gray-500">Giới tính</Text>
              <Text className="font-bold text-gray-900 mb-2">
                {appointmentDetail?.patientGender}
              </Text>

              <Text className="text-gray-500">Ngày sinh</Text>
              <Text className="font-bold text-gray-900 mb-2">
                {appointmentDetail?.patientBirthDate}
              </Text>

              <Text className="text-gray-500">SĐT</Text>
              <Text className="font-bold text-gray-900 mb-2">
                {appointmentDetail?.patientPhone}
              </Text>

              <Text className="text-gray-500">BHYT</Text>
              <Text className="font-bold text-gray-900 mb-2">
                {insuranceInfo?.insuranceCode}
              </Text>

              <Text className="text-gray-500">CCCD</Text>
              <Text className="font-bold text-gray-900 mb-2">
                {appointmentDetail?.patientCCCD}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Hình ảnh bổ sung */}
      {appointmentDetail.images.length > 0 && (
        <View className="mb-3">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            Hình ảnh bổ sung
          </Text>

          <View className="flex-row flex-wrap gap-3 ml-2 mb-4 ">
            {appointmentDetail.images.map((uri: any, index: any) => (
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
        </View>
      )}

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
