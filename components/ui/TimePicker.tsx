import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// Định nghĩa type cho props
type TimePickerProps = {
  onChange: (date: Date) => void;
};

const TimePicker: React.FC<TimePickerProps> = ({ onChange }) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      onChange(selectedDate); // Gọi hàm được truyền từ component cha
    }
    setShowPicker(false); // Ẩn picker trên Android
  };

  return (
    <View>
      <TouchableOpacity
        className="mb-2 p-2 bg-blue-500 rounded-lg"
        onPress={() => setShowPicker(true)}
      >
        <Text className="text-white text-center">Thay đổi giờ uống</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default TimePicker;
