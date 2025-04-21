import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  TextInput as RNTextInput,
} from "react-native";
import Fuse from "fuse.js";

import ShortcutButton from "../../components/ui/ShortCutButton";
import SearchIcon from "../../components/icons/SearchIcon";
import DoctorCard from "../../components/ui/DoctorCard";
import LoadingAnimation from "../../components/ui/LoadingAnimation";

import { getAllDoctors } from "../../api/Doctor";
import { Doctor } from "../../types/types";

export default function FindDoctor({ navigation }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef<RNTextInput>(null);
  const [fuse, setFuse] = useState<Fuse<Doctor> | null>(null);

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
        keys: ["name", "specialty"],
        threshold: 0.3,
      };
      const fuseInstance = new Fuse(doctors, options);
      setFuse(fuseInstance);
    }
  }, [doctors]);

  useEffect(() => {
    if (fuse) {
      if (searchTerm.trim() === "") {
        setFilteredDoctors(doctors);
      } else {
        const results = fuse.search(searchTerm);
        setFilteredDoctors(results.map((result) => result.item));
      }
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchTerm, fuse, doctors]);

  const handleDoctorPress = (doctor: Doctor) => {
    navigation.navigate("DoctorDetail", { doctor });
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
    </SafeAreaView>
  );
}
