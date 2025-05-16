import {
  Appointment,
  AppointmentDetail,
  mockAppointmentDetail,
} from "../types/types";

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

/* Lấy danh sách cuộc hẹn của patient theo status. 
1: Đã đặt lịch, 2: Đã hoàn thành, 3: Đã hủy */
export const getAppointment = async (
  patientId: string,
  status: number
): Promise<Appointment[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/appointment/patient/${patientId}/status/${status}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Lỗi khi lấy danh sách lịch hẹn");
    }

    const data = await response.json();

    return data.map((item: any) => ({
      id: item.id,
      doctor: item.Bac_si.Nguoi_dung.ho_va_ten,
      doctorId: item.Bac_si.ma_bac_si,
      specialty: item.Bac_si.chuyen_khoa,
      hospital: item.Bac_si.dia_chi_pk,
      date: item.Gio_hen.ngay_lam_viec,
      startTime: item.Gio_hen.thoi_diem_bat_dau,
      endTime: item.Gio_hen.thoi_diem_ket_thuc,
      isOnline: item.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl,
      image: item.Bac_si.Nguoi_dung.avt_url,
      ratingScore: item.Danh_gia?.diem_danh_gia,
      ratingContent: item.Danh_gia?.noi_dung,
      ratingTime: item.Danh_gia?.thoi_diem,
    }));
  } catch (error) {
    console.error("Lỗi API getAppointment:", error);
    return [];
  }
};
/* Lấy detail của một appointment cụ thể */
export const fetchAppointmentDetail = async (
  id: number
): Promise<AppointmentDetail | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/appointment/detail/${id}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Làm phẳng dữ liệu trước khi trả về
    return {
      id: data.id,
      additionalText: data.van_ban_bo_sung,
      clinicAddress: data.dia_chi_phong_kham,
      status: data.trang_thai,
      createdAt: data.thoi_diem_tao,
      doctorId: data.ma_bac_si,
      patientId: data.ma_benh_nhan_dat_hen,

      patientName: data.Benh_nhan.Nguoi_dung.ho_va_ten,
      patientPhone: data.Benh_nhan.Nguoi_dung.sdt,
      patientGender: data.Benh_nhan.Nguoi_dung.gioi_tinh,
      patientBirthDate: data.Benh_nhan.Nguoi_dung.ngay_sinh,
      patientAddress: data.Benh_nhan.dia_chi,
      patientCCCD: data.Benh_nhan.cccd,
      patientEthnicity: data.Benh_nhan.dan_toc,
      patientBloodType: data.Benh_nhan.nhom_mau,
      patientMedicalHistory: data.Benh_nhan.tien_su_benh,
      patientNationality: data.Benh_nhan.quoc_tich,
      patientAvatarUrl: data.Benh_nhan.Nguoi_dung.avt_url,

      doctorName: data.Bac_si.Nguoi_dung.ho_va_ten,
      doctorPhone: data.Bac_si.Nguoi_dung.sdt,
      doctorGender: data.Bac_si.Nguoi_dung.gioi_tinh,
      doctorBirthDate: data.Bac_si.Nguoi_dung.ngay_sinh,
      doctorSpecialty: data.Bac_si.chuyen_khoa,
      doctorEducation: data.Bac_si.trinh_do_hoc_van,
      doctorDescription: data.Bac_si.mo_ta,
      doctorExperienceDate: data.Bac_si.ngay_vao_nghe,
      doctorAvatarUrl: data.Bac_si.Nguoi_dung.avt_url,

      appointmentStart: data.Gio_hen.thoi_diem_bat_dau,
      appointmentEnd: data.Gio_hen.thoi_diem_ket_thuc,
      workDate: data.Gio_hen.ngay_lam_viec,
      isOnline: data.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl,

      images: data.Hinh_anh_bo_sung_cuoc_hen.map(
        (img: { url: string }) => img.url
      ),

      rating: data.Danh_gia
        ? {
            diem_danh_gia: data.Danh_gia.diem_danh_gia,
            noi_dung: data.Danh_gia.noi_dung,
            thoi_diem: data.Danh_gia.thoi_diem,
          }
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching appointment detail:", error);
    return null;
  }
};
export const fetchDoctorCalendar = async (
  drID: string,
  startTime: string,
  endTime: string,
  isOnlMethod: boolean
) => {
  try {
    const url = `${API_BASE_URL}/api/timeslot?drID=${encodeURIComponent(
      drID
    )}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(
      endTime
    )}&isOnlMethod=${isOnlMethod}`;
    console.log("URL fetchDoctorCalendar:", url); // Log URL để kiểm tra

    const response = await fetch(url);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi fetchCalendarData:", error);
    return null;
  }
};

export const createAppointment = async (data: any): Promise<boolean> => {
  try {
    console.log("Data to create appointment:", data); // Log dữ liệu để kiểm tra
    const response = await fetch(`${API_BASE_URL}/api/appointment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      return true;
    } else {
      const errorData = await response.json();
      const message = errorData?.message || "Đã xảy ra lỗi khi tạo cuộc hẹn.";
      throw new Error(message);
    }
  } catch (error: any) {
    throw new Error(error.message || "Lỗi mạng khi gọi API.");
  }
};

export const cancelAppointment = async (appointmentId: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/appointment/cancel/${appointmentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Hủy lịch hẹn thất bại");
    }

    return true; // Hủy thành công
  } catch (error: any) {
    console.error("Lỗi khi hủy lịch hẹn:", error.message);
    throw error;
  }
};
