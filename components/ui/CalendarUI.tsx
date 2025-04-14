import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { fetchDoctorCalendar } from "../../api/Appointment";
import LoadingAnimation from "./LoadingAnimation";
import { set } from "date-fns";
import { LichNgay, GioHen } from "../../types/types";

interface CalendarUIProps {
  onSelectDateTime?: (date: string, time: GioHen) => void;
}

const CalendarUI: React.FC<CalendarUIProps> = ({ onSelectDateTime }) => {
  const [calendarData, setCalendarData] = useState<LichNgay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<GioHen>();
  const [currentMonth, setCurrentMonth] = useState("03/2025");

  const [isLoading, setIsLoading] = useState(true);

  const loadCalendar = async (month: string) => {
    setIsLoading(true);
    const [monthStr, yearStr] = month.split("/");
    const drID = "BS0000001";
    const startTime = `${yearStr}-${monthStr}-01T00:00:00`; // Tháng bắt đầu từ ngày 1
    const endTime = `${yearStr}-${monthStr}-31T23:59:59`;
    const isOnlMethod = true;

    const data = await fetchDoctorCalendar(
      drID,
      startTime,
      endTime,
      isOnlMethod
    );
    if (data) {
      setCalendarData(data);
      setSelectedDate(data[0]?.ngay_lam_viec || null);
      setSelectedTime(data[0]?.gio_hen[0] || null);
      if (onSelectDateTime) {
        onSelectDateTime(data[0]?.ngay_lam_viec, data[0]?.gio_hen[0]);
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
    const firstSlot = selected?.gio_hen[0];
    setSelectedTime(firstSlot);

    if (onSelectDateTime && firstSlot) {
      onSelectDateTime(ngay, firstSlot);
    }
  };

  const getTimeSlotsForSelectedDate = () => {
    const selected = calendarData.find(
      (item) => item.ngay_lam_viec === selectedDate
    );
    return selected?.gio_hen || [];
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
    return <LoadingAnimation />;
  }
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
              <View key={item.ngay_lam_viec} className="items-center mr-2 mt-2">
                <TouchableOpacity
                  onPress={() => handleDateSelect(item.ngay_lam_viec)}
                  className={`rounded-full w-14 h-14 items-center justify-center ${
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
                    {item.gio_hen.length} slots
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
        {getTimeSlotsForSelectedDate().length > 0 && (
          <View className="flex flex-wrap flex-row gap-4 items-center justify-center">
            {getTimeSlotsForSelectedDate().map((slot) => (
              <TouchableOpacity
                key={slot.id}
                className={`w-28 h-12 rounded-lg flex items-center justify-center ${
                  selectedTime === slot ? "bg-blue-500" : "bg-gray-100"
                }`}
                onPress={() => {
                  setSelectedTime(slot);
                  if (selectedDate && onSelectDateTime) {
                    onSelectDateTime(selectedDate, slot);
                  }
                }}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedTime === slot ? "text-white" : "text-gray-700"
                  }`}
                >
                  {slot.thoi_diem_bat_dau.split(" ")[0].substring(0, 5)} -{" "}
                  {slot.thoi_diem_ket_thuc.split(" ")[0].substring(0, 5)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default CalendarUI;
