import { useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FC, useState } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";

import {
  storeFavoriteDoctors,
  isDoctorFavorite,
  addFavoriteDoctor,
  removeFavoriteDoctor,
  getUserID,
} from "../../services/storage";

import { addToLoveList, removeFromLoveList } from "../../api/LoveList";
interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating?: number;
  reviews?: number;
  image: any;
  onPress?: () => void;
}

const DoctorCard: FC<DoctorCardProps> = ({
  id,
  name,
  specialty,
  hospital,
  rating,
  reviews,
  image,
  onPress,
}) => {
  const [favorite, setFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(name);

  /* Kiểm tra xem doctor có trong danh sách yêu thích hay không */
  useEffect(() => {
    const checkFavorite = async () => {
      const favorite = await isDoctorFavorite(id);
      setFavorite(favorite);
    };
    checkFavorite();
  }, [id]);

  /* Hàm xử lí khi ấn vào nút yêu thích, khi đã yêu thích thì hiển thị modal, còn khi chưa yêu thích thì thêm vào dsach */
  const handleFavorite = async () => {
    if (favorite) {
      setModalVisible(true);
    } else {
      setFavorite(true);
      const patientId = await getUserID(); // Lấy ID bệnh nhân từ AsyncStorage
      const doctorId = id; // ID bác sĩ cần thêm

      if (patientId) {
        const success = await addToLoveList(patientId, doctorId);
        if (success) {
          Toast.show({
            type: "success",
            text1: "Thành công!",
            text2: `${selectedDoctor} đã được thêm vào danh sách yêu thích!`,
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Thất bại!",
            text2: `Có lỗi xảy ra, hãy thử lại sau!`,
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Thất bại!",
          text2: `Có lỗi xảy ra, hãy thử lại sau!`,
        });
      }
    }
  };

  const confirmCancel = async () => {
    setFavorite(false);
    setModalVisible(false);
    const patientId = await getUserID(); // Lấy ID bệnh nhân từ AsyncStorage
    const doctorId = id; // ID bác sĩ cần xóa

    if (patientId) {
      const success = await removeFromLoveList(patientId, doctorId);
      if (success) {
        Toast.show({
          type: "success",
          text1: "Thành công!",
          text2: `Đã xóa ${selectedDoctor} khỏi danh sách yêu thích!`,
        });
      } else {
        console.log("Xóa bác sĩ thất bại!");
      }
    } else {
      console.log("Không tìm thấy ID bệnh nhân");
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-3 rounded-2xl bg-white shadow-md w-full"
    >
      <View className="w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center">
        <Image
          source={
            image
              ? { uri: image }
              : require("../../assets/avatar-placeholder.png")
          }
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Thông tin bác sĩ */}
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between">
          <Text className="text-lg font-bold text-gray-900">{name}</Text>
          <TouchableOpacity onPress={() => handleFavorite()}>
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
        {(typeof rating === "number" || typeof rating === "string") &&
          (typeof reviews === "number" || typeof reviews === "string") && (
            <View className="flex-row items-center mt-2">
              <FontAwesome name="star" size={16} color="#FACC15" />
              <Text className="text-sm font-semibold text-gray-800 ml-1">
                {Number(rating).toFixed(1)}
              </Text>
              <Text className="text-sm text-gray-500 ml-1">
                | {Number(reviews).toLocaleString()} đánh giá
              </Text>
            </View>
          )}
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
                className="py-3 px-6 bg-blue-500 w-2/5 items-center rounded-full"
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
