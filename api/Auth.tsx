import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeAuthData, storeUsername } from "../services/storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Gọi storeAuthData để lưu thông tin vào AsyncStorage
      await storeAuthData(
        data.id,
        data.token,
        data.role,
        username,
        data.fullName,
        data.avtUrl
      );
      return { success: true, data };
    } else if (response.status === 302) {
      // Chưa có hồ sơ, chuyển hướng tạo mới
      await storeUsername(username);
      return { success: true, message: "302" };
    } else {
      return { success: false, message: data.message || "Đăng nhập thất bại" };
    }
  } catch (error) {
    console.error("Lỗi khi gọi API đăng nhập:", error);
    return { success: false, message: "Không thể kết nối đến server" };
  }
};

export const signupUser = async (
  username: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/account/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        confirmPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return {
        success: false,
        message: data.message || "Tạo tài khoản thất bại!",
      };
    }
  } catch (error) {
    console.error("Lỗi khi gọi API tạo tài khoản:", error);
    return { success: false, message: "Không thể kết nối đến server" };
  }
};
