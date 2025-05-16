import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

// Hàm chọn ảnh từ thư viện (chuẩn mới)
export const pickImageFromLibrary = async (): Promise<string | null> => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Toast.show({
      type: "error",
      text1: "Không có quyền truy cập vào thư viện ảnh",
      text2: "Vui lòng cấp quyền truy cập vào thư viện ảnh trong cài đặt.",
    });
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"], // ✅ dùng MediaType.IMAGE thay vì MediaTypeOptions.Images
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled && result.assets.length > 0) {
    return result.assets[0].uri;
  }

  return null;
};
