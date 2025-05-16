import moment from "moment";
import { fetchHealthRecords } from "./readHealthRecords";

export const groupHealthRecordsByPeriod = (
  records: { date: string; value: number }[],
  periodType: "DAYS" | "WEEKS" | "MONTHS" | "YEARS",
  recordType:
    | "Height"
    | "Weight"
    | "BloodPressure"
    | "HeartRate"
    | "RespiratoryRate"
): { date: string; value: number }[] => {
  const groupedMap: { [key: string]: number[] } = {};

  records.forEach((record) => {
    const m = moment(record.date);
    let key = "";

    switch (periodType) {
      case "DAYS":
        key = m.format("DD/MM");
        break;
      case "WEEKS":
        key = m.format("[W]WW/YYYY");
        break;
      case "MONTHS":
        key = m.format("MM");
        break;
      case "YEARS":
        key = m.format("YYYY");
        break;
    }

    // Áp dụng logic loại bỏ bất thường thông minh
    const isHeightTooSmall = recordType === "Height" && record.value < 0.5;
    const isWeightTooSmall = recordType === "Weight" && record.value < 10;
    if (isHeightTooSmall || isWeightTooSmall) return;

    // Nhóm lại để tính trung bình và đánh giá dao động sau
    if (!groupedMap[key]) {
      groupedMap[key] = [];
    }
    groupedMap[key].push(record.value);
  });

  const groupedResult: { date: string; value: number }[] = [];

  for (const [date, values] of Object.entries(groupedMap)) {
    if (!Array.isArray(values) || values.length === 0) continue;

    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

    // Xác định ngưỡng dao động cho Height/Weight theo period
    const getThreshold = () => {
      if (recordType === "Height") {
        if (periodType === "DAYS" || periodType === "WEEKS") return 0.02; // 2cm
        if (periodType === "MONTHS") return 0.05; // 5cm
        if (periodType === "YEARS") return 0.1; // 10cm
      }
      if (recordType === "Weight") {
        if (periodType === "DAYS") return 1; // 1kg
        if (periodType === "WEEKS") return 2; // 2kg
        if (periodType === "MONTHS") return 5;
        if (periodType === "YEARS") return 10;
      }
      return Infinity; // không lọc các loại khác
    };

    const threshold = getThreshold();

    // Loại bỏ các giá trị lệch quá mức cho phép
    const filteredValues =
      recordType === "Height" || recordType === "Weight"
        ? values.filter((v) => Math.abs(v - avg) <= threshold)
        : values;

    if (filteredValues.length > 0) {
      const finalAvg =
        filteredValues.reduce((sum, v) => sum + v, 0) / filteredValues.length;
      groupedResult.push({ date, value: finalAvg });
    }
  }

  return groupedResult;
};

export const fetchAndGroupHealthRecords = async (
  recordType:
    | "Height"
    | "Weight"
    | "BloodPressure"
    | "HeartRate"
    | "RespiratoryRate",
  startTimeISO: string,
  endTimeISO: string,
  periodType: "DAYS" | "WEEKS" | "MONTHS" | "YEARS",
  isDiastolic?: boolean,
  isSystolic?: boolean
): Promise<{ date: string; value: number }[] | null> => {
  try {
    const rawRecords = await fetchHealthRecords(
      recordType,
      startTimeISO,
      endTimeISO,
      isDiastolic,
      isSystolic
    );
    if (!rawRecords) return null;

    const groupedRecords = groupHealthRecordsByPeriod(
      rawRecords,
      periodType,
      recordType
    );
    return groupedRecords;
  } catch (error) {
    console.error("❌ Lỗi khi fetch và group dữ liệu:", error);
    return null;
  }
};
