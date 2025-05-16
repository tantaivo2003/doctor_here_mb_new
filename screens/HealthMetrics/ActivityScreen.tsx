import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// UI Components
import Toast from "react-native-toast-message";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import HealthMetricCard from "../../components/HealthMetrics/HealthMetricCard";

// Health Connect Permissions & Initialization
import { ACTIVITY_PERMISSIONS } from "../../services/healthConnect/permissions";
import { checkAndRequestPermissions } from "../../services/healthConnect/healthConnectPermissions";
import { initializeHealthConnect } from "../../services/healthConnect/healthConnect";

import SelectField from "../../components/ui/SelectField";
import {
  convertOptionToInterval,
  mapDisplayOptionToType,
} from "../../utils/validators";
import { FontAwesome5 } from "@expo/vector-icons";

import { useTimeFilter } from "./useTimeFilter";
import TimeNavigator from "../../components/ui/TimeNavigator";

import { getUserID } from "../../services/storage";

// Health Records
import {
  getTodayHealthRecord,
  getActivityRecord,
} from "../../utils/readHealthRecords";

import { HealthRecord } from "../../types/types";
import HealthMetricsLineChart from "../../components/HealthMetrics/HealthMetricsLineChart";
import { formatDateTime } from "../../utils/formatDateTime";
import {
  fetchStepsData,
  fetchDistanceData,
  fetchLatestHealthRecord,
} from "../../api/HealthMetrics";
import { set } from "date-fns";
const displayOptions = [
  { title: "Tuần", icon: "calendar-week" },
  { title: "Tháng", icon: "calendar-month" },
];

const ActivityScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [latestStepsRecord, setLatestStepsRecord] = useState<number>();
  const [latestDistanceRecord, setLatestDistanceRecord] = useState<number>();

  const [stepsRecords, setStepsRecords] = useState<HealthRecord[]>([]);
  const [distanceRecords, setDistanceRecords] = useState<HealthRecord[]>([]);

  const [stepsDisplayOption, setStepsDisplayOption] = useState("Tuần");
  const [distanceDisplayOption, setDistanceDisplayOption] = useState("Tuần");

  const {
    currentDate: stepsDate,
    getStartEndDate: getStepsStartEndDate,
    handleChange: handleStepsChange,
  } = useTimeFilter();
  const [stepChartLoading, setStepChartLoading] = useState(false);

  const {
    currentDate: distanceDate,
    getStartEndDate: getDistanceStartEndDate,
    handleChange: handleDistanceChange,
  } = useTimeFilter();

  // const init = async () => {
  //   await initializeHealthConnect();
  //   const hasPermission = await checkAndRequestPermissions(
  //     ACTIVITY_PERMISSIONS
  //   );
  //   return hasPermission;
  // };
  const fetchSteps = async (
    ptID: string,
    type: "daily" | "monthly" | "yearly",
    startDate: Date,
    endDate: Date
  ) => {
    try {
      setLoading(true);
      const stepsData = await fetchStepsData(ptID, type, startDate, endDate);
      console.log("Steps data:", stepsData);
      return stepsData;
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu số bước", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistance = async (
    ptID: string,
    type: "daily" | "monthly" | "yearly",
    startDate: Date,
    endDate: Date
  ) => {
    try {
      setLoading(true);
      const distanceData = await fetchDistanceData(
        ptID,
        type,
        startDate,
        endDate
      );
      console.log("Distance data:", distanceData);
      return distanceData;
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu quãng đường", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLatestData = async () => {
      setLoading(true);
      const ptID = await getUserID();
      if (!ptID) {
        console.error("Không tìm thấy ID người dùng");
        return;
      }

      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      // Gọi fetch với type = "daily", từ yesterday đến today
      const todaySteps = await fetchSteps(ptID, "daily", yesterday, today);
      const todayDistance = await fetchDistance(
        ptID,
        "daily",
        yesterday,
        today
      );
      if (todaySteps) {
        setLatestStepsRecord(todaySteps[1]?.value);
      }
      if (todayDistance) {
        setLatestDistanceRecord(todayDistance[1]?.value);
      }
      setLoading(false);
    };

    fetchLatestData();
  }, []);

  useEffect(() => {
    const fetchStepsAndDistance = async () => {
      const ptID = await getUserID();
      if (!ptID) {
        console.error("Không tìm thấy ID người dùng");
        return;
      }

      const stepsType = mapDisplayOptionToType(stepsDisplayOption);
      const { startDate: stepsStartDate, endDate: stepsEndDate } =
        getStepsStartEndDate(stepsDisplayOption);

      const distanceType = mapDisplayOptionToType(distanceDisplayOption);
      const { startDate: distanceStartDate, endDate: distanceEndDate } =
        getStepsStartEndDate(distanceDisplayOption);

      const stepsData = await fetchSteps(
        ptID,
        stepsType,
        stepsStartDate,
        stepsEndDate
      );
      const distanceData = await fetchDistance(
        ptID,
        distanceType,
        distanceStartDate,
        distanceEndDate
      );
      if (stepsData) {
        setStepsRecords(stepsData);
      }
      if (distanceData) {
        setDistanceRecords(distanceData);
      }
    };

    fetchStepsAndDistance();
  }, [stepsDisplayOption, stepsDate, distanceDisplayOption, distanceDate]);

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <View className="flex-row justify-between mb-4">
          <HealthMetricCard
            label="Bước đi"
            unit="bước"
            value={latestStepsRecord}
            imageSource={require("../../assets/healthMetrics/stepCount.png")}
          />
          <HealthMetricCard
            label="Quãng đường"
            unit="mét"
            value={latestDistanceRecord?.toFixed(2)}
            imageSource={require("../../assets/healthMetrics/distance.png")}
          />
        </View>
      )}

      {/* Biểu đồ bước chân */}
      <>
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-bold">Biểu đồ số bước chân</Text>
          </View>
          <View className="w-40">
            <SelectField
              label=""
              data={displayOptions}
              value={stepsDisplayOption || ""}
              placeholder="Kiểu hiển thị"
              onChange={(val) => setStepsDisplayOption(val)}
            />
          </View>
        </View>
        <TimeNavigator
          displayOption={stepsDisplayOption}
          currentDate={stepsDate}
          onChange={handleStepsChange}
        />

        {stepsRecords.length > 0 ? (
          <HealthMetricsLineChart healthMetricsLineData={stepsRecords} />
        ) : (
          <View className="items-center justify-center my-10">
            <Text className="text-gray-500">Không có dữ liệu</Text>
          </View>
        )}
      </>

      {/* Biểu đồ quãng đường di chuyển*/}

      <>
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-bold">
              Biểu đồ quãng đường di chuyển
            </Text>
          </View>
          <View className="w-40">
            <SelectField
              label=""
              data={displayOptions}
              value={distanceDisplayOption || ""}
              placeholder="Kiểu hiển thị"
              onChange={(val) => setDistanceDisplayOption(val)}
            />
          </View>
        </View>
        <TimeNavigator
          displayOption={distanceDisplayOption}
          currentDate={distanceDate}
          onChange={handleDistanceChange}
        />
        {distanceRecords.length > 0 ? (
          <HealthMetricsLineChart healthMetricsLineData={distanceRecords} />
        ) : (
          <View className="items-center justify-center my-10">
            <Text className="text-gray-500">Không có dữ liệu</Text>
          </View>
        )}
      </>
    </ScrollView>
  );
};

export default ActivityScreen;
