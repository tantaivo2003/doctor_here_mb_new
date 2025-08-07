import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Modal from "react-native-modal";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker, {
  DateType,
  getDefaultStyles,
} from "react-native-ui-datepicker";

import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt
import TimePicker from "../../components/ui/TimePicker";
import {
  fetchMedicineSchedule,
  updateTakenTime,
  toggleMedicineSchedule,
} from "../../api/Diagnosis";
import { MedicineScheduleIntake, MedicineSchedule } from "../../types/types";
import MedicineItem from "../../components/medicineSchedule/MedicineItem";
import { getUserID } from "../../services/storage";
import Toast from "react-native-toast-message";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import { SwipeListView } from "react-native-swipe-list-view";
import ScrollDatePicker from "../../components/ui/ScrollDatePicker";

const PERIOD_CONFIG = {
  Sáng: {
    title: "Sáng: 6 - 12h",
    icon: "☀️",
    bgColor: "bg-yellow-50", // NativeWind class
  },
  Trưa: {
    title: "Trưa: 12 - 18h",
    icon: "🌤️",
    bgColor: "bg-blue-50",
  },
  Chiều: {
    title: "Chiều: 18 - 24h",
    icon: "🌇",
    bgColor: "bg-orange-50",
  },
  Tối: {
    title: "Tối: 22 - 24h",
    icon: "🌙",
    bgColor: "bg-indigo-100",
  },
} as const;

