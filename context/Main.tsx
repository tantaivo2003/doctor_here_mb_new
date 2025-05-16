import { useAuth } from "./AuthContext";
import { SafeAreaView, Text, Button, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

//Stream io
import StreamVideoProvider from "../components/streamProvider/StreamVideoProvider";

import Home from "../screens/Home";
import ChatStack from "../screens/chat/ChatStack";
import FamilyStack from "../screens/family/FamilyStack";
import HealthStack from "../screens/HealthMetrics/HealthStack";
import DiagnosisList from "../screens/diagnosisResult/DiagnosisList";
import DiagnosisDetails from "../screens/diagnosisResult/DiagnosisDetail";
import AppointmentScreen from "../screens/appointment/AppointmentScreen";
import AppointmentDetails from "../screens/appointment/AppointmentDetails";
import FindDoctor from "../screens/doctor/FindDoctor";
import FavoriteDoctor from "../screens/FavoriteDoctor";
import OfflineAppointment from "../screens/OfflineAppointment";
import OnlineAppointment from "../screens/OnlineAppointment";
import ConfirmAppointment from "../screens/ConfirmAppointment";

import AuthStack from "../screens/auth/AuthStack";
import UserProfileStack from "../screens/userProfile/UserProfileStack";
import MedicineScheduleScreen from "../screens/medicineSchedule/MedicineSchedule";
import MedicineDetailScreen from "../screens/medicineSchedule/MedicineDetailScreen";
import DiabetesPredictionScreen from "../screens/predict/DiabetesPrediction";

import VideoCallScreen from "../screens/chat/CallScreen";
import {
  HomeIcon,
  MessageIcon,
  AppointmentIcon,
  ProfileIcon,
} from "../components/icons/TabNavIcons";
import DoctorDetail from "../screens/doctor/DoctorDetail";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: "#fff",
      },
      headerTitleAlign: "center",
    }}
  >
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
      name="FavoriteDoctor"
      component={FavoriteDoctor}
      options={{ title: "Bác sĩ yêu thích", headerTitleAlign: "center" }}
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
      name="OfflineAppointment"
      component={OfflineAppointment}
      options={{ title: "Đặt lịch khám", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="OnlineAppointment"
      component={OnlineAppointment}
      options={{ title: "Đặt lịch tư vấn", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="ConfirmAppointment"
      component={ConfirmAppointment}
      options={{ title: "Xác nhận thông tin", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="MedicineSchedule"
      component={MedicineScheduleScreen}
      options={{ title: "Lịch uống thuốc", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="MedicineDetailScreen"
      component={MedicineDetailScreen}
      options={{ title: "Chi tiết đơn thuốc", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="DiagnosisList"
      component={DiagnosisList}
      options={{ title: "Kết quả khám", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="DiagnosisDetails"
      component={DiagnosisDetails}
      options={{
        title: "Chi tiết kết quả khám bệnh",
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="HealthMetricsScreen"
      component={HealthStack}
      options={{
        title: "Chỉ số sức khỏe",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="FamilyStack"
      component={FamilyStack}
      options={{
        title: "Thành viên gia đình",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="DiabetesPredictionScreen"
      component={DiabetesPredictionScreen}
      options={{ title: "Dự đoán tiểu đường", headerTitleAlign: "center" }}
    />
  </Stack.Navigator>
);

const AppointmentStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AppointmentScreen"
      component={AppointmentScreen}
      options={{
        title: "Lịch hẹn của tôi",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="AppointmentDetails"
      component={AppointmentDetails}
      options={{ title: "Chi tiết lịch hẹn", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="VideoCallScreen"
      component={VideoCallScreen}
      options={{
        title: "Cuộc gọi video",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default function Main() {
  const { loggedIn } = useAuth();

  if (loggedIn === undefined) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AuthStack" component={AuthStack} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <StreamVideoProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              switch (route.name) {
                case "HomeStack":
                  return <HomeIcon color={color} width={size} height={size} />;
                case "ChatStack":
                  return (
                    <MessageIcon color={color} width={size} height={size} />
                  );
                case "AppointmentStack":
                  return (
                    <AppointmentIcon color={color} width={size} height={size} />
                  );
                case "UserProfileStack":
                  return (
                    <ProfileIcon color={color} width={size} height={size} />
                  );
                default:
                  return null;
              }
            },
            tabBarActiveTintColor: "#1C1E20",
            tabBarInactiveTintColor: "#9CA3AF",
            // --- Thêm logic để ẩn Tab Bar ---
            tabBarStyle: ((route) => {
              // Lấy tên màn hình đang focus bên trong Stack Navigator (nếu có)
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";
              // Kiểm tra nếu tab hiện tại là 'ChatStack' VÀ màn hình bên trong là 'VideoCallScreen'
              if (
                route.name === "ChatStack" &&
                routeName === "VideoCallScreen"
              ) {
                // Ẩn tab bar
                return { display: "none" };
              }
              // Ngược lại, hiển thị tab bar (hoặc trả về undefined để dùng style mặc định)
              return undefined; // Hoặc { display: 'flex' }
            })(route), // <-- Truyền route vào hàm IIFE (Immediately Invoked Function Expression)
            // --- Kết thúc logic ẩn Tab Bar ---
          })}
        >
          <Tab.Screen
            name="HomeStack"
            component={HomeStack}
            options={{ title: "Trang chủ", headerShown: false }}
          />
          <Tab.Screen
            name="ChatStack"
            component={ChatStack}
            options={{ title: "Tin nhắn", headerShown: false }}
          />
          <Tab.Screen
            name="AppointmentStack"
            component={AppointmentStack}
            options={{
              title: "Lịch hẹn",
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="UserProfileStack"
            component={UserProfileStack}
            options={{ title: "Hồ sơ", headerShown: false }}
          />
        </Tab.Navigator>
      </StreamVideoProvider>
    </NavigationContainer>
  );
}
