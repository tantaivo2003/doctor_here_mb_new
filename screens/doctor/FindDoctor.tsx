import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  View,
  Pressable,
  TextInput as RNTextInput,
} from "react-native";
import Fuse from "fuse.js";

import ShortcutButton from "../../components/ui/ShortCutButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import SearchIcon from "../../components/icons/SearchIcon";
import DoctorCard from "../../components/ui/DoctorCard";
import LoadingAnimation from "../../components/ui/LoadingAnimation";

import { getAllDoctors } from "../../api/Doctor";
import { Doctor } from "../../types/types";

import { Picker } from "@react-native-picker/picker";

export default function FindDoctor({ navigation, route }: any) {
  const { parseSearchTerm } = route.params;
  const [searchTerm, setSearchTerm] = useState(parseSearchTerm);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef<RNTextInput>(null);
  const [fuse, setFuse] = useState<Fuse<Doctor> | null>(null);
  const [sortOption, setSortOption] = useState<string>("default");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      const doctors = await getAllDoctors();
      setDoctors(doctors);
      setLoading(false);
    };
    fetchDoctors();

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (doctors && doctors.length > 0) {
      const options = {
        keys: ["name", "specialty", "hospital"],
        threshold: 0.3,
      };
      const fuseInstance = new Fuse(doctors, options);
      setFuse(fuseInstance);
    }
  }, [doctors]);

  useEffect(() => {
    if (fuse) {
      let results =
        searchTerm.trim() === ""
          ? doctors
          : fuse.search(searchTerm).map((r) => r.item);
      results = sortDoctors(results, sortOption);
      setFilteredDoctors(results);
    } else {
      setFilteredDoctors(sortDoctors(doctors, sortOption));
    }
  }, [searchTerm, fuse, doctors, sortOption]);

  const handleDoctorPress = (doctor: Doctor) => {
    navigation.navigate("DoctorDetail", { doctor });
  };

  const sortDoctors = (list: Doctor[], option: string) => {
    const sorted = [...list];
    switch (option) {
      case "rating_desc":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "rating_asc":
        return sorted.sort((a, b) => a.rating - b.rating);
      case "name_asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "specialty":
        return sorted.sort((a, b) => a.specialty.localeCompare(b.specialty));
      default:
        return sorted; // giữ nguyên thứ tự ban đầu
    }
  };

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <SafeAreaView className="mb-3">
      <DoctorCard {...item} onPress={() => handleDoctorPress(item)} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <SafeAreaView className="flex-row items-center rounded-lg my-3 px-3 py-1 bg-gray-50 text-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500">
        <SearchIcon width={25} height={25} color="#9CA3AF" />
        <TextInput
          placeholder="Tìm kiếm bác sĩ, chuyên khoa"
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="flex-1 outline-none px-2 text-base"
          ref={searchInputRef}
        />
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <AntDesign name="filter" size={24} color="gray" />
        </TouchableOpacity>
      </SafeAreaView>

      <Text className="text-xl font-bold text-gray-800 mb-2">
        Kết quả tìm kiếm
      </Text>

      {loading ? (
        <SafeAreaView className="items-center justify-center flex-1">
          <LoadingAnimation />
        </SafeAreaView>
      ) : filteredDoctors.length === 0 ? (
        <Text className="text-center text-gray-500 mt-5">
          Không tìm thấy bác sĩ nào!
        </Text>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDoctorItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/30 justify-end"
          onPress={() => setIsModalVisible(false)}
        >
          <View className="bg-white rounded-t-2xl px-5 pt-5 pb-10">
            <Text className="text-lg font-semibold mb-3">Sắp xếp theo:</Text>

            {[
              { label: "Mặc định", value: "default" },
              { label: "Rating: Cao → Thấp", value: "rating_desc" },
              { label: "Rating: Thấp → Cao", value: "rating_asc" },
              { label: "Tên: A → Z", value: "name_asc" },
              { label: "Tên: Z → A", value: "name_desc" },
              { label: "Theo chuyên khoa", value: "specialty" },
            ].map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                className={`p-2 ${
                  sortOption === value ? "bg-blue-100 rounded" : ""
                }`}
                onPress={() => {
                  setSortOption(value);
                  setIsModalVisible(false);
                }}
              >
                <Text className="text-base">{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
