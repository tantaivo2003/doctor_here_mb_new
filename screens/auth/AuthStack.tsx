import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login";
import Signup from "./Signup";
import CreateProfile from "./CreateProfile";
import UserProfile from "./UserProfile";
import { isUserLoggedIn } from "../../services/storage"; // Giả sử bạn có hàm này để kiểm tra trạng thái đăng nhập
import { ActivityIndicator, View } from "react-native";

const Stack = createStackNavigator();

const AuthStack = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await isUserLoggedIn();
      setInitialRoute(loggedIn ? "UserProfile" : "Login");
    };
    checkLogin();
  }, []);

  // Loading khi chưa xác định route ban đầu
  if (!initialRoute) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateProfile"
        component={CreateProfile}
        options={{ title: "Tạo hồ sơ ban đầu", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ title: "Hồ sơ của tôi", headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
