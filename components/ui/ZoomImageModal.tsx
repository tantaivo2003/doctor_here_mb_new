import React from "react";
import { Modal, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ZoomImageModalProps = {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
};

export default function ZoomImageModal({
  visible,
  imageUri,
  onClose,
}: ZoomImageModalProps) {
  if (!imageUri) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black bg-opacity-80 justify-center items-center relative">
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-10 right-6 z-50"
        >
          <Ionicons name="close-circle" size={36} color="white" />
        </TouchableOpacity>

        <Image
          source={{ uri: imageUri }}
          className="w-full h-[80%]"
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
}
