import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Doctor } from "../types/types";
import DoctorCard from "../components/ui/DoctorCard";

export default function FavoriteDoctor({ navigation, route }: any) {
  const { doctors } = route.params as { doctors: Doctor[] };
  const handleDoctorPress = (doctor: any) => {
    navigation.navigate("DoctorDetail", { doctor });
  };
  return (
    <ScrollView
      className="flex-1 bg-white p-4"
      showsVerticalScrollIndicator={false}
    >
      {doctors.map((doctor, index) => (
        <View key={index} className="mb-3">
          <DoctorCard {...doctor} onPress={() => handleDoctorPress(doctor)} />
        </View>
      ))}
    </ScrollView>
  );
}
