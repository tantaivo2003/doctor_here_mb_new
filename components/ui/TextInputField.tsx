import React from "react";
import { View, TextInput, Text, TextInputProps } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface InputFieldProps extends TextInputProps {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label?: string;
}

export default function TextInputField({
  iconName,
  label,
  ...props
}: InputFieldProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-1 text-gray-700 font-bold text-lg">{label}</Text>
      )}
      <View className="flex-row items-center border border-gray-300 p-3 rounded-xl bg-white">
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color="#4B5563" // text-gray-600
          style={{ marginRight: 12 }}
        />
        <TextInput
          {...props}
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9CA3AF" // placeholder-gray-400
        />
      </View>
    </View>
  );
}
