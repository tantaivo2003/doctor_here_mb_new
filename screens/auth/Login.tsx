import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";

import { loginUser } from "../../api/Auth";
import { useAuth } from "../../context/AuthContext";
import NotificationModal from "../../components/ui/NotificationModal";
import LoadingModal from "../../components/ui/LoadingModal";

import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "../../utils/notification";
import { savePushToken } from "../../api/Notification";
import { getUserID } from "../../services/storage";
import Feather from "@expo/vector-icons/Feather";

const Login = ({ navigation }: any) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const [showPassword, setShowPassword] = useState(true);

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const result = await loginUser(username, password);

    if (result.success) {
      if (result.message === "302") {
        navigation.navigate("CreateProfile", { username });
      } else {
        login();

        try {
          const token = await registerForPushNotificationsAsync();
          if (token) {
            setExpoPushToken(token);

            const userID = await getUserID();
            await savePushToken(userID, token);

            console.log("Push token đã lưu thành công!");
          }
        } catch (error) {
          console.error("Lỗi khi lưu push token:", error);
        }
      }
    } else {
      setLoading(false);
      setNotificationMessage(result.message);
      setNotificationType("error");
      setNotificationVisible(true);
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center items-center">
      {/* Logo */}
      <Image source={require("../../assets/logo.png")} className="w-32 h-32" />
      <Text className="text-2xl font-bold mt-4">Doctor Here</Text>
      <Text className="text-gray-500">Mừng bạn trở lại!</Text>

      {/* Input Fields */}
      <View className="w-full mt-6">
        <View className="flex-row items-center border border-gray-300 px-2 py-5 rounded-xl mb-4">
          <FontAwesome name="user" size={20} color="gray" className="ml-3" />
          <TextInput
            className="ml-3 flex-1"
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View className="flex-row items-center border border-gray-300 px-2 py-5 rounded-xl">
          <View className="flex-row items-center">
            <FontAwesome name="lock" size={20} color="gray" className="ml-3" />
            <TextInput
              className="ml-3 flex-1"
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={showPassword}
            />
          </View>
          {/* Show/Hide Password Icon */}
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4"
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
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
