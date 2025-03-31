import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import "dayjs/locale/vi"; // Import locale tiếng Việt

import { LanUong, listLanUong } from "../../types/types";
const MedicineItem = ({
  medicine,
  onPress,
}: {
  medicine: LanUong;
  onPress?: (medicine: LanUong) => void;
}) => {
  return (
    <TouchableOpacity onPress={() => onPress?.(medicine)} disabled={!onPress}>
      <View
        className={`flex-row items-center p-3 my-2 rounded-lg ${
          medicine.trang_thai === "taken"
            ? "bg-green-100"
            : "bg-white border border-gray-300"
        }`}
      >
        <Image source={medicine.image} className="w-14 h-14 rounded-lg" />
        <View className="ml-3">
          <Text className="font-bold">
            Lần {medicine.id}: {medicine.gio}
          </Text>
          <Text className="text-blue-500 font-semibold">
            {medicine.ten_thuoc}
          </Text>
          <Text className="text-gray-500">Ghi chú: {medicine.ghi_chu}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MedicineItem;
