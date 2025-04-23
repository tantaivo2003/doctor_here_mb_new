import { readRecords, RecordType } from "react-native-health-connect";

const processHeightData = (records: any[]) =>
  records.map((record) => ({
    value: record.height.inMeters,
    date: record.time.split("T")[0], // Lấy ngày từ `time`
  }));

const processWeightData = (records: any[]) =>
  records.map((record) => ({
    value: record.weight.inKilograms,
    date: record.time.split("T")[0], // Lấy ngày từ `time`
  }));

export const fetchHealthRecords = async (
  recordType: RecordType,
  startTimeISO: string,
  endTimeISO: string
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
    console.log(`✅ Retrieved ${recordType} records:`, result.records);
    return result.records;
  } catch (error) {
    console.error(`❌ Error getting latest ${recordType} record:`, error);
    return null;
  }
};
