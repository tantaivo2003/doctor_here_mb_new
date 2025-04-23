import React, { FC } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
interface HealthDataModalProps {
  isVisible: boolean;
  label: string;
  setModalVisible: (visible: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  handleSaveData: (value: string, label: string) => void;
}

const HealthDataInputModal: FC<HealthDataModalProps> = ({
  isVisible,
  label,
  setModalVisible,
  value,
  setValue,
  handleSaveData,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onBackdropPress={() => setModalVisible(false)}
    >
      <View className="bg-white rounded-lg p-6">
        <Text className="text-lg font-bold text-center mb-4">Nhập {label}</Text>
        <View className="flex-row items-center border border-gray-300 p-2 rounded-xl mb-4">
          <FontAwesome name="pencil" size={20} color="gray" className="ml-3" />
          <TextInput
            className="ml-3 flex-1"
            placeholder="Nhập giá trị"
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            inputMode="numeric"
          />
        </View>
        {/* Nút hành động */}
        <View className="flex-row justify-end gap-4">
          <TouchableOpacity
            className="px-4 py-2 bg-gray-100 rounded-full"
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-gray-900">Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-4 py-2 bg-gray-900 rounded-full"
            onPress={() => {
              handleSaveData(value, label);
              setModalVisible(false);
            }}
          >
            <Text className="text-white font-semibold">Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default HealthDataInputModal;
