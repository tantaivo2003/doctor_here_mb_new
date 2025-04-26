import { insertRecords } from "react-native-health-connect";

export const insertHealthRecord = async (recordType: string, value: any) => {
  const now = new Date();
  const isoTime = now.toISOString();

  let record: any;

  switch (recordType) {
    case "Height":
      record = {
        recordType: "Height",
        time: isoTime,
        height: { value, unit: "meters" },
      };
      break;

    case "Weight":
      record = {
        recordType: "Weight",
        time: isoTime,
        weight: { value, unit: "kilograms" },
      };
      break;

    case "BloodPressure":
      record = {
        recordType: "BloodPressure",
        time: isoTime,
        systolic: { value: parseFloat(value.systolic), unit: "mmHg" },
        diastolic: { value: parseFloat(value.diastolic), unit: "mmHg" },
      };
      break;

    case "HeartRate":
      record = {
        recordType: "HeartRate",
        startTime: isoTime,
        endTime: isoTime,
        samples: [
          {
            time: isoTime,
            beatsPerMinute: parseFloat(value),
          },
        ],
      };
      break;

    case "RespiratoryRate":
      record = {
        recordType: "RespiratoryRate",
        time: isoTime,
        rate: parseFloat(value),
        // Có thể thêm zoneOffset nếu cần
      };
      break;

    default:
      console.error("Unsupported record type:", recordType);
      return;
  }

  try {
    const ids = await insertRecords([record]);
    console.log("✅ Inserted:", recordType, "=>", ids);
    return ids;
  } catch (err) {
    console.error("❌ Error inserting", recordType, ":", err);
  }
};
