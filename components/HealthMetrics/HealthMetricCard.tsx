import React from "react";
import { TouchableOpacity, Image, Text, View } from "react-native";

interface HealthMetricCardProps {
  label: string;
  unit: string;
  value?: string | number;
  imageSource?: any;
  onPress?: () => void;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  label,
  unit,
  value,
  imageSource,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="flex-1 bg-gray-100 p-4 rounded-lg mx-1 flex-row items-center"
      onPress={onPress}
    >
      {/* Hình ảnh */}
      <Image
        source={imageSource}
        className="w-16 h-16 mr-4"
        resizeMode="contain"
      />

      {/* Phần thông tin */}
      <View className="flex-1">
        <Text className="text-gray-600">{label}</Text>
        <Text className="text-lg font-bold">
          {value ? `${value} ${unit}` : "Chưa có dữ liệu"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default HealthMetricCard;
