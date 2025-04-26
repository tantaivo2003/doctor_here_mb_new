import React from "react";
import { View, Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type SelectOption = {
  title: string;
  icon?: string; // Optional, có thể không có
};

type SelectFieldProps = {
  label?: string;
  data: SelectOption[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export default function SelectField({
  data,
  value,
  label,
  placeholder = "Chọn một mục",
  onChange,
}: SelectFieldProps) {
  const selected = data.find((item) => item.title === value);

  return (
    <View>
      {label && (
        <Text className="mb-1 text-gray-700 font-bold text-lg">{label}</Text>
      )}
      <SelectDropdown
        data={data}
        onSelect={(item) => onChange(item.title)}
        defaultValue={selected}
        renderButton={(selectedItem, isOpened) => (
          <View className="flex-row items-center border border-gray-300 px-4 py-3 rounded-lg">
            {selectedItem?.icon ? (
              <MaterialCommunityIcons
                name={selectedItem.icon}
                size={24}
                className="mr-3"
              />
            ) : (
              <MaterialCommunityIcons
                name="menu"
                size={24}
                className="mr-3 text-gray-500"
              />
            )}
            <Text className="flex-1 text-base text-gray-700">
              {selectedItem?.title || placeholder}
            </Text>
            <MaterialCommunityIcons
              name={isOpened ? "chevron-up" : "chevron-down"}
              size={24}
              className="text-gray-600"
            />
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View
            className={`w-full flex-row items-center px-4 py-3 ${
              isSelected ? "bg-gray-200" : "bg-white"
            }`}
          >
            {item.icon && (
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                className="mr-3 text-gray-600"
              />
            )}
            <Text className="flex-1 text-base font-medium text-gray-700">
              {item.title}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        dropdownStyle={{ backgroundColor: "#FFFFFF", borderRadius: 8 }}
      />
    </View>
  );
}
