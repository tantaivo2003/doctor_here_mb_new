import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { fetchDoctorCalendar } from "../../api/Appointment";
import LoadingAnimation from "./LoadingAnimation";
import { set } from "date-fns";
import { LichNgay, GioHen } from "../../types/types";
import { formatDateTime } from "../../utils/formatDateTime";

interface CalendarUIProps {
  doctorId: string;
  isOnlineMethod: boolean;
  onSelectDateTime?: (date: string, time: GioHen) => void;
  handleContinue: () => void;
}

const CalendarUI: React.FC<CalendarUIProps> = ({
  doctorId,
  isOnlineMethod,
  onSelectDateTime,
  handleContinue,
}) => {
  const [calendarData, setCalendarData] = useState<LichNgay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<GioHen>();
  const [currentMonth, setCurrentMonth] = useState("03/2025");

  const [isLoading, setIsLoading] = useState(false);

  const loadCalendar = async (month: string) => {
    setIsLoading(true);
    const [monthStr, yearStr] = month.split("/");
    const startTime = `${yearStr}-${monthStr}-01T00:00:00`; // Tháng bắt đầu từ ngày 1
    const endTime = `${yearStr}-${monthStr}-31T23:59:59`;

    const data = await fetchDoctorCalendar(
      doctorId,
      startTime,
      endTime,
      isOnlineMethod
    );

    if (data) {
      setCalendarData(data);
      setSelectedDate(data[0]?.ngay_lam_viec || null);
      setSelectedTime(data[0]?.Gio_hen[0] || null);
      if (onSelectDateTime) {
        onSelectDateTime(data[0]?.ngay_lam_viec, data[0]?.Gio_hen[0]);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCalendar(currentMonth); // Load lịch cho tháng hiện tại
  }, [currentMonth]);

  const handleDateSelect = (ngay: string) => {
    setSelectedDate(ngay);
    const selected = calendarData.find((item) => item.ngay_lam_viec === ngay);
    const firstSlot = selected?.Gio_hen[0];
    setSelectedTime(firstSlot);

    if (onSelectDateTime && firstSlot) {
      onSelectDateTime(ngay, firstSlot);
    }
  };

  const getTimeSlotsForSelectedDate = () => {
    const selected = calendarData.find(
      (item) => item.ngay_lam_viec === selectedDate
    );
    return selected?.Gio_hen || [];
  };

  const handleChangeMonth = (direction: "prev" | "next") => {
    const [monthStr, yearStr] = currentMonth.split("/").map(Number);
    let newMonth = monthStr;
    let newYear = yearStr;

    if (direction === "next") {
      if (newMonth === 12) {
        newMonth = 1;
        newYear += 1;
      } else {
        newMonth += 1;
      }
    } else if (direction === "prev") {
      if (newMonth === 1) {
        newMonth = 12;
        newYear -= 1;
      } else {
        newMonth -= 1;
      }
    }

    setCurrentMonth(`${newMonth.toString().padStart(2, "0")}/${newYear}`);
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center py-10">
        <LoadingAnimation />
        <Text className="mt-4 text-gray-600 text-base">
          Đang tải lịch khám...
        </Text>
      </View>
    );
  }

  // Hàm xử lý chia slot thành 3 hàng
  const getTimeSlotRows = () => {
    const slots = getTimeSlotsForSelectedDate();
    const rows: GioHen[][] = [[], [], []];
    slots.forEach((slot, index) => {
      rows[index % 3].push(slot); // chia 3 hàng
    });
    return rows;
  };
  return (
    <View className="bg-white rounded-lg flex justify-center">
      <Text className="text-xl font-bold text-gray-800 mb-3">
        Chọn ngày khám
      </Text>
      {/* Month Display */}
      <View className="border rounded-md py-2 px-4 mb-3 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => handleChangeMonth("prev")}>
          <FontAwesome5 name="chevron-left" size={20} color="#374151" />
        </TouchableOpacity>

        <Text className="text-base text-gray-700 font-semibold">
          Lịch tháng {currentMonth}
        </Text>

        <TouchableOpacity onPress={() => handleChangeMonth("next")}>
          <FontAwesome5 name="chevron-right" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Day Picker */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row mb-3">
          {calendarData.map((item) => {
            const dateObj = new Date(item.ngay_lam_viec);
            const date = dateObj.getDate();

            return (
              <View key={item.ngay_lam_viec} className="items-center mr-1 mt-2">
                <TouchableOpacity
                  onPress={() => handleDateSelect(item.ngay_lam_viec)}
                  className={`rounded-full w-16 h-16 items-center justify-center ${
                    selectedDate === item.ngay_lam_viec
                      ? "bg-blue-500"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedDate === item.ngay_lam_viec
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {item.thu}
                  </Text>
                  <Text
                    className={`text-sm font-semibold ${
                      selectedDate === item.ngay_lam_viec
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {date}
                  </Text>
                </TouchableOpacity>
                <View className="bg-green-500 rounded-md py-1 px-2">
                  <Text className="text-xs text-white">
                    {item.Gio_hen.length} slots
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Time Slots */}
      <Text className="text-xl font-bold text-gray-800 mb-3">
        Chọn giờ khám
      </Text>
      <View className="w-full items-center">
        {getTimeSlotsForSelectedDate().length === 0 ? (
          <Text className="text-gray-500 text-lg mt-4">
            Không có khung giờ khả dụng.
          </Text>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="gap-2">
                {getTimeSlotRows().map((row, rowIndex) => (
                  <View key={rowIndex} className="flex-row my-1">
                    {row.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        className={`w-40 h-14 rounded-lg flex items-center justify-center mx-1 ${
                          selectedTime?.id === item.id
                            ? "bg-blue-500"
                            : "bg-gray-100"
                        }`}
                        onPress={() => {
                          setSelectedTime(item);
                          if (selectedDate && onSelectDateTime) {
                            onSelectDateTime(selectedDate, item);
                          }
                        }}
                      >
                        <Text
                          className={`font-semibold ${
                            selectedTime?.id === item.id
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {formatDateTime(item.thoi_diem_bat_dau, "time")} -{" "}
                          {formatDateTime(item.thoi_diem_ket_thuc, "time")}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

export default CalendarUI;
