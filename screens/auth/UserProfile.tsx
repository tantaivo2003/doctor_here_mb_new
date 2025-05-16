import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import Modal from "react-native-modal";
import {
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import * as ImagePicker from "react-native-image-picker";
import DateTimePicker, {
  DateType,
  getDefaultStyles,
} from "react-native-ui-datepicker";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt

import { clearAsyncStorage } from "../../services/storage";
const genderOptions = [
  { title: "Nam", icon: "gender-male" },
  { title: "Nữ", icon: "gender-female" },
  { title: "Khác", icon: "gender-transgender" },
];

const UserProfile = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState<DateType>(new Date());
  const [avatar, setAvatar] = useState<string | null>(null);

  const [dayPickerModalVisible, setDayPickerModalVisible] = useState(false);
  // Xử lý chọn ảnh
  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        // setAvatar(response.assets[0].uri);
      }
    });
  };

  const handleSignOut = async () => {
    // Xóa thông tin người dùng khỏi AsyncStorage
    await clearAsyncStorage();
    // Chuyển hướng về trang đăng nhập
    navigation.navigate("Login");
  };

  return (
    <View className="flex-1 bg-white p-6">
      {/* Nút đăng xuất */}
      <TouchableOpacity
        className="bg-gray-900 p-3 rounded-full mt-6"
        onPress={handleSignOut}
      >
        <Text className="text-white text-center font-bold">Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfile;
