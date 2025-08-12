import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeAuthData, storeUsername } from "../services/storage";

// Khi đăng nhập thành công gọi đến API để xử lí tạo đoạn chat với AI
import { createAIConversation } from "./AIAgent";

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
    console.log("Login response:", data);
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

      // Tạo đoạn chat tới AI Agent
      const aiResult = await createAIConversation(data.id);
      if (aiResult.success) {
        console.log("Khởi tạo cuộc trò chuyện với AI thành công");
      } else {
        console.error(
          "Lỗi khi khởi tạo cuộc trò chuyện với AI:",
          aiResult.error
        );
      }

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
    console.log("Signup response:", data);

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
