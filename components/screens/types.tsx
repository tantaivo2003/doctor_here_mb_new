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
const doctors: Doctor[] = [
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

export default doctors;
