import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";

interface DatePickerFieldProps {
  date: DateType;
  onChange: (date: DateType) => void;
  placeholder?: string;
  label?: string;
  maxDate?: DateType;
  minDate?: DateType;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  date,
  onChange,
  placeholder = "DD/MM/YYYY",
  label,
  maxDate,
  minDate,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Kiểm tra xem date có hợp lệ không
  const isValidDate = date && dayjs(date).isValid();

  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-1 text-gray-700 font-bold text-lg">{label}</Text>
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center border border-gray-300 px-3 py-4 rounded-lg bg-white"
      >
        <FontAwesome name="calendar" size={22} color="#4B5563" />
        <Text className="flex-1 ml-4 text-base text-gray-700">
          {isValidDate ? dayjs(date).format("DD/MM/YYYY") : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View className="bg-white p-4 rounded-xl">
          <DateTimePicker
            mode="single"
            // Nếu date không hợp lệ, dùng ngày hiện tại làm mặc định trong picker
            date={isValidDate ? date : new Date()}
            onChange={({ date }) => {
              onChange(date);
              setModalVisible(false);
            }}
            minDate={minDate}
            maxDate={maxDate}
            locale="vi"
          />
        </View>
      </Modal>
    </View>
  );
};

export default DatePickerField;
