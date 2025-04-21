import React, { useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Rating } from "../../types/types";
import { StarRatingDisplay } from "react-native-star-rating-widget";

type Props = {
  ratings: Rating[];
};

export default function DoctorRating({ ratings }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!ratings || ratings.length === 0) {
    return (
      <View className="flex items-center justify-center p-4">
        <MaterialIcons name="chat-bubble-outline" size={40} color="gray" />
        <Text className="text-gray-500 text-center mt-2">
          Chưa có nhận xét nào.
        </Text>
      </View>
    );
  }

  const displayedRatings = expanded ? ratings : ratings.slice(0, 3);

  return (
    <View className="mt-10">
      <View className="flex flex-row justify-between items-center mb-5">
        <Text className="text-xl font-bold text-gray-800">
          Nhận xét của người dùng
        </Text>

        {ratings.length > 2 && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text className="text-blue-500">
              {expanded ? "Ẩn bớt" : "Xem tất cả"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayedRatings}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="mb-5">
            <View className="flex-row items-center">
              <Image
                source={
                  item.patient.avatar
                    ? { uri: item.patient.avatar }
                    : require("../../assets/avatar-placeholder.png")
                }
                className="w-16 h-16 rounded-full"
              />
              <View className="ml-4">
                <Text className="text-lg font-bold text-gray-900">
                  {item.patient.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-sm font-semibold text-gray-700">
                    {item.score.toFixed(1)}
                  </Text>
                  <StarRatingDisplay
                    rating={item.score}
                    starSize={24}
                    starStyle={{ marginHorizontal: 1 }}
                  />
                </View>
              </View>
            </View>
            <Text className="text-gray-600 ml-20 mt-1">{item.content}</Text>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}
