import "./global.css";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, Text, Button, StatusBar } from "react-native";

import Home from "./components/screens/Home";
import DetailsScreen from "./components/screens/DetailsScreen";
import MessageScreen from "./components/screens/MessageScreen";
import AppointmentScreen from "./components/screens/appointment/AppointmentScreen";
import FindDoctor from "./components/screens/FindDoctor";
import DoctorAppointment from "./components/screens/DoctorAppointment";
import ConfirmAppointment from "./components/screens/ConfirmAppointment";
import {
  HomeIcon,
  MessageIcon,
  AppointmentIcon,
  ProfileIcon,
} from "./components/icons/TabNavIcons";
import DoctorDetail from "./components/screens/DoctorDetail";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileScreen = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <Text>👤 Profile</Text>
  </SafeAreaView>
);

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="FindDoctorScreen"
      component={FindDoctor}
      options={{
        title: "Tìm kiếm bác sĩ",
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="DoctorDetail"
      component={DoctorDetail}
      options={({ route }) => ({
        title: "Thông tin chi tiết",
        headerTitleAlign: "center",
      })}
    />
    <Stack.Screen
      name="DoctorAppointment"
      component={DoctorAppointment}
      options={{ title: "Đặt lịch khám", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="ConfirmAppointment"
      component={ConfirmAppointment}
      options={{ title: "Xác nhận thông tin", headerTitleAlign: "center" }}
    />
  </Stack.Navigator>
);

const AppointmentStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AppointmentScreen"
      component={AppointmentScreen}
      options={{ title: "Lịch hẹn của tôi", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="DoctorDetail"
      component={DoctorDetail}
      options={({ route }) => ({
        title: "Thông tin chi tiết",
        headerTitleAlign: "center",
      })}
    />
    <Stack.Screen
      name="DoctorAppointment"
      component={DoctorAppointment}
      options={{ title: "Đặt lịch khám", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="ConfirmAppointment"
      component={ConfirmAppointment}
      options={{ title: "Xác nhận thông tin", headerTitleAlign: "center" }}
    />
  </Stack.Navigator>
);
export default function App() {
  return (
    <>
      <StatusBar barStyle="default" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              switch (route.name) {
                case "HomeStack":
                  return <HomeIcon color={color} width={size} height={size} />;
                case "Messages":
                  return (
                    <MessageIcon color={color} width={size} height={size} />
                  );
                case "AppointmentStack":
                  return (
                    <AppointmentIcon color={color} width={size} height={size} />
                  );
                case "Profile":
                  return (
                    <ProfileIcon color={color} width={size} height={size} />
                  );
                default:
                  return null;
              }
            },
            tabBarActiveTintColor: "#1C1E20",
            tabBarInactiveTintColor: "#9CA3AF",
          })}
        >
          <Tab.Screen
            name="HomeStack"
            component={HomeStack}
            options={{ title: "Home", headerShown: false }}
          />
          <Tab.Screen name="Messages" component={MessageScreen} />
          <Tab.Screen
            name="AppointmentStack"
            component={AppointmentStack}
            options={{
              title: "Appointment",
              headerShown: false,
            }}
          />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
