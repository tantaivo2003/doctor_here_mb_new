import {
  readRecords,
  RecordType,
  AggregateResult,
} from "react-native-health-connect";
import { aggregateGroupByPeriod } from "react-native-health-connect";
import moment from "moment";

type PeriodType = "DAYS" | "WEEKS" | "MONTHS" | "YEARS";

interface ChartDataPoint {
  date: string;
  value: number;
}
const processHeightData = (records: any[]) =>
  records.map((record) => ({
    value: record.height.inMeters,
    date: record.time, // Lấy ngày từ `time`
  }));

const processWeightData = (records: any[]) =>
  records.map((record) => ({
    value: record.weight.inKilograms,
    date: record.time, // Lấy ngày từ `time`
  }));

const processBloodPressureData = (records: any[]) =>
  records.map((record) => ({
    systolic: record.systolic.inMillimetersOfMercury,
    diastolic: record.diastolic.inMillimetersOfMercury,
    date: record.time, // lấy ngày
    time: record.time, // thời gian đầy đủ nếu cần
  }));

const processSystolicData = (records: any[]) =>
  records.map((record) => ({
    value: record.systolic.inMillimetersOfMercury,
    date: record.time, // Lấy ngày từ `time`
  }));
const processDiastolicData = (records: any[]) =>
  records.map((record) => ({
    value: record.diastolic.inMillimetersOfMercury,
    date: record.time, // Lấy ngày từ `time`
  }));

const processHeartRateData = (records: any[]) =>
  records.map((record) => ({
    value: record.samples?.[0]?.beatsPerMinute ?? null, // Lấy sample đầu tiên
    date: record.startTime,
  }));
const processRespiratoryRateData = (records: any[]) =>
  records.map((record) => ({
    value: record.rate, // số nhịp thở mỗi phút
    date: record.time,
  }));

const processStepsData = (records: any[]) =>
  records.map((record) => ({
    value: record.count,
    date: record.startTime,
  }));

const processDistanceData = (records: any[]) =>
  records.map((record) => ({
    value: record.distance.inMeters,
    date: record.startTime,
  }));

const processBloodGlucoseData = (records: any[]) =>
  records.map((record) => ({
    value: record.level.inMilligramsPerDeciliter, // hoặc .millimolesPerLiter nếu bạn muốn đổi đơn vị
    date: record.time,
    // specimenSource: record.specimenSource, // máu mao mạch, tĩnh mạch, v.v.
    // mealType: record.mealType, // ăn sáng, ăn trưa, v.v.
    // relationToMeal: record.relationToMeal, // trước/sau bữa ăn
  }));

const processOxygenSaturationData = (records: any[]) =>
  records.map((record) => ({
    value: record.percentage,
    date: record.time,
  }));

export const fetchHealthRecords = async (
  recordType: RecordType,
  startTimeISO: string,
  endTimeISO: string,
  // this is for systolic and diastolic data
  isDiastolic?: boolean,
  isSystolic?: boolean
): Promise<any[] | null> => {
  try {
    const result = await readRecords(recordType, {
      timeRangeFilter: {
        operator: "between",
        startTime: startTimeISO,
        endTime: endTimeISO,
      },
    });

    if (recordType === "Height") {
      return processHeightData(result.records);
    }
    if (recordType === "Weight") {
      return processWeightData(result.records);
    }
    if (recordType === "BloodPressure") {
      if (isSystolic) {
        return processSystolicData(result.records);
      }
      if (isDiastolic) {
        return processDiastolicData(result.records);
      }
      return processBloodPressureData(result.records);
    }

    if (recordType === "HeartRate") {
      return processHeartRateData(result.records);
    }
    if (recordType === "RespiratoryRate") {
      return processRespiratoryRateData(result.records);
    }
    if (recordType === "Steps") {
      return processStepsData(result.records);
    }
    if (recordType === "Distance") {
      return processDistanceData(result.records);
    }
    if (recordType === "BloodGlucose") {
      return processBloodGlucoseData(result.records);
    }
    if (recordType === "OxygenSaturation") {
      return processOxygenSaturationData(result.records);
    }
    console.log(`✅ Retrieved ${recordType} records:`, result.records);
    return result.records;
  } catch (error) {
    console.error(`❌ Failed to read ${recordType} records:`, error);
    return null;
  }
};

