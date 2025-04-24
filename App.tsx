// import "./global.css";
// import React, { useState, useEffect } from "react";

// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import { SafeAreaView, Text, Button, StatusBar } from "react-native";
// import Toast from "react-native-toast-message";
// import { toastConfig } from "./components/ui/toastConfig";
// import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// import Home from "./screens/Home";
// import ChatStack from "./screens/chat/ChatStack";
// import FamilyStack from "./screens/family/FamilyStack";
// import HealthMetricsScreen from "./screens/HealthMetrics/HealthMetricsScreen";
// import DiagnosisList from "./screens/diagnosisResult/DiagnosisList";
// import DiagnosisDetails from "./screens/diagnosisResult/DiagnosisDetail";
// import AppointmentScreen from "./screens/appointment/AppointmentScreen";
// import AppointmentDetails from "./screens/appointment/AppointmentDetails";
// import FindDoctor from "./screens/doctor/FindDoctor";
// import FavoriteDoctor from "./screens/FavoriteDoctor";
// import OfflineAppointment from "./screens/OfflineAppointment";
// import OnlineAppointment from "./screens/OnlineAppointment";
// import ConfirmAppointment from "./screens/ConfirmAppointment";

// import AuthStack from "./screens/auth/AuthStack";
// import UserProfileStack from "./screens/userProfile/UserProfileStack";
// import MedicineScheduleScreen from "./screens/medicineSchedule/MedicineSchedule";
// import {
//   HomeIcon,
//   MessageIcon,
//   AppointmentIcon,
//   ProfileIcon,
// } from "./components/icons/TabNavIcons";
// import DoctorDetail from "./screens/doctor/DoctorDetail";
// import { getUserID } from "./services/storage";
// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();
// const ProfileScreen = () => (
//   <SafeAreaView style={{ flex: 1 }}>
//     <Text>👤 Profile</Text>
//   </SafeAreaView>
// );

// const HomeStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="Home"
//       component={Home}
//       options={{ headerShown: false }}
//     />
//     <Stack.Screen
//       name="FindDoctorScreen"
//       component={FindDoctor}
//       options={{
//         title: "Tìm kiếm bác sĩ",
//         headerTitleAlign: "center",
//       }}
//     />
//     <Stack.Screen
//       name="FavoriteDoctor"
//       component={FavoriteDoctor}
//       options={{ title: "Bác sĩ yêu thích", headerTitleAlign: "center" }}
//     />
//     <Stack.Screen
//       name="DoctorDetail"
//       component={DoctorDetail}
//       options={({ route }) => ({
//         title: "Thông tin chi tiết",
//         headerTitleAlign: "center",
//       })}
//     />
//     <Stack.Screen
//       name="OfflineAppointment"
//       component={OfflineAppointment}
//       options={{ title: "Đặt lịch khám", headerTitleAlign: "center" }}
//     />
//     <Stack.Screen
//       name="OnlineAppointment"
//       component={OnlineAppointment}
//       options={{ title: "Đặt lịch tư vấn", headerTitleAlign: "center" }}
//     />
//     <Stack.Screen
//       name="ConfirmAppointment"
//       component={ConfirmAppointment}
//       options={{ title: "Xác nhận thông tin", headerTitleAlign: "center" }}
//     />
//     <Stack.Screen
//       name="MedicineSchedule"
//       component={MedicineScheduleScreen}
//       options={{ title: "Lịch uống thuốc", headerTitleAlign: "center" }}
//     />
//     <Stack.Screen
//       name="DiagnosisList"
//       component={DiagnosisList}
//       options={{ title: "Kết quả khám", headerTitleAlign: "center" }}
//     />
//     <Stack.Screen
//       name="DiagnosisDetails"
//       component={DiagnosisDetails}
//       options={{
//         title: "Chi tiết kết quả khám bệnh",
//         headerTitleAlign: "center",
//       }}
//     />
//     <Stack.Screen
//       name="HealthMetricsScreen"
//       component={HealthMetricsScreen}
//       options={{
//         title: "Chỉ số sức khỏe",
//         headerTitleAlign: "center",
//       }}
//     />
//     <Stack.Screen
//       name="FamilyStack"
//       component={FamilyStack}
//       options={{
//         title: "Thành viên gia đình",
//         headerTitleAlign: "center",
//         headerShown: false,
//       }}
//     />
//   </Stack.Navigator>
// );

// const AppointmentStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="AppointmentScreen"
//       component={AppointmentScreen}
//       options={{
//         title: "Lịch hẹn của tôi",
//         headerTitleAlign: "center",
//         headerShown: false,
//       }}
//     />
//     <Stack.Screen
//       name="AppointmentDetails"
//       component={AppointmentDetails}
//       options={{ title: "Chi tiết lịch hẹn", headerTitleAlign: "center" }}
//     />
//   </Stack.Navigator>
// );

