import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { MedicineIntake } from "../../types/types";
import dayjs from "dayjs";

const MedicineItem = ({
  medicine,
  onPress,
}: {
  medicine: MedicineIntake;
  onPress?: (medicine: MedicineIntake) => void;
}) => {
  const taken = medicine.takenAt !== null;

  return (
    <TouchableOpacity onPress={() => onPress?.(medicine)} disabled={!onPress}>
      <View
        className={`flex-row items-center p-3 my-2 rounded-lg ${
          taken ? "bg-green-100" : "bg-white border border-gray-300"
        }`}
      >
        {/* Tạm thời dùng ảnh thuốc mặc định */}
        <Image
          source={require("../../assets/medicine.png")}
          className="w-14 h-14 rounded-lg"
        />
        <View className="ml-3">
          <Text className="font-bold text-base">
            {medicine.period} lúc {medicine.time.slice(0, 5)}
          </Text>
          <Text className="text-gray-600 text-sm">Ngày: {medicine.date}</Text>
          <Text className="text-gray-500 text-xs italic">
            {taken
              ? `Đã uống lúc ${new Date(medicine.takenAt!)
                  .toLocaleTimeString()
                  .slice(0, 5)} `
              : "Chưa uống"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MedicineItem;
