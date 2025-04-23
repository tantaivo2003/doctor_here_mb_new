import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = "Xác nhận",
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isVisible={visible} animationIn="zoomIn" animationOut="zoomOut">
      <View className="justify-center items-center">
        <View className="bg-white rounded-2xl p-6 items-center">
          <Text className="text-lg font-bold text-center">{title}</Text>
          <Text className="text-center text-gray-500 my-5">{message}</Text>
          <View className="flex-row justify-around mt-4 gap-5">
            <TouchableOpacity
              className="py-3 px-6 bg-gray-100 w-2/5 items-center rounded-full"
              onPress={onCancel}
            >
              <Text>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3 px-6 bg-blue-500 w-2/5 items-center rounded-full"
              onPress={onConfirm}
            >
              <Text className="text-white">{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
