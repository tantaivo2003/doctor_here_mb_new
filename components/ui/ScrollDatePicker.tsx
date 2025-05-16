import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import moment from "moment";

interface DatePickerProps {
  onDateSelect: (date: string) => void;
  initialDate?: string; // Ngày được chọn ban đầu (tùy chọn)
}

const ScrollDatePicker: React.FC<DatePickerProps> = ({
  onDateSelect,
  initialDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || moment().format("YYYY-MM-DD")
  );
  const [calendarDays, setCalendarDays] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const today = moment();
    const startDate = today.clone().subtract(15, "days");
    const endDate = today.clone().add(15, "days");
    const daysArray = [];

    let currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate)) {
      daysArray.push({
        ngay_lam_viec: currentDate.format("YYYY-MM-DD"),
        thu: currentDate.format("ddd"), // Thứ trong tuần (ví dụ: Mon, Tue)
        date: currentDate.format("D"), // Ngày trong tháng
      });
      currentDate.add(1, "day");
    }

    setCalendarDays(daysArray);
    setTimeout(() => {
      const todayIndex = daysArray.findIndex(
        (d) => d.ngay_lam_viec === today.format("YYYY-MM-DD")
      );
      if (todayIndex !== -1 && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: (todayIndex - 1) * 58,
          animated: true,
        });
        // 80 là chiều rộng ước lượng của mỗi ô (w-16 ~ 64px + margin)
      }
    }, 100);
  }, []);

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const todayFormatted = moment().format("DD [tháng] MM");
  const selectedDateFormatted = moment(selectedDate).format("DD [tháng] MM");

  return (
    <View className="mb-1 bg-blue-50 p-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        className="mb-2"
      >
        <View className="flex-row">
          {calendarDays.map((day) => (
            <View key={day.ngay_lam_viec} className="items-center mr-2">
              <TouchableOpacity
                onPress={() => handleDayPress(day.ngay_lam_viec)}
                className={`rounded-full w-16 h-16 items-center justify-center ${
                  selectedDate === day.ngay_lam_viec
                    ? "bg-blue-500"
                    : "bg-blue-100"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedDate === day.ngay_lam_viec
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {day.thu}
                </Text>
                <Text
                  className={`text-sm font-semibold ${
                    selectedDate === day.ngay_lam_viec
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {day.date}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {selectedDate !== moment().format("YYYY-MM-DD") ? (
        <Text className="text-center text-blue-500 text-sm">
          {`Đã chọn: ${selectedDateFormatted}`}
        </Text>
      ) : (
        <Text className="text-center text-blue-500 text-sm">
          {`Hôm nay, ${todayFormatted}`}
        </Text>
      )}
    </View>
  );
};

export default ScrollDatePicker;
