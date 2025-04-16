import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";

import { loginUser } from "../../api/Auth";
import NotificationModal from "../../components/ui/NotificationModal";
import LoadingModal from "../../components/ui/LoadingModal";
const Login = ({ navigation }: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const result = await loginUser(username, password);

    if (result.success) {
      // Kiểm tra nếu có mã 302 từ server
      if (result.message === "302") {
        // Chuyển hướng đến trang tạo hồ sơ mới
        navigation.navigate("CreateProfile", { username });
      } else {
        // Đăng nhập thành công, chuyển hướng đến trang chính
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeStack" }],
        });
      }
    } else {
      // Hiển thị thông báo lỗi nếu đăng nhập thất bại
      setNotificationMessage(result.message);
      setNotificationType("error");
      setNotificationVisible(true);
    }
  };
  return (
    <View className="flex-1 bg-white p-6 justify-center items-center">
      {/* Logo */}
      <Image source={require("../../assets/logo.png")} className="w-20 h-20" />
      <Text className="text-2xl font-bold mt-4">Doctor Here!</Text>
      <Text className="text-gray-500">Mừng bạn trở lại!</Text>

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
        <View className="flex-row items-center border border-gray-300 p-2 rounded-xl">
          <FontAwesome name="lock" size={20} color="gray" className="ml-3" />
          <TextInput
            className="ml-3 flex-1"
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        className="bg-black w-full p-3 rounded-full mt-6"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-bold">Đăng nhập</Text>
      </TouchableOpacity>

      {/* Social Login */}
      <View className="h-[1px] w-full my-8 bg-gray-300" />
      {/* <TouchableOpacity className="border border-gray-300 w-full p-3 rounded-xl flex-row items-center justify-center mb-3">
        <Image
          source={require("../../assets/google.png")}
          className="w-5 h-5 mr-2"
        />
        <Text>Đăng nhập bằng Google</Text>
      </TouchableOpacity>
      <TouchableOpacity className="border border-gray-300 w-full p-3 rounded-xl flex-row items-center justify-center">
        <Image
          source={require("../../assets/facebook.png")}
          className="w-5 h-5 mr-2"
        />
        <Text>Đăng nhập bằng Facebook</Text>
      </TouchableOpacity> */}

      {/* Forgot Password & Register */}
      <TouchableOpacity className="mt-4">
        <Text className="text-blue-500">Quên mật khẩu?</Text>
      </TouchableOpacity>
      <View className="mt-2 flex-row items-center">
        <Text>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text className="text-blue-500">Hãy đăng ký</Text>
        </TouchableOpacity>
      </View>
      {/* Notification Modal */}
      <NotificationModal
        visible={notificationVisible}
        type={notificationType}
        message={notificationMessage}
        onClose={() => setNotificationVisible(false)}
      />

      {/* Loading Modal */}
      {loading && <LoadingModal />}

      {/* Footer */}
    </View>
  );
};

export default Login;
