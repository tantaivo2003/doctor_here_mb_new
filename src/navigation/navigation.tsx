import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/login";
import SignUp from "../screens/signup";
import ProfileCreate from "../screens/profileCreate";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ProfileCreate: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileCreate"
          component={ProfileCreate}
          options={{ title: "Tạo Hồ Sơ", headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
