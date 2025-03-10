import { useState } from "react";
import DateTimePicker, {
  DateType,
  getDefaultStyles,
} from "react-native-ui-datepicker";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
];

export default function DoctorAppointment({ navigation, route }: any) {
  const { doctor } = route.params;
  const defaultStyles = getDefaultStyles();
  let today = new Date();
  const [selectedDay, setSelectedDay] = useState<DateType>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  );
  const [selectedTime, setSelectedTime] = useState<string>("09:00 AM");

  return (
    <ScrollView
      className="flex-1 bg-white p-4"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xl font-bold text-gray-800 my-5">
        Chọn ngày khám
      </Text>
      <DateTimePicker
        mode="single"
        date={selectedDay}
        onChange={({ date }) => setSelectedDay(date)}
        styles={{
          ...defaultStyles,
        }}
        minDate={today}
        maxDate={new Date(today.getFullYear(), today.getMonth() + 3, 0)}
        locale="vi"
      />

      <Text className="text-xl font-bold text-gray-800 my-5">
        Chọn giờ khám
      </Text>
      <View className="flex flex-wrap flex-row justify-between">
        {timeSlots.map((item) => (
          <TouchableOpacity
            key={item}
            className={`w-28 h-12 rounded-lg flex items-center justify-center m-2 ${
              selectedTime === item ? "bg-gray-900" : "bg-gray-100"
            }`}
            onPress={() => setSelectedTime(item)}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedTime === item ? "text-white" : "text-gray-800"
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-xl font-bold text-gray-800 my-5">
        Thông tin bổ sung
      </Text>
      <Text className="text-gray-600">
        Bạn có thể cung cấp thêm các thông tin như là lý do khám, triệu chứng,
        đơn thuốc sử dụng gần đây.
      </Text>
      <TouchableOpacity
        className="flex-1 bg-gray-900 py-3 rounded-full items-center mr-2 my-5"
        onPress={() =>
          navigation.navigate("ConfirmAppointment", {
            doctor: doctor,
            date: selectedDay ? dayjs(selectedDay).format("DD/MM/YYYY") : null,
            time: selectedTime,
          })
        }
      >
        <Text className="text-white font-semibold">Tiếp tục</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
