import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import Svg, { Rect, Path } from "react-native-svg";

interface NotificationModalProps {
  visible: boolean;
  type: "success" | "error"; // Phân loại thành công hoặc thất bại
  message: string;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  type,
  message,
  onClose,
}) => {
  return (
    <Modal isVisible={visible} animationIn="zoomIn" animationOut="zoomOut">
      <View className="bg-white rounded-2xl p-6 items-center">
        {/* Biểu tượng */}
        <View className="w-28 h-28 rounded-full flex items-center justify-center mb-10">
          {type === "success" ? (
            <Svg width="110" height="110" viewBox="0 0 131 131" fill="none">
              <Rect width="131" height="131" rx="65.5" fill="#A4CFC3" />
              <Path
                d="M62.3799 35.68L45.8799 41.86C42.7299 43.06 40.1499 46.78 40.1499 50.17V74.47C40.1499 76.9 41.7399 80.11 43.6899 81.55L60.1899 93.88C63.0999 96.07 67.8699 96.07 70.7799 93.88L87.2799 81.55C89.2299 80.08 90.8199 76.9 90.8199 74.47V50.17C90.8199 46.81 88.2399 43.06 85.0899 41.89L68.5899 35.71C66.9099 35.05 64.0899 35.05 62.3799 35.68Z"
                fill="white"
              />
              <Path
                d="M61.4797 72.19C60.9097 72.19 60.3397 71.98 59.8897 71.53L55.0597 66.7C54.1897 65.83 54.1897 64.39 55.0597 63.52C55.9297 62.65 57.3697 62.65 58.2397 63.52L61.4797 66.76L72.7897 55.45C73.6597 54.58 75.0997 54.58 75.9697 55.45C76.8397 56.32 76.8397 57.76 75.9697 58.63L63.0697 71.53C62.6197 71.98 62.0497 72.19 61.4797 72.19Z"
                fill="#292D32"
              />
            </Svg>
          ) : (
            <Svg width="110" height="110" viewBox="0 0 131 131" fill="none">
              <Rect width="131" height="131" rx="65.5" fill="#FF6C52" />
              <Path
                d="M85.1199 41.86L68.6199 35.68C66.9099 35.05 64.1199 35.05 62.4099 35.68L45.9099 41.86C42.7299 43.06 40.1499 46.78 40.1499 50.17V74.47C40.1499 76.9 41.7399 80.11 43.6899 81.55L60.1899 93.88C63.0999 96.07 67.8699 96.07 70.7799 93.88L87.2799 81.55C89.2299 80.08 90.8199 76.9 90.8199 74.47V50.17C90.8499 46.78 88.2699 43.06 85.1199 41.86ZM73.5399 71.41C73.0899 71.86 72.5199 72.07 71.9499 72.07C71.3799 72.07 70.8099 71.86 70.3599 71.41L65.5899 66.64L60.6699 71.56C60.2199 72.01 59.6499 72.22 59.0799 72.22C58.5099 72.22 57.9399 72.01 57.4899 71.56C56.6199 70.69 56.6199 69.25 57.4899 68.38L62.4099 63.46L57.6099 58.66C56.7399 57.79 56.7399 56.35 57.6099 55.48C58.4799 54.61 59.9199 54.61 60.7899 55.48L65.5599 60.25L70.2099 55.6C71.0799 54.73 72.5199 54.73 73.3899 55.6C74.2599 56.47 74.2599 57.91 73.3899 58.78L68.7399 63.43L73.5099 68.2C74.4099 69.1 74.4099 70.51 73.5399 71.41Z"
                fill="white"
              />
            </Svg>
          )}
        </View>

        {/* Tiêu đề */}
        <Text
          className={`text-lg font-bold mb-2 ${
            type === "success" ? "text-gray-900" : "text-red-600"
          }`}
        >
          {type === "success" ? "Thành công" : "Thất bại"}
        </Text>

        {/* Nội dung */}
        <Text className="text-center text-gray-600">{message}</Text>

        {/* Nút đóng */}
        <TouchableOpacity
          className="mt-5 py-3 px-6 bg-gray-900 w-full items-center rounded-full"
          onPress={onClose}
        >
          <Text className="text-white font-semibold">Đóng</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default NotificationModal;