const MedicineScheduleScreen = ({ navigation }: any) => {
  const [medicineScheduleIntakes, setMedicineScheduleIntakes] = useState<
    MedicineScheduleIntake[]
  >([]);
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineScheduleIntake | null>(null);
  const [schedules, setSchedules] = useState<MedicineSchedule[]>([]);

  let today = new Date();
  const [selectedDay, setSelectedDay] = useState<DateType>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [dayPickerModalVisible, setDayPickerModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const loadSchedules = async () => {
    const patientId = await getUserID();
    if (!patientId) {
      console.error("Không tìm thấy ID bệnh nhân trong storage.");
      return;
    }
    const dayStr = dayjs(selectedDay).format("YYYY-MM-DD");
    // const threeDay = new Date();
    // threeDay.setDate(threeDay.getDate() - 3);
    // const threeDayStr = dayjs(threeDay).format("YYYY-MM-DD");

    const data = await fetchMedicineSchedule(patientId, dayStr, dayStr);
    console.log("Lịch trình thuốc:", data);
    setSchedules(data);

    const allIntakes = data.flatMap((schedule) =>
      schedule.intakes.map((intake) => ({
        ...intake,
        diagnosisResultId: schedule.diagnosisResultId,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        status: schedule.status,
        note: schedule.note,
        prescriptionName: schedule.prescriptionName,
        patientId: schedule.patientId,
      }))
    );
    setMedicineScheduleIntakes(allIntakes);
  };

  useFocusEffect(
    useCallback(() => {
      loadSchedules();
    }, [selectedDay])
  );

  const handleLongPress = (medicine: MedicineScheduleIntake) => {
    setActionModalVisible(true);
    setSelectedMedicine(medicine);
  };

  const handleExpand = (medicine: MedicineScheduleIntake) => {
    setActionModalVisible(true);
    setSelectedMedicine(medicine);
  };

  const markAsTaken = async (medicineId?: number) => {
    try {
      if (!selectedMedicine) return;
      const scheduleId = medicineId ? medicineId : selectedMedicine.id;
      // if (!selectedMedicine) return;
      // const scheduleId = selectedMedicine.id;
      const drankTime = await toggleMedicineSchedule(scheduleId);
      loadSchedules();
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Làm tốt lắm!",
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Thất bại",
        text2: "Chưa tới thời gian uống thuốc.",
      });
    }
    setActionModalVisible(false);
  };

  const changeTakenTime = async (time: any) => {
    if (selectedMedicine) {
      try {
        const result = await updateTakenTime(selectedMedicine?.id, time);
        console.log("Cập nhật thành công:", result);
        loadSchedules(); // Tải lại lịch trình sau khi cập nhật
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Thất bại",
          text2: "Có lỗi xảy ra khi cập nhật thời gian uống thuốc.",
        });
      }
    }
    setActionModalVisible(false);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="mb-5">
        {/* <View className="flex-row items-center ml-2">
          <Text className="text-xl mr-2">🗓️</Text>
          <Text className="text-lg font-bold">Ngày</Text>
        </View> */}
        <View className="flex-row justify-between items-center mt-2">
          <ScrollDatePicker onDateSelect={setSelectedDay} />
        </View>
      </View>

      {medicineScheduleIntakes.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 mt-5">
            Không có lịch uống thuốc nào trong ngày này.
          </Text>
        </View>
      ) : (
        <View className="mb-5">
          {/* Hiển thị theo trạng thái uống */}
          {[
            {
              label: "Chưa uống",
              filter: (item: MedicineScheduleIntake) => item.takenAt === null,
            },
            {
              label: "Đã uống",
              filter: (item: MedicineScheduleIntake) => item.takenAt !== null,
            },
          ].map(({ label, filter }) => {
            const medicines = medicineScheduleIntakes.filter(filter);

            if (medicines.length === 0) return null;

            return (
              <View key={label} className="mb-5 px-2 rounded-lg">
                {/* Header: Chưa uống / Đã uống */}
                <View className="flex-row items-center mb-2 ml-2">
                  <Text className="text-lg font-bold">{label}</Text>
                </View>

                {/* Bên trong chia theo buổi */}
                {["Sáng", "Trưa", "Chiều", "Tối"].map((period) => {
                  const medicinesByPeriod = medicines.filter(
                    (item) => item.period === period
                  );

                  if (medicinesByPeriod.length === 0) return null;

                  const { title, icon } = PERIOD_CONFIG[period] || {};

                  return (
                    <View key={period} className="mb-4">
                      {/* Buổi uống */}
                      <View className="flex-row items-center mb-1 ml-1">
                        <Text className="text-xl mr-2">{icon}</Text>
                        <Text className="text-base font-semibold">{title}</Text>
                      </View>

                      {/* Danh sách thuốc */}
                      <View className="px-4 py-2 rounded-2xl">
                        <SwipeListView
                          data={medicinesByPeriod}
                          keyExtractor={(item) => item.id.toString()}
                          renderItem={({ item, index }) => (
                            <MedicineItem
                              medicine={item}
                              onPress={() => {
                                navigation.navigate("MedicineDetailScreen", {
                                  scheduleId: item.id,
                                });
                              }}
                              onExpand={handleExpand}
                              showDivider={
                                index !== medicinesByPeriod.length - 1
                              }
                            />
                          )}
                          renderHiddenItem={({ item }) => (
                            <View className="flex-1 justify-center items-end pr-4">
                              <View
                                className={`py-2 px-4 rounded-xl ${
                                  item.takenAt ? "bg-gray-400" : "bg-green-500"
                                }`}
                              >
                                <Text className="text-white font-bold">
                                  {item.takenAt
                                    ? "Chưa uống"
                                    : "Đánh dấu đã uống"}
                                </Text>
                              </View>
                            </View>
                          )}
                          rightOpenValue={-220}
                          friction={20}
                          disableRightSwipe
                          onRowOpen={async (rowKey, rowMap) => {
                            const medicine = medicinesByPeriod.find(
                              (m) => m.id.toString() === rowKey
                            );
                            if (!medicine) return;

                            setSelectedMedicine(medicine);
                            await markAsTaken(medicine.id);
                            rowMap[rowKey]?.closeRow();
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      )}
      {/* Modal chọn ngày */}
      <Modal
        isVisible={dayPickerModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="justify-center items-center bg-white p-4 rounded-lg">
          <DateTimePicker
            mode="single"
            date={selectedDay}
            onChange={({ date }) => setSelectedDay(date)}
            styles={{
              ...getDefaultStyles(),
            }}
            locale="vi"
          />
          <View className="flex-row justify-end w-full mt-4">
            <TouchableOpacity
              className="bg-gray-900 px-6 py-3 rounded-full"
              onPress={() => setDayPickerModalVisible(false)}
            >
              <Text className="text-white font-semibold">Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal thao tác */}
      <Modal
        isVisible={actionModalVisible}
        onBackdropPress={() => setActionModalVisible(false)}
      >
        {selectedMedicine && (
          <View className="bg-white p-4 rounded-lg">
            <MedicineItem medicine={selectedMedicine} />

            {!selectedMedicine.takenAt && (
              <>
                <TouchableOpacity
                  className="mb-2 p-2 bg-teal-500 rounded-lg"
                  onPress={() => markAsTaken()}
                >
                  <Text className="text-white text-center">
                    Đánh dấu đã uống
                  </Text>
                </TouchableOpacity>
                <TimePicker onChange={changeTakenTime} />
              </>
            )}
          </View>
        )}
      </Modal>
    </View>
  );
};

export default MedicineScheduleScreen;
