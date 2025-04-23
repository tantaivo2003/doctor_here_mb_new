import { createStackNavigator } from "@react-navigation/stack";
import FamilyMembers from "./FamilyMembers";
import MemberDetailNav from "./MemberDetailNav";

const Stack = createStackNavigator();

const FamilyStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FamilyMembers"
      component={FamilyMembers}
      options={{ title: "Thành viên gia đình", headerTitleAlign: "center" }}
    />

    <Stack.Screen
      name="MemberDetailNav"
      component={MemberDetailNav}
      options={{ title: "Chi tiết thành viên", headerTitleAlign: "center" }}
    />
  </Stack.Navigator>
);

export default FamilyStack;
