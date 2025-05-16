// components/ui/TimeNavigator.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { formatDateTime } from "../../utils/formatDateTime";

interface Props {
  displayOption: string;
  currentDate: Date;
  onChange: (
    direction: "prev" | "next",
    type: "week" | "month" | "year"
  ) => void;
}

const TimeNavigator = ({ displayOption, currentDate, onChange }: Props) => {
  const type =
    displayOption === "Tuần"
      ? "week"
      : displayOption === "Tháng"
      ? "month"
      : "year";

  const handlePress = (dir: "prev" | "next") => {
    onChange(dir, type);
  };

  let displayText = "";
  if (type === "week") {
    // Tính start và end trong tuần
    const day = currentDate.getDay(); // 0 (CN) -> 6
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() + diffToMonday);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    displayText = `${formatDateTime(startDate, "date")} - ${formatDateTime(
      endDate,
      "date"
    )}`;
  } else {
    displayText = formatDateTime(currentDate, "year");
  }

  return (
    <View className="py-2 px-4 mt-3 flex-row justify-center items-center gap-5">
      <TouchableOpacity onPress={() => handlePress("prev")}>
        <FontAwesome5 name="chevron-left" size={20} color="#374151" />
      </TouchableOpacity>

      <Text className="text-base text-gray-700 font-semibold">
        {displayText}
      </Text>

      <TouchableOpacity onPress={() => handlePress("next")}>
        <FontAwesome5 name="chevron-right" size={20} color="#374151" />
      </TouchableOpacity>
    </View>
  );
};

export default TimeNavigator;
