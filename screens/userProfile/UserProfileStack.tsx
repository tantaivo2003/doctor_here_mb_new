import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./ProfileScreen";
import PersonalInfoScreen from "./PersonalInfo";
import HealthInsurance from "./HealthInsurance";
import SettingsScreen from "./Settings";
const Stack = createStackNavigator();

const UserProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "Hồ sơ", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfoScreen}
        options={{ title: "Thông tin cá nhân" }}
      />
      <Stack.Screen
        name="HealthInsurance"
        component={HealthInsurance}
        options={{ title: "Thông tin y tế" }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      {/*
      <Stack.Screen name="TopUpPoints" component={TopUpPoints} />
   
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} /> */}
    </Stack.Navigator>
  );
};

export default UserProfileStack;
