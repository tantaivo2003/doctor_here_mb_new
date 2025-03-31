import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeAuthData } from "../services/storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch(
      "https://doctor-here-hya8gmh7drg9bdbf.southeastasia-01.azurewebsites.net/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Gọi storeAuthData để lưu thông tin vào AsyncStorage
      await storeAuthData("BN0000006", data.token, data.role);
      return { success: true, data };
    } else {
      return { success: false, message: data.message || "Đăng nhập thất bại" };
    }
  } catch (error) {
    console.error("Lỗi khi gọi API đăng nhập:", error);
    return { success: false, message: "Không thể kết nối đến server" };
  }
};
