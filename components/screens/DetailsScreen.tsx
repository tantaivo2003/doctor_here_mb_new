import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";

// Màn hình Details
export default function DetailsScreen({ navigation, route }: any) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>📄 Details</Text>
    </SafeAreaView>
  );
}
