import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/navigation";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";

export default function ProfileCreate() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGender, setSelectedGender] = useState(null);
  const genderOptions = [
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
  ];

  const showDatePicker = () => {
    console.log("showDatePicker");
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    console.log("hideDatePicker");
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    setSelectedDate(selectedDate); // Format ngày tháng
    hideDatePicker();
  };

  const handleCancel = () => {
    hideDatePicker();
  };

  return (
    <View style={styles.scrWrapper}>
      <View style={styles.avatarWrapper}>
        <TouchableOpacity
          onPress={() => {
            alert("Chọn ảnh");
          }}
        >
          <Image
            style={styles.avatar}
            source={require("../../assets/icon/profile_circle.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput style={styles.input} placeholder="Họ và tên" />
        <TextInput style={styles.input} placeholder="Địa chỉ liên hệ" />
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="Số điện thoại"
        />
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email"
        />
        <Dropdown
          placeholder="Giới tính"
          data={genderOptions}
          value={selectedGender}
          onChange={(item) => setSelectedGender(item.value)}
          labelField={"label"}
          valueField={"value"}
          style={styles.input}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          date={selectedDate}
          isDarkModeEnabled={false}
          textColor="#000"
        />
        <TouchableOpacity onPress={showDatePicker}>
          <Text style={styles.input}>
            {selectedDate
              ? selectedDate.toLocaleDateString("vi-VN")
              : "Ngày sinh"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          alert("Lưu thành công");
        }}
      >
        <Text style={styles.btnText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  scrWrapper: {
    backgroundColor: "#fff",
    color: "#111928",
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
  },
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 50,
  },
  inputWrapper: {
    marginTop: 30,
  },
  input: {
    height: 40,
    margin: 13,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: "#D1D5DB",
  },
  btn: {
    backgroundColor: "#1C2A3A",
    borderRadius: 55,
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
});
