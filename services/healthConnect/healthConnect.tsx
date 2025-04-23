import { initialize } from "react-native-health-connect";
import { readRecords } from "react-native-health-connect";
import { insertRecords } from "react-native-health-connect";

export const initializeHealthConnect = async () => {
  const isInitialized = await initialize();
};

export const readSampleData = () => {
  readRecords("Height", {
    timeRangeFilter: {
      operator: "between",
      startTime: "2023-01-09T12:00:00.405Z",
      endTime: "2026-01-09T23:53:15.405Z",
    },
  }).then(({ records }) => {
    console.log("Retrieved records: ", JSON.stringify({ records }, null, 2)); // Retrieved records:  {"records":[{"startTime":"2023-01-09T12:00:00.405Z","endTime":"2023-01-09T23:53:15.405Z","energy":{"inCalories":15000000,"inJoules":62760000.00989097,"inKilojoules":62760.00000989097,"inKilocalories":15000},"metadata":{"id":"239a8cfd-990d-42fc-bffc-c494b829e8e1","lastModifiedTime":"2023-01-17T21:06:23.335Z","clientRecordId":null,"dataOrigin":"com.healthconnectexample","clientRecordVersion":0,"device":0}}]}
  });
};

export const insertSampleData = () => {
  insertRecords([
    {
      recordType: "Height",
      height: { unit: "meters", value: 1.75 },
      time: "2025-01-09T12:00:00.405Z",
    },
  ]).then((ids) => {
    console.log("Records inserted ", { ids });
  });
};

export const insertHeightData = (value: number) => {
  console.log("Ghi chiều cao mới: ", value);
  insertRecords([
    {
      recordType: "Height",
      height: { unit: "meters", value: value },
      time: new Date().toISOString(),
    },
  ]).then((ids) => {
    console.log("Records inserted ", { ids });
  });
};

export const readHeightData = () => {
  readRecords("Height", {
    timeRangeFilter: {
      operator: "between",
      startTime: "2023-01-09T12:00:00.405Z",
      endTime: "2026-01-09T23:53:15.405Z",
    },
  }).then(({ records }) => {
    console.log("Retrieved records: ", JSON.stringify({ records }, null, 2)); // Retrieved records:  {"records":[{"startTime":"2023-01-09T12:00:00.405Z","endTime":"2023-01-09T23:53:15.405Z","energy":{"inCalories":15000000,"inJoules":62760000.00989097,"inKilojoules":62760.00000989097,"inKilocalories":15000},"metadata":{"id":"239a8cfd-990d-42fc-bffc-c494b829e8e1","lastModifiedTime":"2023-01-17T21:06:23.335Z","clientRecordId":null,"dataOrigin":"com.healthconnectexample","clientRecordVersion":0,"device":0}}]}
  });
};
