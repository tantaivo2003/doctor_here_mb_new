import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useState } from "react";
import Modal from "react-native-modal";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt
import { getUsername, clearAsyncStorage } from "../../services/storage";

import NotificationModal from "../../components/ui/NotificationModal";
import { pickImageFromLibrary } from "../../utils/imagePicker";

import { createPatientProfile, uploadAvatar } from "../../api/Patient";
import { set } from "date-fns";

const genderOptions = [
  { title: "Nam", icon: "gender-male" },
  { title: "Nữ", icon: "gender-female" },
  { title: "Khác", icon: "gender-transgender" },
];

const CreateProfile = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState<DateType>(new Date());
  const [avatar, setAvatar] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("");

  const [isModalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(false); // true là thất bại, false là thành công
  const [failedReason, setFailedReason] = useState("");

  const [dayPickerModalVisible, setDayPickerModalVisible] = useState(false);
  // Xử lý chọn ảnh
  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) {
      setAvatar(uri);
    }
  };

  const validateForm = (): string | null => {
    if (!name.trim()) return "Vui lòng nhập họ và tên.";
    if (!birthdate) return "Vui lòng chọn ngày sinh.";
    if (!address.trim()) return "Vui lòng nhập địa chỉ.";
    if (!phone.trim()) return "Vui lòng nhập số điện thoại.";
    if (!/^\d{10}$/.test(phone))
      return "Số điện thoại không hợp lệ (10 chữ số).";
    if (!gender) return "Vui lòng chọn giới tính.";

    return null; // Không có lỗi
  };

  const handleSave = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      setFailedReason(errorMessage);
      setStatus(true); // lỗi
      setModalVisible(true);
      return;
    }
    try {
      const username = await getUsername();
      //Gọi API tạo hồ sơ
      // Kiểm tra xem username có tồn tại không
      if (!username) {
        setFailedReason("Không tìm thấy tên người dùng. Hãy đăng nhập lại.");
        setStatus(true); // lỗi
        setModalVisible(true);
        return;
      }

      // Upload ảnh đại diện
      let avatarURL = null;
      if (avatar) {
        const fileType = avatar.split(".").pop();
        const fileName = `${username}.${fileType}`; // Đặt tên file theo username
        const uploadResult = await uploadAvatar(avatar, fileName);
        avatarURL = uploadResult[0].url;
      }

      const profile = await createPatientProfile({
        username,
        fullname: name,
        address,
        phone,
        birthday: dayjs(birthdate).format("YYYY/MM/DD"), // chuyển sang 'YYYY-MM-DD'
        gender,
        avt_url: avatarURL,
      });

      // Hiển thị modal thành công
      setStatus(false); // không phải lỗi
      console.log("Hồ sơ đã được tạo:", profile);
      setModalVisible(true);
    } catch (error: any) {
      console.error("Lỗi khi lưu hồ sơ, hãy đăng nhập lại");
      setFailedReason(error.message);
      setStatus(true); // lỗi
      setModalVisible(true);
    }
  };

  const handleSignOut = async () => {
    await clearAsyncStorage(); // Xóa thông tin người dùng khỏi AsyncStorage
    navigation.navigate("Login");
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
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
              setGender(selectedItem.title);
            }}
            renderButton={(selectedItem, isOpened) => (
              <View className="flex-row items-center border border-gray-300 px-3 py-6 rounded-lg mb-6">
                {selectedItem ? (
                  <MaterialCommunityIcons
                    name={selectedItem.icon}
                    size={24}
                    className="mr-3"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={"gender-transgender"}
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

      {/* Nút Lưu */}
      <View className="flex-row justify-between gap-3">
        {/* Nút đăng xuất*/}
        <TouchableOpacity
          className="bg-gray-900 p-3 w-1/2 rounded-full mt-6"
          onPress={handleSignOut}
        >
          <Text className="text-white text-center font-bold">Đăng xuất</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 p-3 w-1/2 rounded-full mt-6"
          onPress={handleSave}
        >
          <Text className="text-white text-center font-bold">Lưu</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị modal thông báo */}
      <NotificationModal
        visible={isModalVisible}
        //nếu time là 09:00 AM thì type là error ngược lại
        type={status ? "error" : "success"}
        message={
          status
            ? `${failedReason}`
            : `Thông tin của bạn đã được lưu thành công. Hãy đăng nhập lại.`
        }
        onClose={() => {
          setModalVisible(false);
          navigation.navigate("Login");
        }}
      />
    </ScrollView>
  );
};

export default CreateProfile;
