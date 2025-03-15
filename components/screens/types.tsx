// Interface định nghĩa dữ liệu bác sĩ
export interface Doctor {
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  image: any;
}

// Danh sách bác sĩ (một mảng dữ liệu mẫu)
export const doctorlist: Doctor[] = [
  {
    name: "Jessica",
    specialty: "Chuyên khoa nội",
    hospital: "Bệnh viện Bạch Mai",
    rating: 4.5,
    reviews: 100,
    image: require("../../assets/doctor_picture/jessica.png"),
  },
  {
    name: "Sarah",
    specialty: "Chuyên khoa tim mạch",
    hospital: "Bệnh viện Chợ Rẫy",
    rating: 4.8,
    reviews: 150,
    image: require("../../assets/doctor_picture/sarah.png"),
  },
  {
    name: "Michael",
    specialty: "Chuyên khoa nội",
    hospital: "Bệnh viện Bạch Mai",
    rating: 4.5,
    reviews: 100,
    image: require("../../assets/doctor_picture/michael.png"),
  },
];

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  image: any;
}
export const appointments = [
  {
    id: "1",
    doctor: "Jessica",
    specialty: "Ngoại khoa",
    hospital: "BV Hùng Vương",
    date: "24/10/2024",
    time: "10:00 AM",
    image: require("../../assets/doctor_picture/sarah.png"),
  },
  {
    id: "2",
    doctor: "Sarah",
    specialty: "Ngoại khoa",
    hospital: "BV Hùng Vương",
    date: "24/10/2024",
    time: "10:00 AM",
    image: require("../../assets/doctor_picture/sarah.png"),
  },
  {
    id: "3",
    doctor: "Michael",
    specialty: "Ngoại khoa",
    hospital: "BV Hùng Vương",
    date: "24/10/2024",
    time: "10:00 AM",
    image: require("../../assets/doctor_picture/sarah.png"),
  },
];
