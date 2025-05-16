import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { MedicineScheduleIntake } from "../../types/types";
import { FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";

const periodBackgroundColors: Record<string, string> = {
  Sáng: "bg-yellow-100",
  Trưa: "bg-green-100",
  Chiều: "bg-orange-100",
  Tối: "bg-purple-100",
};

const MedicineItem = ({
  medicine,
  onPress,
  onExpand,
  showDivider = true, // nhận thêm prop
}: {
  medicine: MedicineScheduleIntake;
  onPress?: () => void;
  onExpand?: (medicine: MedicineScheduleIntake) => void;
  showDivider?: boolean;
}) => {
  const taken = medicine.takenAt !== null;
  const intakeTime = `${medicine.time.slice(0, 5)}`;
  const takenAtTime = medicine.takenAt
    ? dayjs(medicine.takenAt).format("HH:mm")
    : "";
  const backgroundColor = periodBackgroundColors[medicine.period] || "bg-white";
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-3 px-4 rounded-lg mb-2 ${backgroundColor}`}
    >
      {/* Dấu chấm tròn */}
      <View
        className={`w-8 h-8 rounded-full mr-3 ${
          taken ? "bg-green-500" : "bg-orange-400"
        }`}
      />

      {/* Nội dung */}
      <View className="flex-1">
        <Text className="font-bold text-base">{intakeTime}</Text>
        <Text className="text-gray-700">{medicine.prescriptionName}</Text>
        {taken && (
          <Text className="text-gray-500 text-xs italic">
            Uống lúc {takenAtTime}
          </Text>
        )}
      </View>

      {/* Nút mở rộng */}
      {onExpand && (
        <Pressable
          onPress={() => onExpand(medicine)}
          android_ripple={{ color: "#ccc", borderless: true }}
          className="p-2 rounded-full"
        >
          <FontAwesome name="ellipsis-v" size={20} color="#555" />
        </Pressable>
      )}
    </TouchableOpacity>
  );
};

export default MedicineItem;
