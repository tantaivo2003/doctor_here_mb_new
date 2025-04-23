import { insertRecords } from "react-native-health-connect";

export const insertHealthRecord = async (recordType: string, value: number) => {
  const time = new Date().toISOString();
  let record: any;

  if (recordType === "Height") {
    record = {
      recordType: "Height",
      time: time,
      height: {
        value: value,
        unit: "meters",
      },
    };
  } else if (recordType === "Weight") {
    record = {
      recordType: "Weight",
      time: time,
      weight: {
        value: value,
        unit: "kilograms",
      },
    };
  } else {
    console.error("Unsupported record type");
    return;
  }

  try {
    const ids = await insertRecords([record]);
    console.log("Inserted IDs:", ids);
    return ids;
  } catch (err) {
    console.error("Error inserting record:", err);
  }
};
