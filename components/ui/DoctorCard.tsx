import { View, Text, Image, TouchableOpacity } from "react-native";
import { FC, useState } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";

interface DoctorCardProps {
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  image: any;
  isFavorite?: boolean;
  onPress?: () => void;
}

const DoctorCard: FC<DoctorCardProps> = ({
  name,
  specialty,
  hospital,
  rating,
  reviews,
  image,
  isFavorite = false,
  onPress,
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(name);

  const confirmCancel = () => {
    setFavorite(false);
    setModalVisible(false);
  };

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
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <FontAwesome
              name={favorite ? "heart" : "heart-o"}
              size={20}
              color={favorite ? "red" : "gray"}
            />
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
      {/* Modal Xác Nhận Hủy */}
      <Modal
        isVisible={modalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="justify-center items-center">
          <View className="bg-white rounded-2xl p-6 items-center">
            <Text className="text-lg font-bold text-center">
              Xóa khỏi bác sĩ yêu thích?
            </Text>
            <Text className="text-center text-gray-500 my-5">
              Bạn có chắc muốn xóa {name} khỏi danh sách bác sĩ yêu thích không?
            </Text>
            <View className="flex-row justify-around mt-4 gap-5">
              <TouchableOpacity
                className="py-3 px-6 bg-gray-100 w-2/5 items-center rounded-full"
                onPress={() => setModalVisible(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 px-6 bg-gray-900 w-2/5 items-center rounded-full"
                onPress={confirmCancel}
              >
                <Text className="text-white">Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default DoctorCard;
