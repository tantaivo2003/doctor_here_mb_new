import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import Modal from "react-native-modal";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker, {
  DateType,
  getDefaultStyles,
} from "react-native-ui-datepicker";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt

import { LanUong, listLanUong } from "../../types/types";
import MedicineItem from "../../components/medicineSchedule/MedicineItem";
const MedicineSchedule = () => {
  const [medicines, setMedicines] = useState<LanUong[]>(listLanUong);
  const [selectedMedicine, setSelectedMedicine] = useState<LanUong>(
    medicines[0]
  );

  let today = new Date();
  const [selectedDay, setSelectedDay] = useState<DateType>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [dayPickerModalVisible, setDayPickerModalVisible] = useState(false);

  const [actionModalVisible, setActionModalVisible] = useState(false);

  const handleLongPress = (medicine: LanUong) => {
    setSelectedMedicine(medicine);
    setActionModalVisible(true);
  };
  const markAsTaken = () => {
    if (selectedMedicine) {
      setMedicines((prev) =>
        prev.map((item) =>
          item.id === selectedMedicine.id
            ? { ...item, trang_thai: "taken" }
            : item
        )
      );
    }
    setActionModalVisible(false);
  };

  const deleteMedicine = () => {
    if (selectedMedicine) {
      setMedicines((prev) =>
        prev.filter((item) => item.id !== selectedMedicine.id)
      );
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
      {/* Danh sách chưa uống */}
      {medicines.some((item) => item.trang_thai === "pending") && (
        <>
          <Text className="text-lg font-bold">Chưa uống:</Text>
          <FlatList
            data={medicines.filter((item) => item.trang_thai === "pending")}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MedicineItem medicine={item} onPress={handleLongPress} />
            )}
          />
        </>
      )}

      {/* Danh sách đã uống */}
      {medicines.some((item) => item.trang_thai === "taken") && (
        <>
          <Text className="text-lg font-bold mt-2">Đã uống:</Text>
          <FlatList
            data={medicines.filter((item) => item.trang_thai === "taken")}
            keyExtractor={(item) => item.id}
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
            minDate={today}
            maxDate={new Date(today.getFullYear(), today.getMonth() + 3, 0)}
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
        <View className="bg-white p-4 rounded-lg">
          <MedicineItem medicine={selectedMedicine} />
          {selectedMedicine?.trang_thai === "pending" && (
            <TouchableOpacity
              className="mb-2 p-2 bg-green-700 rounded-lg"
              onPress={markAsTaken}
            >
              <Text className="text-white text-center">Đánh dấu đã uống</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity className="mb-2 p-2 bg-gray-900 rounded-lg">
            <Text className="text-white text-center">Xem chi tiết</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2 bg-red-500 rounded-lg"
            onPress={deleteMedicine}
          >
            <Text className="text-white text-center">Xóa lịch</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default MedicineSchedule;
