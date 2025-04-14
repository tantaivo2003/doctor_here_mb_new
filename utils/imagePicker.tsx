import * as ImagePicker from "expo-image-picker";

// Hàm chọn ảnh từ thư viện (chuẩn mới)
export const pickImageFromLibrary = async (): Promise<string | null> => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    alert("Bạn cần cấp quyền truy cập thư viện ảnh để chọn ảnh!");
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
