import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HealthMetricsScreen from "./HealthMetricsScreen";
import BMIScreen from "./BMIScreen";
import BloodPressureScreen from "./BloodPressureScreen";
import HeartRateScreen from "./HeartRateScreen";
import BloodGlucoseOxygenScreen from "./BloodGlucoseOxygen";
import ActivityScreen from "./ActivityScreen";

const Stack = createNativeStackNavigator();

export default function HealthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HealthMetricsScreen"
        component={HealthMetricsScreen}
        options={{
          title: "Chỉ số sức khỏe",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="BMIScreen"
        component={BMIScreen}
        options={{ title: "Chỉ số BMI", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="BloodPressureScreen"
        component={BloodPressureScreen}
        options={{ title: "Huyết áp", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="HeartRateScreen"
        component={HeartRateScreen}
        options={{ title: "Nhịp tim", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="BloodGlucoseOxygenScreen"
        component={BloodGlucoseOxygenScreen}
        options={{ title: "Đường huyết", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="ActivityScreen"
        component={ActivityScreen}
        options={{ title: "Hoạt động", headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
}
