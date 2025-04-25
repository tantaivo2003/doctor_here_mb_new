// Interface định nghĩa dữ liệu bác sĩ
export interface Doctor {
  id: string;
  doctorCode?: string;
  image: any;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  experience: number;
  education?: string;
  description?: string;
  clinicAddress?: string;
  phone?: string;
  email?: string;
  gender?: string;
  birthDate?: string;
  accountStatus?: boolean;
  joinedDate?: string;
}

// Danh sách bác sĩ (một mảng dữ liệu mẫu)
export const doctorlist: Doctor[] = [
  {
    id: "1",
    name: "Jessica",
    specialty: "Chuyên khoa nội",
    hospital: "Bệnh viện Bạch Mai",
    rating: 4.5,
    reviews: 100,
    experience: 10,
    description: "Bác sĩ chuyên khoa nội",
    image: require("../assets/doctor_picture/jessica.png"),
  },
  {
    id: "2",
    name: "Sarah",
    specialty: "Chuyên khoa tim mạch",
    hospital: "Bệnh viện Chợ Rẫy",
    rating: 4.8,
    reviews: 150,
    experience: 15,
    image: require("../assets/doctor_picture/sarah.png"),
  },
  {
    id: "3",
    name: "Michael",
    specialty: "Chuyên khoa nội",
    hospital: "Bệnh viện Bạch Mai",
    rating: 4.5,
    reviews: 100,
    experience: 10,
    image: require("../assets/doctor_picture/michael.png"),
  },
];

export interface Appointment {
  id?: string;
  doctor: string; // Tên bác sĩ
  specialty: string; // Chuyên khoa
  hospital: string; // Địa chỉ phòng khám
  date: string; // Ngày hẹn
  startTime: string; // Thời điểm bắt đầu
  endTime: string; // Thời điểm kết thúc
  isOnline: boolean; // Lịch làm việc online hay không
  image?: any; // Ảnh đại diện của bác sĩ
  ratingScore?: number;
  ratingContent?: string;
  ratingTime?: string;
}

export interface AppointmentRating {
  diem_danh_gia: number;
  noi_dung: string;
  thoi_diem: string;
}

export interface AppointmentDetail {
  id: number;
  additionalText: string; // Văn bản bổ sung
  clinicAddress: string;
  status: string;
  createdAt: string;
  doctorId: string;
  patientId: string;

  patientName: string;
  patientPhone: string;
  patientGender: string;
  patientBirthDate: string;
  patientAddress: string;
  patientCCCD: string;
  patientEthnicity: string;
  patientBloodType: string;
  patientMedicalHistory: string;
  patientNationality: string;
  patientAvatarUrl: any;

  doctorName: string;
  doctorPhone: string;
  doctorGender: string;
  doctorBirthDate: string;
  doctorSpecialty: string;
  doctorEducation: string;
  doctorDescription: string;
  doctorExperienceDate: string;
  doctorAvatarUrl: any;

  appointmentStart: string;
  appointmentEnd: string;
  workDate: string;
  isOnline: boolean;

  images: any;

  rating?: AppointmentRating;
}

export const mockAppointmentDetail: AppointmentDetail = {
  id: 1,
  additionalText: "Patient suffers from headache and dizziness",
  clinicAddress: "Clinic B, District 2",
  status: "Completed",
  createdAt: "2025-01-01T03:00:00.000Z",
  doctorId: "BS0000001",
  patientId: "BN0000006",

  patientName: "Nguyễn Thị Hiền",
  patientPhone: "0123456888",
  patientGender: "Female",
  patientBirthDate: "1995-01-15",
  patientAddress: "20 B Street, District 2, HCMC",
  patientCCCD: "3131812717281",
  patientEthnicity: "Tày",
  patientBloodType: "AB",
  patientMedicalHistory: "Type 2 diabetes",
  patientNationality: "Vietnamese",
  patientAvatarUrl: null,

  doctorName: "Nguyễn Trung Hiếu",
  doctorPhone: "0123456785",
  doctorGender: "Female",
  doctorBirthDate: "1985-01-05",
  doctorSpecialty: "General Medicine",
  doctorEducation: "Level 5 education",
  doctorDescription: "Highly rated by patients",
  doctorExperienceDate: "2010-09-22",
  doctorAvatarUrl: null,

  appointmentStart: "2025-01-02T02:15:00.000Z",
  appointmentEnd: "2025-01-02T02:30:00.000Z",
  workDate: "2025-01-02",
  isOnline: false,

  images: [
    "https://benhviendakhoasontay.vn/wp-content/uploads/2022/07/xem-ket-qua.png",
  ],
};

export interface Chat {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: any;
  unreadCount: number;
  isOnline: boolean;
}

