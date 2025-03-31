const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

import { Rating, mockRatings } from "../types/types";

export const getDoctorRatings = async (doctorId: string): Promise<Rating[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/rating/doctor/${doctorId}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Lỗi khi lấy danh sách đánh giá của bác sĩ");
    }

    const data = await response.json();

    // return data.map((item: any) => ({
    //   id: item.id,
    //   score: item.diem_danh_gia,
    //   content: item.noi_dung,
    //   timestamp: item.thoi_diem,
    //   appointmentId: item.id_cuoc_hen,
    //   patient: {
    //     id: item.Benh_nhan.ma_benh_nhan,
    //     name: item.Benh_nhan.Nguoi_dung.ho_va_ten,
    //     avatar:
    //       item.Benh_nhan.Nguoi_dung.avt_url ||
    //       require("../assets/avatar-placeholder.png"),
    //   },
    // }));
    return mockRatings;
  } catch (error) {
    console.error(error);
    return [];
  }
};
