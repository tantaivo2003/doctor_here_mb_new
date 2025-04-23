import { useLayoutEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MemberDiagnosisList from "./MemberDiagnosisList";
import MemberMedicineSchedule from "./MemberMedicineSchedule";
const Tab = createMaterialTopTabNavigator();

export default function MemberDetailNav({ navigation, route }: any) {
  const { member } = route.params; // Get the member data from route params
  console.log("MemberDetailNav", member); // Log the member data for debugging

  useLayoutEffect(() => {
    navigation.setOptions({ title: member.ho_va_ten });
  }, [navigation, member.ho_va_ten]);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarIndicatorStyle: { backgroundColor: "#000" },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
      }}
    >
      <Tab.Screen
        name="Kết quả khám bệnh"
        children={() => (
          <MemberDiagnosisList member={member} navigation={navigation} />
        )}
      />
      <Tab.Screen
        name="Lịch uống thuốc"
        children={() => <MemberMedicineSchedule />}
      />
    </Tab.Navigator>
  );
}
