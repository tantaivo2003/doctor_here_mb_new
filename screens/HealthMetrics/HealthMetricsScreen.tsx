import React, { useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BMIScreen from "./BMIScreen";
import BloodPressureScreen from "./BloodPressureScreen";
import HeartRateScreen from "./HeartRateScreen";
import ActivityScreen from "./ActivityScreen";
import { Ionicons } from "@expo/vector-icons";

import { initializeHealthConnect } from "../../services/healthConnect/healthConnect";
import {
  requestMyAppPermissions,
  checkAndRequestPermissions,
} from "../../services/healthConnect/healthConnectPermissions";

import { permissionsToRequest } from "../../services/healthConnect/permissions";

const Tab = createMaterialTopTabNavigator();

const HealthMetricsScreen = ({ navigation }: any) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarIndicatorStyle: { backgroundColor: "#000" },
        tabBarLabelStyle: { fontSize: 13, fontWeight: "bold" },
      }}
    >
      <Tab.Screen name="BMI" component={BMIScreen} />
      <Tab.Screen name="Huyết áp" component={BloodPressureScreen} />
      <Tab.Screen name="Nhịp tim" component={HeartRateScreen} />
      <Tab.Screen name="Hoạt động" component={ActivityScreen} />
    </Tab.Navigator>
  );
};

export default HealthMetricsScreen;