// Danh sách tin nhắn giả lập
export const chatList: Chat[] = [
  {
    id: 1,
    name: "BS. Trung Hiếu",
    message: "Xin chào",
    time: "04:20 AM",
    avatar: require("../assets/doctor_picture/sarah.png"),
    unreadCount: 3,
    isOnline: true,
  },
  {
    id: 2,
    name: "BS. Như Ý",
    message: "Bạn có gì muốn tư vấn?",
    time: "04:20 AM",
    avatar: require("../assets/doctor_picture/jessica.png"),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 3,
    name: "BS. Trung Thành",
    message: "Tôi sẽ hỗ trợ bạn",
    time: "04:20 AM",
    avatar: require("../assets/doctor_picture/michael.png"),
    unreadCount: 0,
    isOnline: true,
  },
];

export interface Message {
  id: number;
  sender: string;
  type: string;
  content: string | string[]; // Nếu là hình ảnh thì là mảng URL
  timestamp: string;
}
export const messagesList: Message[] = [
  {
    id: 1,
    sender: "doctor",
    type: "text",
    content: "Xin chào",
    timestamp: "07:21",
  },
  {
    id: 2,
    sender: "user",
    type: "text",
    content: "Chào bác sĩ",
    timestamp: "07:21",
  },
  {
    id: 3,
    sender: "user",
    type: "audio",
    content: "audio_file_url",
    timestamp: "07:21",
  },
  {
    id: 4,
    sender: "doctor",
    type: "image",
    content: ["image1_url", "image2_url"],
    timestamp: "09:12",
  },
];

export interface LanUong {
  id: string;
  gio: string;
  ten_thuoc: string;
  ghi_chu: string;
  image: any;
  trang_thai: "pending" | "taken";
}

export const listLanUong: LanUong[] = [
  {
    id: "1",
    gio: "6h30",
    ten_thuoc: "Thuốc đau đầu",
    ghi_chu: "Thuốc đau đầu",
    image: require("../assets/medicine.png"),
    trang_thai: "taken",
  },
  {
    id: "2",
    gio: "12h30",
    ten_thuoc: "Thuốc đau đầu",
    ghi_chu: "Thuốc đau đầu",
    image: require("../assets/medicine.png"),
    trang_thai: "pending",
  },
  {
    id: "3",
    gio: "19h30",
    ten_thuoc: "Thuốc đau đầu",
    ghi_chu: "Thuốc đau lưng",
    image: require("../assets/medicine.png"),
    trang_thai: "pending",
  },
];

export interface MedicineIntake {
  id: number;
  time: string; // gio
  date: string; // ngay
  prescriptionId: number; // don_thuoc
  reminder: boolean; // nhac_nho
  takenAt: string | null; // thoi_diem_da_uong
  period: string; // buoi_uong
}

export interface MedicineSchedule {
  id: number;
  diagnosisResultId: number; // id_ket_qua
  startDate: string; // ngay_bat_dau
  endDate: string; // ngay_ket_thuc
  status: string; // trang_thai
  note: string; // ghi_chu
  prescriptionName: string; // ten_don_thuoc
  patientId: string; // ma_benh_nhan
  intakes: MedicineIntake[]; // Lan_uong
}

export interface Rating {
  id: number;
  score: number;
  content: string;
  timestamp: string;
  appointmentId: number;
  patient: {
    id: string;
    name: string;
    avatar: any;
  };
}

export const mockRatings: Rating[] = [
  {
    id: 1,
    score: 4.5,
    content: "Bác sĩ rất tận tâm và chuyên nghiệp!",
    timestamp: "2025-03-17T05:22:19.121Z",
    appointmentId: 10,
    patient: {
      id: "BN0000006",
      name: "Nguyễn Thị Hiền",
      avatar: require("../assets/doctor_picture/jessica.png"),
    },
  },
  {
    id: 2,
    score: 5.0,
    content: "Tôi rất hài lòng với dịch vụ.",
    timestamp: "2025-03-18T10:45:30.121Z",
    appointmentId: 11,
    patient: {
      id: "BN0000010",
      name: "Trần Văn Nam",
      avatar: require("../assets/avatar-placeholder.png"),
    },
  },
  {
    id: 3,
    score: 3.5,
    content: "Bác sĩ tận tâm nhưng thời gian chờ hơi lâu.",
    timestamp: "2025-03-19T08:30:00.121Z",
    appointmentId: 12,
    patient: {
      id: "BN0000020",
      name: "Lê Thị Hoa",
      avatar: require("../assets/avatar-placeholder.png"),
    },
  },
  {
    id: 4,
    score: 4.0,
    content: "Tư vấn rất chi tiết, dễ hiểu.",
    timestamp: "2025-03-20T15:15:45.121Z",
    appointmentId: 13,
    patient: {
      id: "BN0000035",
      name: "Hoàng Minh Đức",
      avatar: require("../assets/avatar-placeholder.png"),
    },
  },
  {
    id: 5,
    score: 2.5,
    content: "Bác sĩ khá bận, tôi cảm thấy chưa được tư vấn kỹ.",
    timestamp: "2025-03-21T12:00:10.121Z",
    appointmentId: 14,
    patient: {
      id: "BN0000040",
      name: "Phạm Thị Lan",
      avatar: require("../assets/avatar-placeholder.png"),
    },
  },
];

