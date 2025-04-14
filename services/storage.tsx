import AsyncStorage from "@react-native-async-storage/async-storage";
import { Doctor } from "../types/types";
import moment from "moment";

const FAVORITE_DOCTORS_KEY = "favorite_doctors";

export const storeAuthData = async (
  userId: string,
  token: string,
  role: string,
  username: string,
  fullName: string,
  avtUrl: string
) => {
  try {
    console.log("Lưu thông tin đăng nhập:");
    await AsyncStorage.setItem("user_id", userId);
    await AsyncStorage.setItem("auth_token", token);
    await AsyncStorage.setItem("user_role", role);
    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("full_name", fullName);
    await AsyncStorage.setItem("avt_url", avtUrl);
  } catch (error) {
    console.error("Lỗi khi lưu token:", error);
  }
};

/**Lấy Auth data */
export const getAuthData = async () => {
  try {
    const userId = await AsyncStorage.getItem("user_id");
    const token = await AsyncStorage.getItem("auth_token");
    const role = await AsyncStorage.getItem("user_role");
    const username = await AsyncStorage.getItem("username");
    const fullName = await AsyncStorage.getItem("full_name");
    const avtUrl = await AsyncStorage.getItem("avt_url");

    return { userId, token, role, username, fullName, avtUrl };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đăng nhập:", error);
    return null;
  }
};
/**
 * Lưu user ID vào AsyncStorage
 */
export const storeUserID = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem("user_id", userId);
  } catch (error) {
    console.error("Lỗi khi lưu user ID:", error);
  }
};

/**
 * Lấy user ID từ AsyncStorage
 */
export const getUserID = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("user_id");
  } catch (error) {
    console.error("Lỗi khi lấy user ID:", error);
    return null;
  }
};

/**
 * Xóa user ID khỏi AsyncStorage (Đăng xuất)
 */
export const removeUserID = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("user_id");
  } catch (error) {
    console.error("Lỗi khi xóa user ID:", error);
  }
};

/*
 *Lấy username từ AsyncStorage
 */
export const getUsername = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("username");
  } catch (error) {
    console.error("Lỗi khi lấy username:", error);
    return null;
  }
};

/**Lưu username */
export const storeUsername = async (username: string): Promise<void> => {
  try {
    await AsyncStorage.setItem("username", username);
  } catch (error) {
    console.error("Lỗi khi lưu username:", error);
  }
};
/**
 * Lưu JWT Token vào AsyncStorage
 */
export const storeToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem("auth_token", token);
  } catch (error) {
    console.error("Lỗi khi lưu token:", error);
  }
};

/**
 * Lấy JWT Token từ AsyncStorage
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("auth_token");
  } catch (error) {
    console.error("Lỗi khi lấy token:", error);
    return null;
  }
};

/**
 * Xóa JWT Token khỏi AsyncStorage (Đăng xuất)
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("auth_token");
  } catch (error) {
    console.error("Lỗi khi xóa token:", error);
  }
};

/**Lấy avt của user */
export const getAvt = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("avt_url");
  } catch (error) {
    console.error("Lỗi khi lấy avt:", error);
    return null;
  }
};

/**Lưu avt của user */
export const storeAvt = async (avtUrl: string): Promise<void> => {
  try {
    await AsyncStorage.setItem("avt_url", avtUrl);
  } catch (error) {
    console.error("Lỗi khi lưu avt:", error);
  }
};

/** Lưu full name của user */
export const storeFullName = async (fullName: string): Promise<void> => {
  try {
    await AsyncStorage.setItem("full_name", fullName);
  } catch (error) {
    console.error("Lỗi khi lưu full name:", error);
  }
};

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 */
export const isUserLoggedIn = async (): Promise<boolean> => {
  const userId = await getUserID();
  const token = await getToken();
  return !!userId && !!token; // Trả về `true` nếu cả user ID và token đều tồn tại
};

/**
 * Lưu danh sách bác sĩ yêu thích vào AsyncStorage
 */
export const storeFavoriteDoctors = async (
  doctors: Doctor[]
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(doctors);
    await AsyncStorage.setItem(FAVORITE_DOCTORS_KEY, jsonValue);
    console.log("Đã cập nhật danh sách bác sĩ yêu thích");
  } catch (error) {
    console.error("Lỗi khi lưu danh sách bác sĩ yêu thích:", error);
  }
};

/**
 * Lấy danh sách bác sĩ yêu thích từ AsyncStorage
 */
export const getFavoriteDoctors = async (): Promise<Doctor[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITE_DOCTORS_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bác sĩ yêu thích:", error);
    return [];
  }
};

/**
 * Kiểm tra xem một bác sĩ có nằm trong danh sách yêu thích hay không
 */
export const isDoctorFavorite = async (doctorId: string): Promise<boolean> => {
  try {
    const doctors = await getFavoriteDoctors();
    return doctors.some((doctor) => doctor.id === doctorId);
  } catch (error) {
    console.error("Lỗi khi kiểm tra bác sĩ yêu thích:", error);
    return false;
  }
};

/**
 * Thêm một bác sĩ vào danh sách yêu thích
 */
export const addFavoriteDoctor = async (doctor: Doctor): Promise<void> => {
  try {
    const doctors = await getFavoriteDoctors();
    if (!doctors.some((d) => d.id === doctor.id)) {
      doctors.push(doctor);
      await storeFavoriteDoctors(doctors);
    }
  } catch (error) {
    console.error("Lỗi khi thêm bác sĩ vào danh sách yêu thích:", error);
  }
};

/**
 * Xóa một bác sĩ khỏi danh sách yêu thích
 */
