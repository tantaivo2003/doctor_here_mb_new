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
      {/* Ảnh đại diện */}
      <View className="items-center mb-6">
        <TouchableOpacity onPress={pickImage} className="relative">
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require("../../assets/avatar-placeholder.png")
            }
            className="w-48 h-48 rounded-full"
          />
          <View className="absolute bottom-1 right-1 bg-gray-200 p-1 rounded-full">
            <FontAwesome name="pencil" size={16} color="black" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Form nhập thông tin */}
      <View className="">
        {/* Nhập họ và tên */}
        <View className="flex-row items-center border border-gray-300 p-3 rounded-lg mb-6">
          <MaterialCommunityIcons
            name="account"
            size={24}
            className="text-gray-600 mr-3"
          />
          <TextInput
            className="flex-1 text-base"
            placeholder="Họ và tên"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Nhập ngày sinh*/}

        <TouchableOpacity
          onPress={() => setDayPickerModalVisible(true)}
          className="flex-row items-center border border-gray-300 px-3 py-6 rounded-lg mb-6"
        >
          <FontAwesome name="calendar" size={24} color="black" />
          <Text className="flex-1 ml-4 text-base text-gray-700">
            {birthdate ? dayjs(birthdate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
          </Text>
        </TouchableOpacity>
        <Modal
          isVisible={dayPickerModalVisible}
          onBackdropPress={() => setDayPickerModalVisible(false)}
        >
          <View className="bg-white p-4 rounded-xl">
            <DateTimePicker
              mode="single"
              date={birthdate}
              onChange={({ date }) => {
                setBirthdate(date);
                setDayPickerModalVisible(false); // đóng modal sau khi chọn
              }}
              maxDate={new Date()}
              locale="vi"
            />
          </View>
        </Modal>

        {/* Nhập địa chỉ */}
        <View className="flex-row items-center border border-gray-300 p-3 rounded-lg mb-6">
          <MaterialCommunityIcons
            name="map-marker"
            size={24}
            className="text-gray-600 mr-3"
          />
          <TextInput
            className="flex-1 text-base"
            placeholder="Địa chỉ"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Nhập số điện thoại */}
        <View className="flex-row items-center border border-gray-300 p-3 rounded-lg mb-6">
          <MaterialCommunityIcons
            name="phone"
            size={24}
            className="text-gray-600 mr-3"
          />
          <TextInput
            className="flex-1 text-base"
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Giới tính */}
        <View>
          <SelectDropdown
            data={genderOptions}
            onSelect={(selectedItem, index) => {
              console.log("Giới tính được chọn:", selectedItem.title);
            }}
            renderButton={(selectedItem, isOpened) => (
              <View className="flex-row items-center border border-gray-300 px-3 py-6 rounded-lg mb-6">
                {selectedItem && (
                  <MaterialCommunityIcons
                    name={selectedItem.icon}
                    size={24}
                    className="mr-3"
                  />
                )}
                <Text className="flex-1 text-base">
                  {(selectedItem && selectedItem.title) || "Chọn giới tính"}
                </Text>
                <MaterialCommunityIcons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  size={24}
                  className="text-gray-600"
                />
              </View>
            )}
            renderItem={(item, index, isSelected) => (
              <View
                className={`w-full flex-row items-center px-4 py-3 ${
                  isSelected ? "bg-gray-200" : "bg-white"
                }`}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  className="mr-3 text-gray-600"
                />
                <Text className="flex-1 text-base font-medium text-gray-700">
                  {item.title}
                </Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            dropdownStyle={{ backgroundColor: "#FFFFFF", borderRadius: 8 }}
          />
        </View>
      </View>
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
