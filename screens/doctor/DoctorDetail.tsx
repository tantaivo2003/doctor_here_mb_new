import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import DoctorCard from "../../components/ui/DoctorCard";
import { getDoctorRatings } from "../../api/Rating";
import { Rating } from "../../types/types";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import DoctorRating from "./DoctorRating";
import { getConversationByDoctorAndPatient } from "../../api/Message";
import { getUserID } from "../../services/storage";
import Toast from "react-native-toast-message";

import LoadingAnimation from "../../components/ui/LoadingAnimation";
export default function DoctorDetail({ navigation, route }: any) {
  const { doctor } = route.params;
  const [ratings, setRatings] = useState<Rating[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchRatings = async () => {
      const doctorId = doctor.id;
      const ratings = await getDoctorRatings(doctorId);
      setRatings(ratings);
      setIsLoading(false);
      console.log(doctor);
    };

    fetchRatings();
  }, [doctor.id]);

  const handleSendMessage = async () => {
    const userId = await getUserID();
    const doctorID = doctor.id;
    if (!userId) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng đăng nhập để sử dụng tính năng này.",
      });

      return;
    }
    const conversation = await getConversationByDoctorAndPatient(
      doctorID,
      userId
    );
    console.log("conversation", conversation);

    navigation.navigate("ChatStack", {
      screen: "ChatDetailScreen",
      params: {
        convID: conversation ? conversation.id : null,
        doctorID: doctorID,
        doctorName: doctor.name,
        doctorAvtUrl: doctor.image,
      },
    });
  };
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 150 }}
        className="p-4"
        showsVerticalScrollIndicator={false}
      >
        <DoctorCard {...doctor} />

        <View className="flex-row justify-between p-4">
          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <FontAwesome5 name="award" size={20} color="#374151" />
            </View>
            <Text className="text-lg font-bold text-gray-800 mt-1">
              {doctor.experience}
            </Text>
            <Text className="text-sm text-gray-500">kinh nghiệm</Text>
          </View>

          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <FontAwesome5 name="star" size={20} color="#374151" />
            </View>
            <Text className="text-lg font-bold text-gray-800 mt-1">
              {typeof doctor.rating === "string"
                ? parseFloat(doctor.rating).toFixed(1)
                : typeof doctor.rating === "number"
                ? doctor.rating.toFixed(1)
                : doctor.rating}
            </Text>
            <Text className="text-sm text-gray-500">đánh giá</Text>
          </View>

          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <MaterialIcons
                name="chat-bubble-outline"
                size={20}
                color="#374151"
              />
            </View>
            <Text className="text-lg font-bold text-gray-800 mt-1">
              {doctor.reviews}
            </Text>
            <Text className="text-sm text-gray-500">nhận xét</Text>
          </View>
        </View>

        <Text className="text-xl font-bold text-gray-800 my-5">Về bác sĩ</Text>
        <Text className="text-gray-600">{doctor.description}</Text>

        {/* Nhận xét của người dùng */}
        {isLoading ? <LoadingAnimation /> : <DoctorRating ratings={ratings} />}
      </ScrollView>

      {/* Thanh nút cố định */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
        <TouchableOpacity
          className="bg-teal-500 py-3 rounded-full items-center mb-2"
          onPress={handleSendMessage}
        >
          <Text className="text-white font-semibold">Nhắn tin với bác sĩ</Text>
        </TouchableOpacity>

        <View className="flex-row justify-between">
          <TouchableOpacity
            className="flex-1 bg-blue-500 py-3 rounded-full items-center mr-2"
            onPress={() => navigation.navigate("OnlineAppointment", { doctor })}
          >
            <Text className="text-white font-semibold">
              Đặt lịch tư vấn trực tuyến
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-blue-500 py-3 rounded-full items-center"
            onPress={() =>
              navigation.navigate("OfflineAppointment", { doctor })
            }
          >
            <Text className="text-white font-semibold">
              Đặt lịch khám trực tiếp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
