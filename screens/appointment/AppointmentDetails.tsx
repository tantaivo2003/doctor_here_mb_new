import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import DoctorCard from "../../components/ui/DoctorCard";
import NotificationModal from "../../components/ui/NotificationModal";
import { formatDateTime } from "../../utils/formatDateTime";
import { fetchAppointmentDetail } from "../../api/Appointment";
import { AppointmentDetail } from "../../types/types";

import LoadingAnimation from "../../components/ui/LoadingAnimation";
export default function AppointmentDetails({ navigation, route }: any) {
  const { doctor, startTime } = route.params;
  const [loading, setLoading] = useState(true);

  const [appointmentDetail, setAppointmentDetail] =
    useState<AppointmentDetail>();

  useEffect(() => {
    const fetchDetail = async () => {
      const detail = await fetchAppointmentDetail(1);
      setAppointmentDetail(detail);
      setLoading(false);
    };

    fetchDetail();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <DoctorCard {...doctor} />

      {/* Hộp chứa thông tin */}
      <View className="bg-white rounded-2xl shadow-md p-4 mt-3 mb-10 border border-gray-200">
        {/* Giờ khám & Ngày khám */}
        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-gray-500">Giờ khám</Text>
            <Text className="font-bold text-gray-900">
              {formatDateTime(startTime, "time")}
            </Text>
          </View>
          <View>
            <Text className="text-gray-500">Ngày khám</Text>
            <Text className="font-bold text-gray-900">
              {formatDateTime(startTime, "date")}
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
              <Text className="font-bold text-gray-900 mb-2">--------</Text>

              <Text className="text-gray-500">CCCD</Text>
              <Text className="font-bold text-gray-900 mb-2">
                {appointmentDetail?.patientCCCD}
              </Text>
            </View>

            {/* Chi phí */}
            <View className="border-t border-gray-300 pt-4 mt-4">
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
            </View>

            {/* Phương thức thanh toán */}
            <View className="border-t border-gray-300 pt-4 mt-4">
              <Text className="text-gray-500">Phương thức thanh toán</Text>
              <Text className="font-bold text-blue-600">Trả tiền mặt</Text>
            </View>
          </View>
        )}
      </View>
      {/* Hình ảnh bổ sung
      <View>
        <Image
          source={
            appointmentDetail?.images
              ? { uri: appointmentDetail?.images[0] }
              : require("../../assets/avatar-placeholder.png")
          }
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      </View> */}
    </ScrollView>
  );
}
