import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  fetchMedicineScheduleById,
  toggleMedicineSchedule,
} from "../../api/Diagnosis";
import { MedicineIntakeDetail } from "../../types/types";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import Toast from "react-native-toast-message";
import LoadingAnimation from "../../components/ui/LoadingAnimation";

const MedicineDetailScreen = ({ route }: any) => {
  const [medicineDetail, setMedicineDetail] =
    useState<MedicineIntakeDetail | null>(null);
  const { scheduleId } = route.params;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMedicineSchedule = async () => {
      try {
        const data = await fetchMedicineScheduleById(scheduleId);
        setMedicineDetail(data);
      } catch (error) {
        console.error("Lỗi khi load lịch trình thuốc chi tiết:", error);
      }
    };

    if (scheduleId) {
      loadMedicineSchedule();
    }
  }, [scheduleId]);

  const markAsTaken = async () => {
    try {
      setLoading(true);
      const drankTime = await toggleMedicineSchedule(scheduleId);
      // Gọi lại API để cập nhật trạng thái mới
      const updatedData = await fetchMedicineScheduleById(scheduleId);
      setMedicineDetail(updatedData);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Làm tốt lắm!",
      });
      setLoading(false);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Thất bại",
        text2: "Chưa tới thời gian uống thuốc.",
      });
    }
  };

  if (!medicineDetail) {
    return (
      <View className="flex-1 p-4 bg-white justify-center items-center">
        <Text className="text-gray-600">Đang tải thông tin thuốc...</Text>
      </View>
    );
  }
  if (loading) {
    return (
      <View className="flex-1 p-4 bg-white justify-center items-center">
        <LoadingAnimation />
      </View>
    );
  }
  const { gio, ngay, Don_thuoc, Thuoc_uong, thoi_diem_da_uong, buoi_uong } =
    medicineDetail;

  const isTaken = !!thoi_diem_da_uong;
  const takenAtFormatted = isTaken
    ? dayjs(thoi_diem_da_uong).locale("vi").format("HH:mm")
    : null;
  const intakeTimeFormatted = `${buoi_uong} lúc ${gio.slice(0, 5)}`;
  const intakeDateFormatted = dayjs(ngay)
    .locale("vi")
    .format("DD [tháng] MM, YYYY");

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {/* Tiêu đề */}
      <Text className="text-2xl font-bold mb-4 text-indigo-900">
        Chi tiết lịch uống thuốc
      </Text>

      {/* Đơn thuốc */}
      <View className="rounded-xl bg-yellow-100 p-4 mb-6 shadow-sm">
        <Text className="text-xl font-semibold text-yellow-800 mb-1">
          {Don_thuoc.ten_don_thuoc}
        </Text>
        <Text className="text-gray-700">
          Ghi chú: {Don_thuoc.ghi_chu || "Không có ghi chú"}
        </Text>
      </View>

      {/* Thời gian uống */}
      <View className="mb-6">
        <Text className="text-base font-semibold mb-1 text-gray-800">
          Thời gian uống:
        </Text>
        <Text className="text-base text-black">{intakeTimeFormatted}</Text>
        <Text className="text-base text-gray-500">
          Ngày {intakeDateFormatted}
        </Text>
      </View>

      {/* Danh sách thuốc */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-2 text-gray-800">
          Thuốc cần uống:
        </Text>
        {Thuoc_uong.map((thuoc) => (
          <View
            key={thuoc.id}
            className="flex-row items-center mb-4 border border-gray-200 rounded-xl p-3 bg-gray-50"
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
              <Text className="text-base font-medium">{thuoc.ten_thuoc}</Text>
              <Text className="text-gray-600">
                {thuoc.so_luong} {thuoc.don_vi}
              </Text>
              {thuoc.truoc_an !== null && thuoc.truoc_an !== undefined && (
                <Text className="text-sm text-gray-500 italic">
                  {thuoc.truoc_an ? "Uống trước khi ăn" : "Uống sau khi ăn"}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Trạng thái uống */}
      <TouchableOpacity
        disabled={isTaken}
        onPress={() => {
          markAsTaken();
        }}
        className={`rounded-lg py-4 items-center ${
          isTaken ? "bg-green-500" : "bg-blue-500"
        }`}
      >
        <Text className="text-white font-bold text-base">
          {isTaken ? `Đã uống lúc ${takenAtFormatted}` : "Đánh dấu đã uống"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MedicineDetailScreen;
