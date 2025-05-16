const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
import { HealthRecord, BloodPressureHealthRecord } from "../types/types";
import { calculateBMI } from "../utils/calHealthMetrics";

type HealthTimeType = "daily" | "monthly" | "yearly";

export const fetchBMIData = async (
  ptID: string,
  type: HealthTimeType,
  startDate: Date,
  endDate: Date
): Promise<HealthRecord[]> => {
  const endpoint = `${API_BASE_URL}/api/tracker/bmi/${type}/${ptID}`;
  let queryParams = "";

  const format = (date: Date, type: HealthTimeType): string => {
    switch (type) {
      case "daily":
        return date.toISOString().slice(0, 10);
      case "monthly":
        return date.toISOString().slice(0, 7);
      case "yearly":
        return date.getFullYear().toString();
      default:
        return "";
    }
  };

  if (type === "daily") {
    queryParams = `?startDate=${format(startDate, type)}&endDate=${format(
      endDate,
      type
    )}`;
  } else if (type === "monthly") {
    queryParams = `?startMonth=${format(startDate, type)}&endMonth=${format(
      endDate,
      type
    )}`;
  } else if (type === "yearly") {
    queryParams = `?startYear=${format(startDate, type)}&endYear=${format(
      endDate,
      type
    )}`;
  }

  try {
    const response = await fetch(`${endpoint}${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // 🔁 Chuyển đổi BMIRecord[] → HealthRecord[]
    const bmiRecords: HealthRecord[] = data.map((item: any) => {
      const heightInMeters = item.trung_binh_chieu_cao / 100;
      const bmi = calculateBMI(heightInMeters, item.trung_binh_can_nang);

      return {
        date: item.thoi_diem_ghi_nhan,
        value: bmi,
      };
    });

    return bmiRecords;
  } catch (error) {
    console.error("Lỗi khi gọi API BMI:", error);
    throw error;
  }
};

export const fetchHeightData = async (
  ptID: string,
  type: HealthTimeType,
  startDate: Date,
  endDate: Date
): Promise<HealthRecord[]> => {
  const endpoint = `${API_BASE_URL}/api/tracker/height/${type}/${ptID}`;
  let queryParams = "";

  const format = (date: Date, type: HealthTimeType): string => {
    switch (type) {
      case "daily":
        return date.toISOString().slice(0, 10);
      case "monthly":
        return date.toISOString().slice(0, 7);
      case "yearly":
        return date.getFullYear().toString();
      default:
        return "";
    }
  };

  if (type === "daily") {
    queryParams = `?startDate=${format(startDate, type)}&endDate=${format(
      endDate,
      type
    )}`;
  } else if (type === "monthly") {
    queryParams = `?startMonth=${format(startDate, type)}&endMonth=${format(
      endDate,
      type
    )}`;
  } else if (type === "yearly") {
    queryParams = `?startYear=${format(startDate, type)}&endYear=${format(
      endDate,
      type
    )}`;
  }

  try {
    const response = await fetch(`${endpoint}${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const heartRateRecords: HealthRecord[] = data.map((item: any) => ({
      date: item.thoi_diem_ghi_nhan,
      value: item.trung_binh_chieu_cao,
    }));

    return heartRateRecords;
  } catch (error) {
    console.error("Lỗi khi gọi API nhịp tim:", error);
    throw error;
  }
};

export const fetchWeightData = async (
  ptID: string,
  type: HealthTimeType,
  startDate: Date,
  endDate: Date
): Promise<HealthRecord[]> => {
  const endpoint = `${API_BASE_URL}/api/tracker/weight/${type}/${ptID}`;
  let queryParams = "";

  const format = (date: Date, type: HealthTimeType): string => {
    switch (type) {
      case "daily":
        return date.toISOString().slice(0, 10);
      case "monthly":
        return date.toISOString().slice(0, 7);
      case "yearly":
        return date.getFullYear().toString();
      default:
        return "";
    }
  };

  if (type === "daily") {
    queryParams = `?startDate=${format(startDate, type)}&endDate=${format(
      endDate,
      type
    )}`;
  } else if (type === "monthly") {
    queryParams = `?startMonth=${format(startDate, type)}&endMonth=${format(
      endDate,
      type
    )}`;
  } else if (type === "yearly") {
    queryParams = `?startYear=${format(startDate, type)}&endYear=${format(
      endDate,
      type
    )}`;
  }

  try {
    const response = await fetch(`${endpoint}${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const heartRateRecords: HealthRecord[] = data.map((item: any) => ({
      date: item.thoi_diem_ghi_nhan,
      value: item.trung_binh_can_nang,
    }));

    return heartRateRecords;
  } catch (error) {
    console.error("Lỗi khi gọi API nhịp tim:", error);
    throw error;
  }
};

export const fetchBloodPressureData = async (
  ptID: string,
  type: HealthTimeType,
  startDate: Date,
  endDate: Date
): Promise<BloodPressureHealthRecord[]> => {
  const endpoint = `${API_BASE_URL}/api/tracker/blood_pressure/${type}/${ptID}`;
  let queryParams = "";

  const format = (date: Date, type: HealthTimeType): string => {
    switch (type) {
      case "daily":
        return date.toISOString().slice(0, 10);
      case "monthly":
        return date.toISOString().slice(0, 7);
      case "yearly":
        return date.getFullYear().toString();
      default:
        return "";
    }
  };

  if (type === "daily") {
    queryParams = `?startDate=${format(startDate, type)}&endDate=${format(
      endDate,
      type
    )}`;
  } else if (type === "monthly") {
    queryParams = `?startMonth=${format(startDate, type)}&endMonth=${format(
      endDate,
      type
    )}`;
  } else if (type === "yearly") {
    queryParams = `?startYear=${format(startDate, type)}&endYear=${format(
      endDate,
      type
    )}`;
  }

  try {
    const response = await fetch(`${endpoint}${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const bpRecords: BloodPressureHealthRecord[] = data.map((item: any) => ({
      date: item.thoi_diem_ghi_nhan,
      systolic: item.trung_binh_huyet_ap_tam_thu,
      diastolic: item.trung_binh_huyet_ap_tam_truong,
    }));

    return bpRecords;
  } catch (error) {
    console.error("Lỗi khi gọi API huyết áp:", error);
    throw error;
  }
};

export const fetchHeartRateData = async (
  ptID: string,
  type: HealthTimeType,
  startDate: Date,
  endDate: Date
): Promise<HealthRecord[]> => {
  const endpoint = `${API_BASE_URL}/api/tracker/heartbeat/${type}/${ptID}`;
  let queryParams = "";

  const format = (date: Date, type: HealthTimeType): string => {
    switch (type) {
      case "daily":
        return date.toISOString().slice(0, 10);
      case "monthly":
        return date.toISOString().slice(0, 7);
      case "yearly":
        return date.getFullYear().toString();
      default:
        return "";
    }
  };

  if (type === "daily") {
    queryParams = `?startDate=${format(startDate, type)}&endDate=${format(
      endDate,
      type
    )}`;
  } else if (type === "monthly") {
    queryParams = `?startMonth=${format(startDate, type)}&endMonth=${format(
      endDate,
      type
    )}`;
  } else if (type === "yearly") {
    queryParams = `?startYear=${format(startDate, type)}&endYear=${format(
      endDate,
      type
    )}`;
  }

  try {
    const response = await fetch(`${endpoint}${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const heartRateRecords: HealthRecord[] = data.map((item: any) => ({
      date: item.thoi_diem_ghi_nhan,
      value: item.trung_binh_nhip_tim,
    }));

    return heartRateRecords;
  } catch (error) {
    console.error("Lỗi khi gọi API nhịp tim:", error);
    throw error;
  }
};

export const fetchBreathRateData = async (
  ptID: string,
  type: HealthTimeType,
  startDate: Date,
  endDate: Date
): Promise<HealthRecord[]> => {
  const endpoint = `${API_BASE_URL}/api/tracker/breath/${type}/${ptID}`;
  let queryParams = "";

  const format = (date: Date, type: HealthTimeType): string => {
    switch (type) {
      case "daily":
        return date.toISOString().slice(0, 10);
      case "monthly":
        return date.toISOString().slice(0, 7);
      case "yearly":
        return date.getFullYear().toString();
      default:
        return "";
    }
  };

  if (type === "daily") {
    queryParams = `?startDate=${format(startDate, type)}&endDate=${format(
      endDate,
      type
    )}`;
  } else if (type === "monthly") {
    queryParams = `?startMonth=${format(startDate, type)}&endMonth=${format(
      endDate,
      type
    )}`;
  } else if (type === "yearly") {
    queryParams = `?startYear=${format(startDate, type)}&endYear=${format(
      endDate,
      type
    )}`;
  }

  try {
    const response = await fetch(`${endpoint}${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const breathRateRecords: HealthRecord[] = data.map((item: any) => ({
      date: item.thoi_diem_ghi_nhan,
      value: item.trung_binh_nhip_tho,
    }));

    return breathRateRecords;
  } catch (error) {
    console.error("Lỗi khi gọi API nhịp thở:", error);
    throw error;
  }
};

export const fetchBloodGlucoseData = async (
  ptID: string,
  type: HealthTimeType,
  startDate: Date,
  endDate: Date
): Promise<HealthRecord[]> => {
  const endpoint = `${API_BASE_URL}/api/tracker/blood_sugar/${type}/${ptID}`;
  let queryParams = "";

  const format = (date: Date, type: HealthTimeType): string => {
    switch (type) {
      case "daily":
        return date.toISOString().slice(0, 10);
      case "monthly":
        return date.toISOString().slice(0, 7);
      case "yearly":
        return date.getFullYear().toString();
      default:
        return "";
    }
  };

  if (type === "daily") {
    queryParams = `?startDate=${format(startDate, type)}&endDate=${format(
      endDate,
      type
    )}`;
  } else if (type === "monthly") {
    queryParams = `?startMonth=${format(startDate, type)}&endMonth=${format(
      endDate,
      type
    )}`;
  } else if (type === "yearly") {
    queryParams = `?startYear=${format(startDate, type)}&endYear=${format(
      endDate,
      type
    )}`;
  }

  try {
    const response = await fetch(`${endpoint}${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const breathRateRecords: HealthRecord[] = data.map((item: any) => ({
      date: item.thoi_diem_ghi_nhan,
      value: item.trung_binh_duong_huyet,
    }));

    return breathRateRecords;
  } catch (error) {
    console.error("Lỗi khi gọi API đường huyết:", error);
    throw error;
  }
};
export const fetchBloodOxygenData = async (
  ptID: string,
  type: HealthTimeType,
  startDate: Date,
  endDate: Date
): Promise<HealthRecord[]> => {
  const endpoint = `${API_BASE_URL}/api/tracker/blood_oxygen/${type}/${ptID}`;
  let queryParams = "";

  const format = (date: Date, type: HealthTimeType): string => {
    switch (type) {
      case "daily":
        return date.toISOString().slice(0, 10);
      case "monthly":
        return date.toISOString().slice(0, 7);
      case "yearly":
        return date.getFullYear().toString();
      default:
        return "";
    }
  };

  if (type === "daily") {
    queryParams = `?startDate=${format(startDate, type)}&endDate=${format(
      endDate,
      type
    )}`;
  } else if (type === "monthly") {
    queryParams = `?startMonth=${format(startDate, type)}&endMonth=${format(
      endDate,
      type
    )}`;
  } else if (type === "yearly") {
    queryParams = `?startYear=${format(startDate, type)}&endYear=${format(
      endDate,
      type
    )}`;
  }

  try {
    const response = await fetch(`${endpoint}${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const breathRateRecords: HealthRecord[] = data.map((item: any) => ({
      date: item.thoi_diem_ghi_nhan,
      value: item.trung_binh_oxy_mau,
    }));

    return breathRateRecords;
  } catch (error) {
    console.error("Lỗi khi gọi API nhịp thở:", error);
    throw error;
  }
};
export const fetchStepsData = async (
  ptID: string,
  type: HealthTimeType,
  startDate: Date,
  endDate: Date
): Promise<HealthRecord[]> => {
  const endpoint = `${API_BASE_URL}/api/tracker/steps/${type}/${ptID}`;
  let queryParams = "";

  const format = (date: Date, type: HealthTimeType): string => {
    switch (type) {
      case "daily":
        return date.toISOString().slice(0, 10);
      case "monthly":
        return date.toISOString().slice(0, 7);
      case "yearly":
        return date.getFullYear().toString();
      default:
        return "";
    }
  };

  if (type === "daily") {
    queryParams = `?startDate=${format(startDate, type)}&endDate=${format(
      endDate,
      type
    )}`;
  } else if (type === "monthly") {
    queryParams = `?startMonth=${format(startDate, type)}&endMonth=${format(
      endDate,
      type
    )}`;
  } else if (type === "yearly") {
    queryParams = `?startYear=${format(startDate, type)}&endYear=${format(
      endDate,
      type
    )}`;
  }

  try {
    const response = await fetch(`${endpoint}${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const stepRecords: HealthRecord[] = data.map((item: any) => ({
      date: new Date(item.thoi_diem_ghi_nhan).toISOString().slice(0, 10),
      value: item.tong_so_buoc,
    }));

    return stepRecords;
  } catch (error) {
    console.error("Lỗi khi gọi API bước chân:", error);
    throw error;
  }
};

export const fetchDistanceData = async (
  ptID: string,
  type: HealthTimeType,
  startDate: Date,
  endDate: Date
): Promise<HealthRecord[]> => {
  const endpoint = `${API_BASE_URL}/api/tracker/distance/${type}/${ptID}`;
  let queryParams = "";

  const format = (date: Date, type: HealthTimeType): string => {
    switch (type) {
      case "daily":
        return date.toISOString().slice(0, 10);
      case "monthly":
        return date.toISOString().slice(0, 7);
      case "yearly":
        return date.getFullYear().toString();
      default:
        return "";
    }
  };

  if (type === "daily") {
    queryParams = `?startDate=${format(startDate, type)}&endDate=${format(
      endDate,
      type
    )}`;
  } else if (type === "monthly") {
    queryParams = `?startMonth=${format(startDate, type)}&endMonth=${format(
      endDate,
      type
    )}`;
  } else if (type === "yearly") {
    queryParams = `?startYear=${format(startDate, type)}&endYear=${format(
      endDate,
      type
    )}`;
  }

  try {
    const response = await fetch(`${endpoint}${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const distanceRecords: HealthRecord[] = data.map((item: any) => ({
      date: item.thoi_diem_ghi_nhan,
      value: item.tong_quang_duong,
    }));

    return distanceRecords;
  } catch (error) {
    console.error("Lỗi khi gọi API quãng đường:", error);
    throw error;
  }
};

export const fetchLatestHealthRecord = async (
  type:
    | "height"
    | "weight"
    | "bmi"
    | "heartbeat"
    | "breath"
    | "blood_pressure"
    | "blood_sugar"
    | "blood_oxygen",
  ptID: string
): Promise<
  HealthRecord[] | HealthRecord | BloodPressureHealthRecord | null
> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tracker/latest/${type}/${ptID}`
    );

    if (!response.ok) {
      throw new Error(`Lỗi khi gọi API: ${response.status}`);
    }

    const data = await response.json();

    switch (type) {
      case "bmi": {
        return [
          {
            date: data.thoi_diem_ghi_nhan,
            value: data.can_nang, // cân nặng
          },
          {
            date: data.thoi_diem_ghi_nhan,
            value: data.chieu_cao, // chiều cao
          },
        ] as HealthRecord[];
      }

      case "heartbeat":
      case "height":
      case "weight":
      case "breath":
      case "blood_sugar":
      case "blood_oxygen":
        return {
          date: data.thoi_diem_ghi_nhan,
          value: data.gia_tri,
        } as HealthRecord;

      case "blood_pressure":
        return {
          date: data.thoi_diem_ghi_nhan,
          systolic: data.huyet_ap_tam_thu,
          diastolic: data.huyet_ap_tam_truong,
        } as BloodPressureHealthRecord;

      default:
        console.warn("Loại dữ liệu không hỗ trợ:", type);
        return null;
    }
  } catch (error) {
    console.warn("Lỗi khi lấy dữ liệu mới nhất:", error);
    return null;
  }
};

export const postSimpleMetric = async (
  ptID: string,
  type:
    | "height"
    | "weight"
    | "steps"
    | "heartbeat"
    | "breath"
    | "distance"
    | "blood_sugar"
    | "blood_oxygen",
  value: number,
  timeStamp: string // "YYYY-MM-DD HH:mm"
) => {
  const url = `${API_BASE_URL}/api/tracker/${type}/${ptID}`;
  const body = {
    value,
    timeStamp,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Lỗi ${type}: ${res.status}`);
    }

    const result = await res.json();
    console.log(`✅ Gửi ${type} thành công:`, result);
    return result;
  } catch (err) {
    console.warn(`Dữ liệu đã tồn tại`, err);
  }
};

export const postBMI = async (
  ptID: string,
  weight: number,
  height: number,
  timeStamp: string
) => {
  const url = `${API_BASE_URL}/api/tracker/bmi/${ptID}`;
  const body = {
    data: { weight, height },
    timeStamp,
  };
  console.log("body", body);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Lỗi BMI: ${res.status}`);
    const result = await res.json();
    console.log("✅ Gửi BMI thành công:", result);
    return result;
  } catch (err) {
    console.error("❌ Lỗi gửi BMI:", err);
    throw err;
  }
};

export const postBloodPressure = async (
  ptID: string,
  systolic: number, // huyet_ap_tam_thu
  diastolic: number, // huyet_ap_tam_truong
  timeStamp: string
) => {
  const url = `${API_BASE_URL}/api/tracker/blood_pressure/${ptID}`;
  const body = {
    data: {
      huyet_ap_tam_thu: systolic,
      huyet_ap_tam_truong: diastolic,
    },
    timeStamp,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Lỗi huyết áp: ${res.status}`);
    const result = await res.json();
    console.log("✅ Gửi huyết áp thành công:", result);
    return result;
  } catch (err) {
    console.warn("Dữ liệu đã tồn tại", err);
    throw err;
  }
};

export const checkInitialSyncStatus = async (ptID: string) => {
  const url = `${API_BASE_URL}/api/tracker/sync/${ptID}`;

  try {
    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`Lỗi kiểm tra trạng thái đồng bộ: ${res.status}`);

    const result = await res.json();
    console.log("🔎 Trạng thái đồng bộ ban đầu:", result);
    return result?.dong_bo; // null nghĩa là chưa đồng bộ lần đầu
  } catch (err) {
    console.error("❌ Lỗi khi kiểm tra trạng thái đồng bộ:", err);
    throw err;
  }
};

export const updateInitialSyncStatus = async (
  ptID: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tracker/sync/${ptID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newSync: true }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`❌ Lỗi khi cập nhật trạng thái sync:`, errorText);
      return false;
    }

    console.log("✅ Đã cập nhật trạng thái sync ban đầu thành công");
    return true;
  } catch (error) {
    console.warn("❌ Exception khi cập nhật trạng thái sync:", error);
    return false;
  }
};
