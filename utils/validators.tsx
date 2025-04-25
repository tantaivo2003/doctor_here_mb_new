export const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
export const isValidPhone = (phone: string) => /^(0|\+84)\d{9}$/.test(phone);
export const isValidCCCD = (cccd: string) => /^\d{9,12}$/.test(cccd);
import { InsuranceInfo } from "../types/types";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateInsuranceInfo = (
  info: InsuranceInfo
): ValidationResult => {
  if (!info.medicalHistory || info.medicalHistory.trim() === "") {
    return { isValid: false, message: "Vui lòng nhập tiền sử bệnh." };
  }

  if (!info.bloodType || info.bloodType.trim() === "") {
    return { isValid: false, message: "Vui lòng nhập nhóm máu." };
  }

  if (!info.insuranceCode || info.insuranceCode.trim() === "") {
    return { isValid: false, message: "Vui lòng nhập mã BHYT." };
  }

  if (!info.registeredHospital || info.registeredHospital.trim() === "") {
    return { isValid: false, message: "Vui lòng nhập bệnh viện đăng ký." };
  }

  if (!info.issuedDate || isNaN(Date.parse(info.issuedDate))) {
    return { isValid: false, message: "Ngày cấp không hợp lệ." };
  }

  if (!info.expiredDate || isNaN(Date.parse(info.expiredDate))) {
    return { isValid: false, message: "Ngày hết hạn không hợp lệ." };
  }

  if (new Date(info.issuedDate) > new Date(info.expiredDate)) {
    return {
      isValid: false,
      message: "Ngày cấp không được sau ngày hết hạn.",
    };
  }

  return { isValid: true };
};

export const convertOptionToInterval = (
  option: string
): "DAYS" | "WEEKS" | "MONTHS" | "YEARS" => {
  switch (option) {
    case "Ngày":
      return "DAYS";
    case "Tuần":
      return "WEEKS";
    case "Tháng":
      return "MONTHS";
    case "Năm":
      return "YEARS";
    default:
      return "WEEKS"; // fallback
  }
};
