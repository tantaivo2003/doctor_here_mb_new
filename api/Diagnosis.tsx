const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
import {
  DiagnosisResult,
  DiagnosisDetail,
  MedicineIntake,
  MedicineSchedule,
} from "../types/types";

export const fetchDiagnosisResults = async (
  patientId: string
): Promise<DiagnosisResult[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/diagnosis/patient/${patientId}`
    );

    if (!response.ok) {
      console.error("Failed to fetch diagnosis results");
      return [];
    }

    const data = await response.json();

    const results: DiagnosisResult[] = data.map((item: any) => ({
      id: item.id,
      diagnosisResult: item.ket_qua_chan_doan,
      additionalNotes: item.ghi_chu_them,
      appointmentId: item.ma_cuoc_hen,
      doctorId: item.ma_bac_si,
      clinicAddress: item.dia_chi_phong_kham,
      startTime: item.thoi_diem_bat_dau,
      endTime: item.thoi_diem_ket_thuc,
      department: item.chuyen_khoa,
      doctorName: item.ho_va_ten,
      doctorAvatarUrl: item.avt_url,
    }));

    return results;
  } catch (error) {
    console.error("Error fetching diagnosis results:", error);
    return [];
  }
};

export const fetchDiagnosisDetail = async (
  id: number
): Promise<DiagnosisDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diagnosis/detail/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch diagnosis detail");
    }

    const rawData = await response.json();

    const result: DiagnosisDetail = {
      id: rawData.id,
      diagnosisResult: rawData.ket_qua_chan_doan,
      additionalNote: rawData.ghi_chu_them,
      appointmentId: rawData.ma_cuoc_hen,
      doctorId: rawData.ma_bac_si,
      clinicAddress: rawData.Cuoc_hen?.dia_chi_phong_kham ?? "",
      startTime: rawData.Cuoc_hen?.Gio_hen?.thoi_diem_bat_dau ?? "",
      endTime: rawData.Cuoc_hen?.Gio_hen?.thoi_diem_ket_thuc ?? "",
      doctorFullName: rawData.Bac_si?.ho_va_ten ?? "",
      doctorAvatarUrl: rawData.Bac_si?.avt_url ?? "",
      doctorSpecialty: rawData.Bac_si?.chuyen_khoa ?? "",
      images: rawData.Hinh_anh_ket_qua ?? [],
      prescriptionId: rawData.Don_thuoc?.id ?? null,
      prescriptionStartDate: rawData.Don_thuoc?.ngay_bat_dau ?? null,
      prescriptionEndDate: rawData.Don_thuoc?.ngay_ket_thuc ?? null,
      prescriptionNote: rawData.Don_thuoc?.ghi_chu ?? null,
      medicines:
        rawData.Don_thuoc?.Don_chua_thuoc?.map((med: any) => ({
          id: med.id,
          name: med.ten_thuoc,
          unit: med.don_vi,
          quantity: med.tong_so,
        })) ?? [],
    };

    return result;
  } catch (error) {
    console.error("Error fetching diagnosis detail:", error);
    throw error;
  }
};

export const fetchMedicineSchedule = async (
  patientId: string,
  startDate: string,
  endDate: string
): Promise<MedicineSchedule[]> => {
  try {
    console.log(
      `${API_BASE_URL}/api/diagnosis/medicine_schedule?ptID=${patientId}&startDate=${startDate}&endDate=${endDate}`
    );
    const res = await fetch(
      `${API_BASE_URL}/api/diagnosis/medicine_schedule?ptID=${patientId}&startDate=${startDate}&endDate=${endDate}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch medicine schedule");
    }

    const data = await res.json();

    const mappedData: MedicineSchedule[] = data.map((item: any) => ({
      id: item.id,
      diagnosisResultId: item.id_ket_qua,
      startDate: item.ngay_bat_dau,
      endDate: item.ngay_ket_thuc,
      status: item.trang_thai,
      note: item.ghi_chu,
      prescriptionName: item.ten_don_thuoc,
      patientId: item.ma_benh_nhan,
      intakes: item.Lan_uong.map(
        (intake: any): MedicineIntake => ({
          id: intake.id,
          time: intake.gio,
          date: intake.ngay,
          prescriptionId: intake.don_thuoc,
          reminder: intake.nhac_nho,
          takenAt: intake.thoi_diem_da_uong,
          period: intake.buoi_uong,
        })
      ),
    }));

    return mappedData;
  } catch (error) {
    console.error("Error fetching medicine schedule:", error);
    return [];
  }
};

export const updateTakenTime = async (
  scheduleId: number,
  isoDateTime: string
) => {
  try {
    const date = new Date(isoDateTime);
    const newTime = date.toTimeString().split(" ")[0]; // Chuyển về "HH:mm:ss"
    console.log("Thay đổi thời gian uống thuốc", newTime);

    const response = await fetch(
      `${API_BASE_URL}/api/diagnosis/medicine_schedule/${scheduleId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newTime }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Lỗi khi cập nhật lịch uống thuốc");
    }

    const resData = await response.json();
    return resData;
  } catch (error) {
    console.error("Lỗi khi gọi API updateMedicineSchedule:", error);
  }
};

export const toggleMedicineSchedule = async (scheduleId: number) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/diagnosis/medicine_schedule/toggle/${scheduleId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Lỗi khi toggle trạng thái thuốc");
    }

    const resData = await response.json();

    return resData.thoi_diem_da_uong;
  } catch (error) {
    console.error("Lỗi khi gọi API toggleMedicineSchedule:", error);
    throw error;
  }
};
