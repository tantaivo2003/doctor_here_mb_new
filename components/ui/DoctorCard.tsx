import { View, Text, Image, TouchableOpacity } from "react-native";
import { FC } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

interface DoctorCardProps {
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  image: any;
  onPress?: () => void;
}

const DoctorCard: FC<DoctorCardProps> = ({
  name,
  specialty,
  hospital,
  rating,
  reviews,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-3 rounded-2xl bg-white shadow-md w-full"
    >
      <View className="w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center">
        <Image source={image} className="w-full h-full" resizeMode="cover" />
      </View>

      {/* Thông tin bác sĩ */}
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between">
          <Text className="text-lg font-bold text-gray-900">{name}</Text>
          <TouchableOpacity>
            <FontAwesome name="heart-o" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <View className="h-[1px] bg-gray-300 my-2" />

        <Text className="text-sm text-gray-600">{specialty}</Text>
        <View className="flex-row items-center mt-1">
          <MaterialIcons name="location-on" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">{hospital}</Text>
        </View>

        {/* Đánh giá */}
        <View className="flex-row items-center mt-2">
          <FontAwesome name="star" size={16} color="#FACC15" />
          <Text className="text-sm font-semibold text-gray-800 ml-1">
            {rating}
          </Text>
          <Text className="text-sm text-gray-500 ml-1">
            | {reviews.toLocaleString()} đánh giá
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DoctorCard;
