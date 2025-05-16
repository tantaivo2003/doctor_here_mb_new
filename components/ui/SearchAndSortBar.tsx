import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

type FilterOption = {
  label: string;
  value: string;
};

type Props = {
  searchText: string;
  onSearchChange: (text: string) => void;
  selectedFilters: Set<string>;
  onToggleFilter: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
};

const TIME_FILTERS: FilterOption[] = [
  { label: "Sáng", value: "morning" },
  { label: "Chiều", value: "afternoon" },
  { label: "Tối", value: "evening" },
];

const MODE_FILTERS: FilterOption[] = [
  { label: "Trực tuyến", value: "online" },
  { label: "Trực tiếp", value: "offline" },
];

const SORT_OPTIONS: FilterOption[] = [
  { label: "Mới nhất", value: "latest" },
  { label: "Cũ nhất", value: "oldest" },
];

export default function SearchAndSortBar({
  searchText,
  onSearchChange,
  selectedFilters,
  onToggleFilter,
  sortOption,
  onSortChange,
}: Props) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <View className="p-2 bg-white border-b border-gray-200">
      {/* Search Input + Toggle Filter Button */}
      <View className="flex-row items-center bg-gray-100 px-3 py-2 rounded-md mb-2">
        <Ionicons name="search" size={24} color="gray" />
        <TextInput
          placeholder="Tìm kiếm theo tên bác sĩ, chuyên khoa..."
          value={searchText}
          onChangeText={onSearchChange}
          className="flex-1 text-gray-800 ml-2"
          placeholderTextColor="#888"
        />
        <Pressable
          onPress={() => setShowFilters(!showFilters)}
          className="ml-2"
        >
          <Ionicons
            name={showFilters ? "filter" : "filter-outline"}
            size={18}
            color="gray"
          />
        </Pressable>
      </View>

      {/* Filter Buttons (toggle visibility) */}
      {showFilters && (
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            {[...TIME_FILTERS, ...MODE_FILTERS].map((option) => {
              const isSelected = selectedFilters.has(option.value);
              return (
                <Pressable
                  key={option.value}
                  onPress={() => onToggleFilter(option.value)}
                  className={`px-4 py-2 mr-2 rounded-full border ${
                    isSelected
                      ? "bg-blue-500 border-blue-500"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      isSelected ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {/* Sort Dropdown */}
          <View className="flex-row items-center">
            <Ionicons name="funnel-outline" size={16} color="gray" />
            <Text className="ml-1 mr-2 text-gray-700 text-sm">Sắp xếp:</Text>
            <View className="flex-1 border border-gray-300 rounded-md overflow-hidden">
              <Picker
                selectedValue={sortOption}
                onValueChange={onSortChange}
                mode="dropdown"
              >
                {SORT_OPTIONS.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
