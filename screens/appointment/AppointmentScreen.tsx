import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UpcomingAppointments from "./UpcomingAppointments";
import CompletedAppointments from "./CompletedAppointments";
import CanceledAppointments from "./CanceledAppointments";

const Tab = createMaterialTopTabNavigator();

export default function AppointmentScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarIndicatorStyle: { backgroundColor: "#000" },
      }}
    >
      <Tab.Screen name="Sắp diễn ra" component={UpcomingAppointments} />
      <Tab.Screen name="Hoàn thành" component={CompletedAppointments} />
      <Tab.Screen name="Đã hủy" component={CanceledAppointments} />
    </Tab.Navigator>
  );
}
