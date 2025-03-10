import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function BaseComponents() {
  const [text, setText] = useState("");
  const notes = [
    { id: 1, title: "Title 1", content: "Content 1", time: "Time 1" },
    { id: 2, title: "Title 2", content: "Content 2", time: "Time 2" },
    { id: 3, title: "Title 3", content: "Content 3", time: "Time 3" },
  ];

  const colors = [
    "bg-red-500",
    "bg-red-300",
    "bg-red-100",
    "bg-red-700",
    "bg-green-500",
    "bg-blue-500",
    "bg-blue-300",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-white",
  ];
  const numbers = Array.from({ length: 20 }, (_, i) => i + 1); // Tạo danh sách số

  return (
    <View className="flex-1 bg-gray-200">
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="items-center justify-center p-4"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Text key={i} className="text-2xl font-bold text-blue-500 mb-4">
            Hello, NativeWind!
          </Text>
        ))}

        <Image
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
          className="w-24 h-24 m-5 rounded-full"
        />

        <TextInput
          className="border border-gray-400 px-4 py-2 rounded-lg w-64"
          placeholder="Nhập tên của bạn"
          value={text}
          onChangeText={setText}
        />
      </ScrollView> */}

      {/* Đặt FlatList ngoài ScrollView */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{}}
        renderItem={({ item }) => (
          <TouchableOpacity className="mb-10 ml-5 bg-gray-500">
            <Text className="text-lg text-green-500">{item.title}</Text>
            <Text className="text-lg text-green-500">{item.content}</Text>
          </TouchableOpacity>
        )}
      />
      <FlatList
        data={colors}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity className={`p-4 ${item} mb-4`}>
            <Text className="text-white">{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