// export default function App() {
//   return (
//     <>
//       <StatusBar barStyle="default" />
//       <NavigationContainer>
//         <Tab.Navigator
//           screenOptions={({ route }) => ({
//             tabBarIcon: ({ color, size }) => {
//               switch (route.name) {
//                 case "HomeStack":
//                   return <HomeIcon color={color} width={size} height={size} />;
//                 case "ChatStack":
//                   return (
//                     <MessageIcon color={color} width={size} height={size} />
//                   );
//                 case "AppointmentStack":
//                   return (
//                     <AppointmentIcon color={color} width={size} height={size} />
//                   );
//                 case "UserProfileStack":
//                   return (
//                     <ProfileIcon color={color} width={size} height={size} />
//                   );
//                 default:
//                   return null;
//               }
//             },
//             tabBarActiveTintColor: "#1C1E20",
//             tabBarInactiveTintColor: "#9CA3AF",
//             // --- Thêm logic để ẩn Tab Bar ---
//             tabBarStyle: ((route) => {
//               // Lấy tên màn hình đang focus bên trong Stack Navigator (nếu có)
//               const routeName = getFocusedRouteNameFromRoute(route) ?? "";
//               // Kiểm tra nếu tab hiện tại là 'ChatStack' VÀ màn hình bên trong là 'VideoCallScreen'
//               if (
//                 route.name === "ChatStack" &&
//                 routeName === "VideoCallScreen"
//               ) {
//                 // Ẩn tab bar
//                 return { display: "none" };
//               }
//               // Ngược lại, hiển thị tab bar (hoặc trả về undefined để dùng style mặc định)
//               return undefined; // Hoặc { display: 'flex' }
//             })(route), // <-- Truyền route vào hàm IIFE (Immediately Invoked Function Expression)
//             // --- Kết thúc logic ẩn Tab Bar ---
//           })}
//         >
//           <Tab.Screen
//             name="HomeStack"
//             component={HomeStack}
//             options={{ title: "Trang chủ", headerShown: false }}
//           />
//           <Tab.Screen
//             name="ChatStack"
//             component={ChatStack}
//             options={{ title: "Tin nhắn", headerShown: false }}
//           />
//           <Tab.Screen
//             name="AppointmentStack"
//             component={AppointmentStack}
//             options={{
//               title: "Lịch hẹn",
//               headerShown: false,
//             }}
//           />
//           <Tab.Screen
//             name="AuthStack"
//             component={AuthStack}
//             options={{ title: "Hồ sơ", headerShown: false }}
//           />
//           <Tab.Screen
//             name="UserProfileStack"
//             component={UserProfileStack}
//             options={{ title: "Hồ sơ", headerShown: false }}
//           />
//         </Tab.Navigator>
//       </NavigationContainer>
//       <Toast config={toastConfig} />
//     </>
//   );
// }
import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { HomeScreen } from "./screens/stream/HomeScreen";
import { CallScreen } from "./screens/stream/CallScreen";
import {
  DeepPartial,
  StreamVideo,
  StreamVideoClient,
  Theme,
} from "@stream-io/video-react-native-sdk";

const apiKey = "mmhfdzb5evj2";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0t5bGVfS2F0YXJuIiwidXNlcl9pZCI6Ikt5bGVfS2F0YXJuIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3NDU0ODU3OTMsImV4cCI6MTc0NjA5MDU5M30.v9Ws5lqfSd9SdSiNPIs4UtALTa8HdH7QPsxVnRARQTs";
const userId = "Kyle_Katarn";
const callId = "QPXKzmyqPGnw";

const user = {
  id: userId,
  name: "John Malkovich",
  image: "https://robohash.org/John",
};
const client = new StreamVideoClient({ apiKey, user, token });

const theme = useMemo(
  () =>
    ({
      callControlsButton: {
        container: {
          borderRadius: 10,
        },
      },
      hangupCallButton: {
        container: {
          backgroundColor: "blue",
        },
      },
      toggleAudioPublishingButton: {
        container: {
          backgroundColor: "green",
        },
      },
    } as DeepPartial<Theme>),
  []
);

export default function App() {
  const [activeScreen, setActiveScreen] = useState("home");
  const goToCallScreen = () => setActiveScreen("call-screen");
  const goToHomeScreen = () => setActiveScreen("home");

  return (
    <StreamVideo client={client} style={theme}>
      <SafeAreaView style={styles.container}>
        {activeScreen === "call-screen" ? (
          <CallScreen goToHomeScreen={goToHomeScreen} callId={callId} />
        ) : (
          <HomeScreen goToCallScreen={goToCallScreen} />
        )}
      </SafeAreaView>
    </StreamVideo>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
