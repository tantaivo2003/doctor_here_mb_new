import { Doctor, doctorlist } from "../types/types";
const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

/*
 * Lấy danh sách bác sĩ yêu thích của bệnh nhân
 */
export const getLoveList = async (patientId: string): Promise<Doctor[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/loveList/patient/${patientId}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Lỗi khi lấy danh sách bác sĩ yêu thích");
    }

    const data = await response.json();

    return data.map((item: any) => ({
      id: item.ma_bac_si,
      name: item.Bac_si.Nguoi_dung.ho_va_ten,
      specialty: item.Bac_si.chuyen_khoa,
      hospital: item.Bac_si.dia_chi_pk,
      rating: Math.floor(Math.random() * (5 - 3 + 1)) + 3,
      reviews: Math.floor(Math.random() * 100) + 1,
      experience: Math.floor(Math.random() * 10) + 1,
      image:
        item.Bac_si.Nguoi_dung.avt_url ||
        require("../assets/avatar-placeholder.png"),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

/*
 * Thêm một bác sĩ vào danh sách yêu thích
 */
export const addToLoveList = async (
  patientId: string,
  doctorId: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/loveList`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ptID: patientId,
        drID: doctorId,
      }),
    });

    if (!response.ok) {
      throw new Error("Lỗi khi thêm bác sĩ vào danh sách yêu thích");
    }

    return true;
  } catch (error) {
    console.error("Lỗi API addToLoveList:", error);
    return false;
  }
};

/*
 * Xóa một bác sĩ khỏi danh sách yêu thích
 */
export const removeFromLoveList = async (
  patientId: string,
  doctorId: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/loveList/patient/${patientId}/doctor/${doctorId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Lỗi khi xóa bác sĩ khỏi danh sách yêu thích");
    }

    return true; // Xóa thành công
  } catch (error) {
    console.error("Lỗi API removeFromLoveList:", error);
    return false; // Xóa thất bại
  }
};
