import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Appointment } from "../../types/types";
import { getUserID } from "../../services/storage";
import { getAppointment } from "../../api/Appointment";

import { formatDateTime } from "../../utils/formatDateTime";
import LoadingModal from "../../components/ui/LoadingModal";
import NotificationModal from "../../components/ui/NotificationModal";
import { cancelAppointment } from "../../api/Appointment";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";

import SearchAndSortBar from "../../components/ui/SearchAndSortBar";
import Fuse from "fuse.js";
export default function UpcomingAppointments({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState(true); // true for success, false for error

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

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const patientId = await getUserID();
      if (!patientId) {
        console.error("Không tìm thấy patientId trong AsyncStorage");
        return;
      }

      const status = 1; // Chỉ lấy các lịch hẹn sắp tới
      const data = await getAppointment(patientId, status);

      setAppointments(data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const handleCancelPress = (appointment: any) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };
  const handleJoinCall = (
    doctorId: string,
    id: string,
    startTime: string,
    endTime: string
  ) => {
    console.log(endTime);
    const now = dayjs(); // Thời gian hiện tại
    const start = dayjs(startTime).subtract(5, "minute"); // Thời gian bắt đầu - 5 phút
    const end = dayjs(endTime); // Thời gian kết thúc

    if (now.isBefore(start)) {
      console.log("Chưa đến thời gian cho phép vào cuộc gọi.");
      Toast.show({
        type: "error",
        text1: "Đợi chút đã",
        text2: "Chưa đến thời gian của cuộc hẹn.",
      });
      return;
    }

    if (now.isAfter(end)) {
      Toast.show({
        type: "error",
        text1: "Quá thời gian",
        text2: "Bạn đã lỡ cuộc hẹn mất rồi!",
      });
      return;
    }

    console.log("Tham gia cuộc gọi...");
    navigation.navigate("VideoCallScreen", {
      doctorId: doctorId,
      callId: id,
      endTime: endTime,
    });
  };
  const confirmCancel = async () => {
    if (!selectedAppointment?.id) return;
    // Nếu thời gian hẹn nhỏ hơn 2 tiếng thì không cho hủy
    const currentTime = new Date();
    const appointmentTime = new Date(selectedAppointment.startTime);
    const timeDifference = appointmentTime.getTime() - currentTime.getTime();
    const twoHoursInMillis = 2 * 60 * 60 * 1000; // 2 tiếng
    if (timeDifference < twoHoursInMillis && timeDifference > 0) {
      setNotificationMessage(
        "Không thể hủy lịch hẹn trong vòng 2 tiếng trước giờ hẹn."
      );
      setNotificationType(false);
      setNotificationVisible(true);
      setModalVisible(false);
      return;
    }

    try {
      await cancelAppointment(selectedAppointment.id);
      console.log("Đã hủy lịch hẹn:", selectedAppointment.id);
      fetchAppointments(); // Cập nhật danh sách lịch hẹn sau khi hủy
      setModalVisible(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Có lỗi xảy ra khi hủy lịch hẹn",
      });
    }
  };

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
    <View className="flex-1">
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
              {item.isOnline ? (
                <View className="flex-row justify-center items-center mt-4 w-full gap-4">
                  {/* Nút hủy*/}
                  <TouchableOpacity
                    className="mt-4 bg-gray-100 p-2 rounded-full w-1/2"
                    onPress={() => handleCancelPress(item)}
                  >
                    <Text className="text-center font-semibold">Hủy</Text>
                  </TouchableOpacity>
                  {/* Nút tham gia*/}
                  <TouchableOpacity
                    className="mt-4 bg-blue-500 p-2 rounded-full w-1/2"
                    onPress={() => {
                      handleJoinCall(
                        item.doctorId,
                        item.id,
                        item.startTime,
                        item.endTime
                      );
                    }}
                  >
                    <Text className="text-center text-white  font-semibold">
                      Tham gia
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="">
                  {/* Nút hủy*/}
                  <TouchableOpacity
                    className="mt-4 bg-gray-100 p-2 rounded-full"
                    onPress={() => handleCancelPress(item)}
                  >
                    <Text className="text-center font-semibold">Hủy</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
      {/* Modal Xác Nhận Hủy */}
      <Modal
        isVisible={modalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="justify-center items-center">
          <View className="bg-white rounded-2xl p-6 items-center">
            <Text className="text-lg font-bold text-center">
              Xác nhận hủy lịch hẹn
            </Text>

            <Text className="text-center text-gray-500 my-5">
              Bạn có chắc muốn hủy lịch hẹn với Bác sĩ{" "}
              {selectedAppointment?.doctor} không?
            </Text>
            <View className="flex-row justify-around mt-4 gap-5">
              <TouchableOpacity
                className="py-3 px-6 bg-gray-100 w-2/5 items-center rounded-full"
                onPress={() => setModalVisible(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 px-6 bg-gray-900 w-2/5 items-center rounded-full"
                onPress={confirmCancel}
              >
                <Text className="text-white">Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Loading Modal */}
      {loading && <LoadingModal />}
      {/* Notification Modal */}
      <NotificationModal
        visible={notificationVisible}
        message={notificationMessage}
        type={notificationType ? "success" : "error"}
        onClose={() => setNotificationVisible(false)}
      />
    </View>
  );
}
