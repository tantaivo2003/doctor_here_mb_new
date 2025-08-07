const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

import { Patient, InsuranceInfo } from "../types/types";
import { getUserID } from "../services/storage";

// API tạo hồ sơ bệnh nhân
export const createPatientProfile = async (data: {
  username: string;
  fullname: string;
  address: string;
  phone: string;
  birthday: string; // dạng 'YYYY-MM-DD'
  gender: string;
  avt_url: string | null;
}) => {
  console.log("Dữ liệu gửi lên:", data); // Log dữ liệu để kiểm tra
  const response = await fetch(`${API_BASE_URL}/api/patient/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Lỗi tạo hồ sơ: ${error.message}`);
  }

  return await response.json(); // trả về { id, dia_chi, ma_benh_nhan }
};

// API upload ảnh đại diện
export const uploadAvatar = async (
  uri: string,
  fileName: string,
  folderName: string = "avatar"
) => {
  const formData = new FormData();

  const fileType = uri.split(".").pop();

  formData.append("files", {
    uri,
    name: fileName,
    type: `image/${fileType}`,
  } as any); // `as any` do RN không có định nghĩa rõ cho FormData phần file

  formData.append("folderName", folderName);

  const response = await fetch(`${API_BASE_URL}/api/cloud/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Lỗi upload ảnh: ${error}`);
  }

  return await response.json();
};

export const fetchPatientDetail = async (): Promise<Patient | null> => {
  try {
    const userId = await getUserID();
    const response = await fetch(
      `${API_BASE_URL}/api/patient/detail/${userId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const patient: Patient = {
      id: data.id,
      patientCode: data.ma_benh_nhan,
      fullName: data.Nguoi_dung.ho_va_ten,
      email: data.Nguoi_dung.email,
      phone: data.Nguoi_dung.sdt,
      gender: data.Nguoi_dung.gioi_tinh.trim(),
      birthDate: data.Nguoi_dung.ngay_sinh,
      avatarUrl: data.Nguoi_dung.avt_url,
      cccd: data.cccd,

      address: data.dia_chi,
      nationality: data.quoc_tich,
      ethnicity: data.dan_toc,
      bloodType: data.nhom_mau,
      medicalHistory: data.tien_su_benh,

      insurance: data.Bao_hiem_y_te
        ? {
            insuranceCode: data.Bao_hiem_y_te.ma_bhyt,
            registeredHospital: data.Bao_hiem_y_te.bv_dang_ky,
            issueDate: data.Bao_hiem_y_te.ngay_cap,
            expiryDate: data.Bao_hiem_y_te.ngay_het_han,
          }
        : undefined,

      accountStatus: data.Nguoi_dung.Tai_khoan.active,
      joinedDate: data.Nguoi_dung.Tai_khoan.thoi_diem_mo_tk,
    };

    return patient;
  } catch (error) {
    // console.error("Lỗi khi fetch chi tiết bệnh nhân:", error);
    return null;
  }
};

export const fetchInsuranceInfo = async (
  patientId: string
): Promise<InsuranceInfo> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/patient/insurance/${patientId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch insurance info");
    }

    const data = await response.json();

    return {
      medicalHistory: data.tien_su_benh,
      bloodType: data.nhom_mau,
      insuranceCode: data.ma_bhyt,
      registeredHospital: data.bv_dang_ky,
      issuedDate: data.ngay_cap,
      expiredDate: data.ngay_het_han,
    };
  } catch (error) {
    // console.error("Error fetching insurance info:", error);
    throw error;
  }
};

interface UpdatePatientPayload {
  ho_va_ten: string;
  avt_url: string;
  cccd: string;
  dan_toc: string;
  quoc_tich: string;
  dia_chi: string;
  email: string;
  sdt: string;
  ngay_sinh: string;
  gioi_tinh: string;
}

export const updatePatientDetail = async (
  ptID: string,
  payload: UpdatePatientPayload
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/patient/userDetail/${ptID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      // console.error("Update failed:", errorData);
      throw new Error(errorData?.message || "Cập nhật thất bại");
    }

    return await response.json();
  } catch (error: any) {
    // console.error("Update patient detail error:", error.message);
    throw error;
  }
};

export const updateInsuranceInfo = async (
  ptID: string,
  payload: {
    ten_bao_hiem: string;
    so_the_bhyt: string;
    ngay_cap: string;
    ngay_het_han: string;
    tien_su_benh: string;
    nhom_mau: string;
  }
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/patient/insurance/${ptID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      // console.error("Lỗi từ server:", errorData);
      throw new Error("Cập nhật thông tin bảo hiểm thất bại.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

export const getShareAllStatus = async (patientID: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/diagnosis/share_all/patient/${patientID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Lỗi khi lấy dữ liệu chia sẻ: ${error.message}`);
    }

    const data = await response.json();
    return data.chia_se_kq_cho_tat_ca; // chỉ trả về true / false
  } catch (error) {
    throw error;
  }
};

export const updateShareAllStatus = async (
  patientID: string,
  newState: boolean
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/diagnosis/share_all/patient/${patientID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newState }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Lỗi cập nhật chia sẻ: ${error.message}`);
    }

    const data = await response.json();
    return data; // tùy vào backend trả về gì, có thể trả về object hoặc chỉ status
  } catch (error) {
    // console.error("Lỗi cập nhật trạng thái chia sẻ:", error);
    throw error;
  }
};