export const removeFavoriteDoctor = async (doctorId: string): Promise<void> => {
  try {
    let doctors = await getFavoriteDoctors();
    doctors = doctors.filter((doctor) => doctor.id !== doctorId);
    await storeFavoriteDoctors(doctors);
  } catch (error) {
    console.error("Lỗi khi xóa bác sĩ khỏi danh sách yêu thích:", error);
  }
};

/*  Danh sách các chỉ số sức khỏe và key tương ứng
      Chiều cao	"height_records"	Đơn vị: cm
      Cân nặng	"weight_records"	Đơn vị: kg
      BMI: "bmi_records"	Đơn vị: kg/m²
      Nhịp tim	"heart_rate_records"	Đơn vị: BPM (Beats Per Minute)
      Nhịp thở: "respiratory_rate_records"	Đơn vị: lần/phút
      Huyết áp tâm thu	"systolic_pressure_records"	Đơn vị: mmHg
      Huyết áp tâm trương	"diastolic_pressure_records"	Đơn vị: mmHg
      Số bước đi	"step_count_records"	Đơn vị: số bước
      Quãng đường đi bộ	"walking_distance_records"	Đơn vị: km
*/

/* Hàm lưu dữ liệu sức khỏe */
export const storeHealthData = async (key: string, value: number) => {
  try {
    const currentDate = new Date().toISOString(); // Lấy ngày hiện tại

    // Lấy dữ liệu cũ
    const storedData = await AsyncStorage.getItem(key);
    const records = storedData ? JSON.parse(storedData) : [];

    // Thêm bản ghi mới vào danh sách
    const newRecord = { value, date: currentDate };
    records.push(newRecord);

    // Lưu lại mảng dữ liệu
    await AsyncStorage.setItem(key, JSON.stringify(records));
  } catch (error) {
    console.error(`Lỗi khi lưu dữ liệu cho ${key}:`, error);
  }
};

/* Hàm lấy dữ liệu sức khỏe */
export const getHealthData = async (key: string) => {
  try {
    const storedData = await AsyncStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu cho ${key}:`, error);
    return [];
  }
};

/* 🔹 Hàm tạo dữ liệu giả cho tất cả chỉ số sức khỏe và lưu vào AsyncStorage */
export const generateAndStoreFakeHealthData = async () => {
  try {
    const today = moment();
    let bmiRecords = [];
    let heightRecords = [];
    let weightRecords = [];
    let heartRateRecords = [];
    let respiratoryRateRecords = [];
    let systolicPressureRecords = [];
    let diastolicPressureRecords = [];
    let stepCountRecords = [];
    let walkingDistanceRecords = [];

    for (let i = 0; i < 60; i++) {
      const date = today.clone().subtract(i, "days").toISOString();

      // Tạo dữ liệu ngẫu nhiên phù hợp cho từng chỉ số
      const height = Math.floor(150 + Math.random() * 30); // 150 - 180 cm
      const weight = parseFloat((45 + Math.random() * 35).toFixed(1)); // 45 - 80 kg
      const bmi = parseFloat((weight / (height / 100) ** 2).toFixed(2)); // BMI từ chiều cao & cân nặng
      const heartRate = Math.floor(60 + Math.random() * 40); // 60 - 100 BPM
      const respiratoryRate = Math.floor(12 + Math.random() * 8); // 12 - 20 lần/phút
      const systolicPressure = Math.floor(90 + Math.random() * 40); // 90 - 130 mmHg
      const diastolicPressure = Math.floor(60 + Math.random() * 30); // 60 - 90 mmHg
      const stepCount = Math.floor(1000 + Math.random() * 9000); // 1000 - 10000 bước
      const walkingDistance = parseFloat((stepCount * 0.0008).toFixed(2)); // Khoảng cách từ số bước

      // Thêm dữ liệu vào danh sách
      heightRecords.push({ date, value: height });
      weightRecords.push({ date, value: weight });
      bmiRecords.push({ date, value: bmi });
      heartRateRecords.push({ date, value: heartRate });
      respiratoryRateRecords.push({ date, value: respiratoryRate });
      systolicPressureRecords.push({ date, value: systolicPressure });
      diastolicPressureRecords.push({ date, value: diastolicPressure });
      stepCountRecords.push({ date, value: stepCount });
      walkingDistanceRecords.push({ date, value: walkingDistance });
    }

    // Lưu vào AsyncStorage
    await AsyncStorage.multiSet([
      ["height_records", JSON.stringify(heightRecords.reverse())],
      ["weight_records", JSON.stringify(weightRecords.reverse())],
      ["bmi_records", JSON.stringify(bmiRecords.reverse())],
      ["heart_rate_records", JSON.stringify(heartRateRecords.reverse())],
      [
        "respiratory_rate_records",
        JSON.stringify(respiratoryRateRecords.reverse()),
      ],
      [
        "systolic_pressure_records",
        JSON.stringify(systolicPressureRecords.reverse()),
      ],
      [
        "diastolic_pressure_records",
        JSON.stringify(diastolicPressureRecords.reverse()),
      ],
      ["step_count_records", JSON.stringify(stepCountRecords.reverse())],
      [
        "walking_distance_records",
        JSON.stringify(walkingDistanceRecords.reverse()),
      ],
    ]);

    console.log("✅ Dữ liệu sức khỏe giả đã được lưu vào AsyncStorage!");
  } catch (error) {
    console.error("❌ Lỗi khi tạo dữ liệu giả:", error);
  }
};

/*
 * xóa tất cả dữ liệu trong AsyncStorage
 */
export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("✅ Đã xóa tất cả dữ liệu trong AsyncStorage!");
  } catch (error) {
    console.error("❌ Lỗi khi xóa dữ liệu:", error);
  }
};
