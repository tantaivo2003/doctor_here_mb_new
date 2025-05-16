import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Appointment } from "../../types/types";
import { getUserID } from "../../services/storage";
import { getAppointment } from "../../api/Appointment";
import { formatDateTime } from "../../utils/formatDateTime";
import { MaterialIcons } from "@expo/vector-icons";
import SearchAndSortBar from "../../components/ui/SearchAndSortBar";
import Fuse from "fuse.js";

import LoadingModal from "../../components/ui/LoadingModal";

export default function CanceledAppointments({ navigation }: any) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [fuse, setFuse] = useState<Fuse<Appointment> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set()
  );

  // Fetch appointments
  useFocusEffect(
    useCallback(() => {
      const fetchAppointments = async () => {
        setLoading(true);
        try {
          const patientId = await getUserID();
          if (!patientId) {
            console.error("Không tìm thấy patientId trong AsyncStorage");
            return;
          }

          const status = 3; // Chỉ lấy các lịch hẹn đã hủy
          const data = await getAppointment(patientId, status);
          setAppointments(data);
        } catch (error) {
          console.error("Lỗi khi lấy lịch hẹn:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAppointments();
    }, [])
  );

  useEffect(() => {
    if (appointments.length > 0) {
      const options = {
        keys: ["doctor", "specialty", "hospital"],
        threshold: 0.3,
      };
      const fuseInstance = new Fuse(appointments, options);
      setFuse(fuseInstance);
    }
  }, [appointments]);

  useEffect(() => {
    let results =
      searchTerm.trim() === ""
        ? appointments
        : fuse?.search(searchTerm).map((r) => r.item) ?? appointments;

    // Filter by selected filters
    results = filterAppointments(results, selectedFilters);

    // Sort appointments based on selected option
    if (sortOption === "latest") {
      results.sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
    } else if (sortOption === "oldest") {
      results.sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    }

    setFilteredAppointments(results);
  }, [searchTerm, appointments, sortOption, selectedFilters]);

  // Toggle filter options
  const toggleFilter = (value: string) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(value)) {
      newFilters.delete(value);
    } else {
      newFilters.add(value);
    }
    setSelectedFilters(newFilters);
  };

  const filterAppointments = (list: Appointment[], filters: Set<string>) => {
    let filteredList = list;

    // Phân loại các filter
    const timeFilters: string[] = ["morning", "afternoon", "evening"];
    const modeFilters: string[] = ["online", "offline"];

    const selectedTimeFilters = [...timeFilters].filter((filter) =>
      filters.has(filter)
    );
    const selectedModeFilters = [...modeFilters].filter((filter) =>
      filters.has(filter)
    );

    // Lọc các cuộc hẹn theo thời gian
    if (selectedTimeFilters.length > 0) {
      filteredList = filteredList.filter((a) => {
        const hour = new Date(a.startTime).getHours();
        // Kiểm tra xem cuộc hẹn có phù hợp với bất kỳ thời gian nào được chọn
        return selectedTimeFilters.some((filter) => {
          switch (filter) {
            case "morning":
              return hour >= 5 && hour < 12;
            case "afternoon":
              return hour >= 12 && hour < 18;
            case "evening":
              return hour >= 18 && hour <= 22;
            default:
              return false;
          }
        });
      });
    }

    // Lọc các cuộc hẹn theo chế độ (online/offline)
    if (selectedModeFilters.length > 0) {
      filteredList = filteredList.filter((a) => {
        // Kiểm tra xem cuộc hẹn có phù hợp với bất kỳ chế độ nào được chọn
        return selectedModeFilters.some((filter) => {
          switch (filter) {
            case "online":
              return a.isOnline; // Lọc các cuộc hẹn trực tuyến
            case "offline":
              return !a.isOnline; // Lọc các cuộc hẹn trực tiếp
            default:
              return false;
          }
        });
      });
    }

    return filteredList;
  };

  if (loading) {
    return <LoadingModal />;
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Search and Sort Bar */}
      <SearchAndSortBar
        searchText={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFilters={selectedFilters}
        onToggleFilter={toggleFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      {filteredAppointments.length === 0 ? (
        <View className="items-center justify-center flex-1 bg-gray-100">
          <Text className="text-gray-500 text-lg">Không có lịch hẹn nào</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id || Math.random().toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white rounded-lg shadow-md p-4 mb-4 mx-4 mt-4"
              onPress={() =>
                navigation.navigate("AppointmentDetails", {
                  appointment: item,
                })
              }
            >
              {/* Ngày giờ */}
              <Text className="text-gray-600 font-semibold mb-2">
                {item.isOnline ? "Trực tuyến, " : "Trực tiếp, "}
                {formatDateTime(item.startTime)}
              </Text>
              <View className="h-[1px] bg-gray-300 my-2" />
              {/* Thông tin bác sĩ */}
              <View className="flex-row items-center">
                <View className="w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center">
                  <Image
                    source={
                      item.image
                        ? { uri: item.image }
                        : require("../../assets/avatar-placeholder.png")
                    }
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="ml-4">
                  <Text className="font-bold text-lg">{item.doctor}</Text>
                  <Text className="text-gray-500">{item.specialty}</Text>
                  <View className="flex-row items-center mt-1">
                    <MaterialIcons
                      name="location-on"
                      size={16}
                      color="#6B7280"
                    />
                    <Text className="text-gray-400">{item.hospital}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {loading && <LoadingModal />}
    </View>
  );
}