export const fetchLatestHealthRecord = async (
  recordType: RecordType
): Promise<any | null> => {
  try {
    // Dùng khoảng thời gian rộng để đảm bảo lấy được hết dữ liệu
    const startTime = "2020-01-01T00:00:00.000Z";
    const endTime = new Date().toISOString();

    const result = await readRecords(recordType, {
      timeRangeFilter: {
        operator: "between",
        startTime: startTime,
        endTime: endTime,
      },
    });

    if (recordType === "Height") {
      const listRecords = processHeightData(result.records);
      // Lấy bản ghi mới nhất
      const latestRecord = listRecords[listRecords.length - 1];
      return latestRecord;
    }
    if (recordType === "Weight") {
      const listRecords = processWeightData(result.records);
      // Lấy bản ghi mới nhất
      const latestRecord = listRecords[listRecords.length - 1];
      return latestRecord;
    }

    if (recordType === "BloodPressure") {
      const listRecords = processBloodPressureData(result.records);
      const latestRecord = listRecords[listRecords.length - 1];
      return latestRecord;
    }
    if (recordType === "HeartRate") {
      const listRecords = processHeartRateData(result.records);
      return listRecords[listRecords.length - 1];
    }
    if (recordType === "RespiratoryRate") {
      const listRecords = processRespiratoryRateData(result.records);
      return listRecords[listRecords.length - 1];
    }
    if (recordType === "BloodGlucose") {
      return processBloodGlucoseData(result.records);
    }
    if (recordType === "OxygenSaturation") {
      return processOxygenSaturationData(result.records);
    }
    console.log(`✅ Retrieved ${recordType} records:`, result.records);
    return result.records;
  } catch (error) {
    console.error(`❌ Error getting latest ${recordType} record:`, error);
    return null;
  }
};

export const getTodayHealthRecord = async (
  recordType: string
): Promise<number> => {
  try {
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
      0,
      0,
      0
    );
    const end = now;

    const result = await aggregateGroupByPeriod({
      recordType,
      timeRangeFilter: {
        operator: "between",
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      },
      timeRangeSlicer: {
        period: "DAYS",
        length: 1,
      },
    });
    const data = result?.[0]?.result;

    if (recordType === "Steps") {
      const steps = data?.COUNT_TOTAL;
      return typeof steps === "number" ? steps : 0;
    } else if (recordType === "Distance") {
      const distance = data?.DISTANCE?.inMeters;
      return typeof distance === "number" ? distance : 0;
    }

    // Nếu không khớp recordType nào đã định nghĩa
    return 0;
  } catch (error) {
    console.error("🚨 Lỗi khi lấy dữ liệu ngày hôm nay:", error);
    return 0;
  }
};

export const getActivityRecord = async (
  recordType: "Steps" | "Distance",
  startTimeISO: string,
  endTimeISO: string,
  period: PeriodType
): Promise<{ date: string; value: number }[]> => {
  try {
    const result = await aggregateGroupByPeriod({
      recordType,
      timeRangeFilter: {
        operator: "between",
        startTime: startTimeISO,
        endTime: endTimeISO,
      },
      timeRangeSlicer: {
        period,
        length: 1,
      },
    });

    const formatted = result.map((item: any) => {
      let value = 0;

      if (recordType === "Steps") {
        value = item.result?.COUNT_TOTAL ?? 0;
      } else if (recordType === "Distance") {
        value = item.result?.DISTANCE?.inMeters ?? 0;
      }

      return {
        // Ép thời gian về đầu ngày (00:00) để tránh chênh lệch
        date: moment(item.startTime).startOf("day").toISOString(),
        value,
      };
    });

    return formatted;
  } catch (error) {
    console.error("🚨 Lỗi khi lấy dữ liệu hoạt động:", error);
    return [];
  }
};
