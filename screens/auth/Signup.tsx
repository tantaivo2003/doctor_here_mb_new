import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";

import NotificationModal from "../../components/ui/NotificationModal";

const Signup = ({ navigation }: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(false);
  const [failedReason, setFailedReason] = useState("");
  const handleSignup = () => {
    if (password !== ConfirmPassword) {
      setFailedReason("Mật khẩu không khớp");
      setStatus(true);
      setModalVisible(true);
    } else {
      setStatus(false);
      setModalVisible(true);
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center items-center">
      {/* Logo */}
      <Image source={require("../../assets/logo.png")} className="w-20 h-20" />
      <Text className="text-2xl font-bold mt-4">Doctor Here!</Text>
      <Text className="text-gray-500">Tạo tài khoản</Text>

      {/* Input Fields */}
      <View className="w-full mt-6">
        <View className="flex-row items-center border border-gray-300 p-2 rounded-xl mb-4">
          <FontAwesome name="user" size={20} color="gray" className="ml-3" />
          <TextInput
            className="ml-3 flex-1"
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View className="flex-row items-center border border-gray-300 p-2 rounded-xl mb-4">
          <FontAwesome name="lock" size={20} color="gray" className="ml-3" />
          <TextInput
            className="ml-3 flex-1"
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View className="flex-row items-center border border-gray-300 p-2 rounded-xl">
          <FontAwesome name="lock" size={20} color="gray" className="ml-3" />
          <TextInput
            className="ml-3 flex-1"
            placeholder="Nhập lại mật khẩu"
            value={ConfirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        className="bg-black w-full p-3 rounded-full mt-6"
        onPress={() => handleSignup()}
      >
        <Text className="text-white text-center font-bold">Tạo tài khoản</Text>
      </TouchableOpacity>

      {/* Social Login */}
      <View className="h-[1px] w-full my-8 bg-gray-300" />
      <TouchableOpacity className="border border-gray-300 w-full p-3 rounded-xl flex-row items-center justify-center mb-3">
        <Image
          source={require("../../assets/google.png")}
          className="w-5 h-5 mr-2"
        />
        <Text>Tạo tài khoản với Google</Text>
      </TouchableOpacity>
      <TouchableOpacity className="border border-gray-300 w-full p-3 rounded-xl flex-row items-center justify-center">
        <Image
          source={require("../../assets/facebook.png")}
          className="w-5 h-5 mr-2"
        />
        <Text>Tạo tài khoản với Facebook</Text>
      </TouchableOpacity>

      <View className="mt-3 flex-row items-center">
        <Text>Bạn đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text className="text-blue-500">Hãy đăng nhập</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị modal thông báo */}
      <NotificationModal
        visible={isModalVisible}
        //nếu time là 09:00 AM thì type là error ngược lại
        type={status ? "error" : "success"}
        message={
          status
            ? `Đăng ký thất bại, ${failedReason}`
            : `Bạn đã tạo tài khoản thành công.`
        }
        onClose={() => {
          setModalVisible(false);
          navigation.navigate("CreateProfile");
        }}
      />
    </View>
  );
};

export default Signup;