export interface GioHen {
  id: number;
  thoi_diem_bat_dau: string;
  thoi_diem_ket_thuc: string;
}

export interface LichNgay {
  thu: string;
  ngay_lam_viec: string;
  Gio_hen: GioHen[];
}

export interface Patient {
  id: number;
  patientCode: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  avatarUrl: string;
  cccd?: string;

  address?: string;
  nationality?: string;
  ethnicity?: string;
  bloodType?: string;
  medicalHistory?: string;

  insurance?: {
    insuranceCode: string;
    registeredHospital: string;
    issueDate: string;
    expiryDate: string;
  };

  accountStatus?: boolean;
  joinedDate?: string;
}

export interface InsuranceInfo {
  medicalHistory: string; // tiền_sử_bệnh
  bloodType: string; // nhóm_máu
  insuranceCode: string; // mã_bhyt
  registeredHospital: string; // bv_đăng_ký
  issuedDate: string; // ngày_cấp
  expiredDate: string; // ngày_hết_hạn
}

export interface DiagnosisResult {
  id: number;
  diagnosisResult: string;
  additionalNotes: string;
  appointmentId: number;
  doctorId: string;
  clinicAddress: string;
  startTime: string;
  endTime: string;
  department: string;
  doctorName: string;
  doctorAvatarUrl: string;
}

export interface DiagnosisDetail {
  id: number;
  diagnosisResult: string;
  additionalNote: string;
  appointmentId: number;
  doctorId: string;
  clinicAddress: string;
  startTime: string;
  endTime: string;
  doctorFullName: string;
  doctorAvatarUrl: string;
  doctorSpecialty: string;
  images: string[];
  prescriptionId: number | null;
  prescriptionStartDate: string | null;
  prescriptionEndDate: string | null;
  prescriptionNote: string | null;
  medicines: {
    id: number;
    name: string;
    unit: string;
    quantity: number;
  }[];
}

// types/familyTypes.ts

export interface FamilyMember {
  ma_benh_nhan_2: string;
  ten_dang_nhap: string;
  email: string;
  sdt: string;
  ngay_sinh: string;
  gioi_tinh: string;
  phan_loai: string;
  ho_va_ten: string;
  avt_url: string;
  than_phan: string;
}

export const familyMembers: FamilyMember[] = [
  {
    ma_benh_nhan_2: "BN0000006",
    ten_dang_nhap: "voanh123",
    email: "voanh@gmail.com",
    sdt: "0909123456",
    ngay_sinh: "1990-05-15",
    gioi_tinh: "Nữ",
    phan_loai: "Người thân",
    ho_va_ten: "Võ Ánh",
    avt_url: "https://randomuser.me/api/portraits/women/1.jpg",
    than_phan: "Vợ",
  },
  {
    ma_benh_nhan_2: "BN0000007",
    ten_dang_nhap: "conga123",
    email: "conga@gmail.com",
    sdt: "0909123457",
    ngay_sinh: "2010-08-21",
    gioi_tinh: "Nam",
    phan_loai: "Người thân",
    ho_va_ten: "Công A",
    avt_url: "https://randomuser.me/api/portraits/men/2.jpg",
    than_phan: "Con trai",
  },
  {
    ma_benh_nhan_2: "BN0000008",
    ten_dang_nhap: "meanh123",
    email: "meanh@gmail.com",
    sdt: "0909123458",
    ngay_sinh: "1965-03-01",
    gioi_tinh: "Nữ",
    phan_loai: "Người thân",
    ho_va_ten: "Nguyễn Thị B",
    avt_url: "",
    than_phan: "Mẹ",
  },
];

export interface PendingInvite {
  than_phan: string;
  ma_benh_nhan_1: string;
  ho_va_ten: string;
  sdt: string;
  avt_url: string; // Link ảnh đại diện (Có thể null)
}
export const mockPendingInvites: PendingInvite[] = [
  {
    than_phan: "Con",
    ma_benh_nhan_1: "BN001",
    ho_va_ten: "Nguyễn Văn A",
    sdt: "0901234567",
    avt_url: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    than_phan: "Vợ",
    ma_benh_nhan_1: "BN002",
    ho_va_ten: "Trần Thị B",
    sdt: "0912345678",
    avt_url: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    than_phan: "Chồng",
    ma_benh_nhan_1: "BN003",
    ho_va_ten: "Lê Văn C",
    sdt: "0987654321",
    avt_url: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    than_phan: "Anh trai",
    ma_benh_nhan_1: "BN004",
    ho_va_ten: "Phạm Văn D",
    sdt: "0922334455",
    avt_url: "https://randomuser.me/api/portraits/men/4.jpg",
  },
];

export interface HealthRecord {
  date: string;
  value: number;
}

export interface HeightRecord {
  date: string; // Ngày ghi nhận
  heightInMeters: number; // Chiều cao (cm)
}

export interface WeightRecord {
  date: string; // Ngày ghi nhận
  weightInKilograms: number; // Cân nặng (kg)
}
