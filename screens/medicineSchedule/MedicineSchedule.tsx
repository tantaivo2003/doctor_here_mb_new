import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
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
import { MedicineIntake, MedicineSchedule } from "../../types/types";
import MedicineItem from "../../components/medicineSchedule/MedicineItem";
import { getUserID } from "../../services/storage";
import Toast from "react-native-toast-message";

const MedicineScheduleScreen = () => {
  const [medicineIntakes, setMedicineIntakes] = useState<MedicineIntake[]>([]);
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineIntake | null>(null);
  const [schedules, setSchedules] = useState<MedicineSchedule[]>([]);

  let today = new Date();
  const [selectedDay, setSelectedDay] = useState<DateType>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [dayPickerModalVisible, setDayPickerModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);

  const loadSchedules = async () => {
    const patientId = await getUserID();
    if (!patientId) {
      console.error("Không tìm thấy ID bệnh nhân trong storage.");
      return;
    }
    const dayStr = dayjs(selectedDay).format("YYYY-MM-DD");
    const data = await fetchMedicineSchedule(patientId, dayStr, dayStr);
    setSchedules(data);
    console.log("Lịch trình thuốc:", data);
    setMedicineIntakes(data[0]?.intakes || []);
  };

  useEffect(() => {
    loadSchedules();
  }, [selectedDay]);

  const handleLongPress = (medicine: MedicineIntake) => {
    setSelectedMedicine(medicine);
    setActionModalVisible(true);
  };

  const markAsTaken = async () => {
    try {
      if (!selectedMedicine) return;
      const scheduleId = selectedMedicine.id;
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
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">
          Ngày: {selectedDay ? dayjs(selectedDay).format("DD/MM/YYYY") : null}
        </Text>

        <TouchableOpacity onPress={() => setDayPickerModalVisible(true)}>
          <FontAwesome name="calendar" size={24} color="blue" />
        </TouchableOpacity>
      </View>
      {medicineIntakes.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Text className=" text-gray-500 mt-4">
            Không có lịch uống thuốc nào trong ngày này.
          </Text>
        </View>
      )}
      {/* Danh sách chưa uống */}
      {medicineIntakes.some((item) => item.takenAt === null) && (
        <>
          <Text className="text-lg font-bold">Chưa uống:</Text>
          <FlatList
            data={medicineIntakes.filter((item) => item.takenAt === null)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MedicineItem medicine={item} onPress={handleLongPress} />
            )}
          />
        </>
      )}
      {/* Danh sách đã uống */}
      {medicineIntakes.some((item) => item.takenAt !== null) && (
        <>
          <Text className="text-lg font-bold mt-2">Đã uống:</Text>
          <FlatList
            data={medicineIntakes.filter((item) => item.takenAt !== null)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MedicineItem medicine={item} onPress={handleLongPress} />
            )}
          />
        </>
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
                  onPress={markAsTaken}
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
