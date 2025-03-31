import {
  Appointment,
  mockAppointments,
  AppointmentDetail,
  mockAppointmentDetail,
} from "../types/types";

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

/* Lấy danh sách cuộc hẹn của patient theo status. 
1: Đã đặt lịch, 2: Đã hoàn thành, 3: Đã hủy */
export const getAppointment = async (
  patientId: number,
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
    if (data.length === 0) {
      console.log("Không có lịch hẹn nào");
      return mockAppointments;
    }

    return data.map((item: any) => ({
      doctor: item.Bac_si.Nguoi_dung.ho_va_ten,
      specialty: item.Bac_si.chuyen_khoa,
      hospital: item.Bac_si.dia_chi_pk,
      date: item.Gio_hen.ngay_lam_viec,
      startTime: item.Gio_hen.thoi_diem_bat_dau,
      endTime: item.Gio_hen.thoi_diem_ket_thuc,
      isOnline: item.Gio_hen.Ca_lam_viec_trong_tuan.lam_viec_onl,
      image:
        item.Bac_si.Nguoi_dung.avt_url ||
        require("../assets/avatar-placeholder.png"),
    }));
  } catch (error) {
    console.error("Lỗi API getAppointment:", error);
    return [];
  }
};
/* Lấy detail của một appointment cụ thể */
export const fetchAppointmentDetail = async (
  id: number
): Promise<AppointmentDetail> => {
  try {
    const response = await fetch(
      `https://doctor-here-hya8gmh7drg9bdbf.southeastasia-01.azurewebsites.net/appointments/detail/${id}`
    );

    if (!response.ok) {
      console.log("Không có dữ liệu");
      return mockAppointmentDetail;
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
    };
  } catch (error) {
    console.error("Error fetching appointment detail:", error);
    return mockAppointmentDetail;
  }
};
