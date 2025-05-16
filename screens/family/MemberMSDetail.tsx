import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { fetchMedicineScheduleById } from "../../api/Diagnosis";
import { MedicineIntakeDetail } from "../../types/types";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const MemberMedicineScheduleDetail = ({ route }: any) => {
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
    .format("DD [tháng] MM,YYYY");

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {/* Thông tin đơn thuốc */}
      <View
        style={{ backgroundColor: "#F9F3E6" }}
        className="rounded-lg p-4 mb-5 flex-row items-center"
      >
        <View
          style={{ backgroundColor: "#E6D7C1" }}
          className="rounded-full w-8 h-8 justify-center items-center mr-3"
        >
          {/* Icon mô phỏng viên thuốc */}
          <View
            style={{ backgroundColor: "#FF7F50" }}
            className="w-3 h-3 rounded-full absolute"
          />
          <View
            style={{
              backgroundColor: "#FF7F50",
              transform: [{ rotate: "45deg" }],
            }}
            className="w-3 h-3 rounded-full absolute"
          />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold mb-1">
            {Don_thuoc.ten_don_thuoc}
          </Text>
          <Text className="text-sm text-gray-700">
            Ghi chú: {Don_thuoc.ghi_chu || "Không có ghi chú"}
          </Text>
        </View>
      </View>

      {/* Thời gian uống */}
      <View className="mb-5">
        <Text className="text-base font-bold mb-2">Uống lúc:</Text>
        <Text className="text-base">{intakeTimeFormatted}</Text>
        <Text className="text-base text-gray-500">
          Ngày {intakeDateFormatted}
        </Text>
      </View>

      {/* Tên toa thuốc */}
      <View className="mb-5">
        <Text className="text-base font-bold mb-2">Toa thuốc</Text>
        {Thuoc_uong.length > 0 && (
          <View className="border border-gray-300 rounded-md overflow-hidden">
            <View className="flex-row bg-gray-100 py-2">
              <Text className="flex-2 text-sm font-semibold text-gray-700 pl-2">
                Thuốc
              </Text>
              <Text className="flex-1 text-sm font-semibold text-gray-700 text-center">
                Số lượng
              </Text>
              <Text className="flex-2 text-sm font-semibold text-gray-700 pl-2">
                Ghi chú
              </Text>
            </View>
            {Thuoc_uong.map((thuoc) => (
              <View
                key={thuoc.id}
                className="flex-row py-2 border-b border-gray-200"
              >
                <Text className="flex-2 text-sm text-gray-700 pl-2">
                  {thuoc.ten_thuoc}
                </Text>
                <Text className="flex-1 text-sm text-gray-700 text-center">
                  {thuoc.so_luong} ({thuoc.don_vi})
                </Text>
                <Text className="flex-2 text-sm text-gray-700 pl-2">
                  {Don_thuoc.ghi_chu || ""}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Nút đánh dấu đã uống */}
      <TouchableOpacity
        className={`rounded-lg py-3 items-center ${
          isTaken ? "bg-green-500" : "bg-blue-500"
        }`}
        onPress={() => {
          console.log("Đánh dấu đã uống thuốc");
        }}
      >
        <Text className="text-white font-bold text-base">
          {isTaken ? `Đã uống lúc ${takenAtFormatted}` : "Đánh dấu đã uống"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MemberMedicineScheduleDetail;
