import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { fetchMedicineScheduleById } from "../../api/Diagnosis";
import { MedicineIntakeDetail } from "../../types/types";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const MedicineDetailScreen = ({ route }: any) => {
  const [medicineDetail, setMedicineDetail] =
    useState<MedicineIntakeDetail | null>(null);
  const { scheduleId } = route.params;

  useEffect(() => {
    const loadMedicineSchedule = async () => {
      try {
        console.log("Lịch trình thuốc ID:", scheduleId);
        const data = await fetchMedicineScheduleById(scheduleId);
        console.log("Dữ liệu lịch trình thuốc chi tiết:", data);
        setMedicineDetail(data);
      } catch (error) {
        console.error("Lỗi khi load lịch trình thuốc chi tiết:", error);
      }
    };

    if (scheduleId) {
      loadMedicineSchedule();
    }
  }, [scheduleId]);

  if (!medicineDetail) {
    return (
      <View className="flex-1 p-4 bg-white justify-center items-center">
        <Text className="text-gray-600">Đang tải thông tin thuốc...</Text>
      </View>
    );
  }

  const { gio, ngay, Don_thuoc, Thuoc_uong, thoi_diem_da_uong, buoi_uong } =
    medicineDetail;
  const isTaken = !!thoi_diem_da_uong;
  const takenAtFormatted = thoi_diem_da_uong
    ? dayjs(thoi_diem_da_uong).locale("vi").format("HH:mm")
    : "Chưa uống";
  const intakeTimeFormatted = `${buoi_uong} lúc ${gio.slice(0, 5)}`;
  const intakeDateFormatted = dayjs(ngay)
    .locale("vi")
    .format("DD [tháng] MM, YYYY");

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {/* Thông tin đơn thuốc */}
      <View className="rounded-lg bg-amber-100 p-4 mb-5">
        <Text className="text-xl font-bold text-amber-800 mb-2">
          {Don_thuoc.ten_don_thuoc}
        </Text>
        <Text className="text-gray-700">
          Ghi chú: {Don_thuoc.ghi_chu || "Không có ghi chú"}
        </Text>
      </View>

      {/* Thời gian uống */}
      <View className="mb-5">
        <Text className="text-base font-bold mb-1">Thời gian uống:</Text>
        <Text className="text-base">{intakeTimeFormatted}</Text>
        <Text className="text-base text-gray-500">
          Ngày {intakeDateFormatted}
        </Text>
      </View>

      {/* Danh sách thuốc */}
      <View className="mb-5">
        <Text className="text-base font-bold mb-2">Thuốc cần uống:</Text>
        {Thuoc_uong.map((thuoc) => (
          <View
            key={thuoc.id}
            className="flex-row items-center mb-4 border p-3 rounded-lg"
          >
            <Image
              source={
                thuoc.url
                  ? { uri: thuoc.url }
                  : require("../../assets/medicine.png")
              }
              className="w-16 h-16 rounded-md mr-4"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-base font-semibold">{thuoc.ten_thuoc}</Text>
              <Text className="text-gray-600">
                {thuoc.so_luong} {thuoc.don_vi}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Trạng thái đã uống */}
      {/* <TouchableOpacity
        className={`rounded-lg py-4 items-center mb-10 ${
          isTaken ? "bg-green-500" : "bg-blue-500"
        }`}
        onPress={() => {
          console.log("Đánh dấu đã uống thuốc");
        }}
      >
        <Text className="text-white font-bold text-base">
          {isTaken ? `Đã uống lúc ${takenAtFormatted}` : "Đánh dấu đã uống"}
        </Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

export default MedicineDetailScreen;
