import { Doctor, Specialization } from "../types/types";
const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

export const getAllDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/doctor`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Lỗi khi lấy danh sách bác sĩ");
    }

    const data = await response.json();

    return data.map((item: any) => ({
      id: item.ma_bac_si,
      name: item.Nguoi_dung.ho_va_ten,
      specialty: item.chuyen_khoa,
      hospital: item.dia_chi_pk,
      rating: parseFloat(item.danh_gia_trung_binh) || 0,
      reviews: parseInt(item.tong_so_danh_gia) || 0,
      description: item.mo_ta,
      experience:
        new Date().getFullYear() - new Date(item.ngay_vao_nghe).getFullYear(),
      image: item.Nguoi_dung.avt_url,
    }));
  } catch (error) {
    console.error("Lỗi API getAllDoctors:", error);
    return [];
  }
};

export const fetchSpecializations = async (): Promise<Specialization[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/doctor/specialization`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách chuyên khoa");
    }

    const data: Specialization[] = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API chuyên khoa:", error);
    return [];
  }
};
