import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BMIScreen from "./BMIScreen";
import BloodPressureScreen from "./BloodPressureScreen";
import HeartRateScreen from "./HeartRateScreen";
import ActivityScreen from "./ActivityScreen";
import { Ionicons } from "@expo/vector-icons";

import { initializeHealthConnect } from "../../services/healthConnect/healthConnect";
import {
  requestMyAppPermissions,
  checkAndRequestPermissions,
} from "../../services/healthConnect/healthConnectPermissions";
import { checkInitialSyncStatus } from "../../api/HealthMetrics";
import { permissionsToRequest } from "../../services/healthConnect/permissions";
import { getUserID } from "../../services/storage";
import { performInitialSync, dailySync } from "../../api/SyncHealthConnect";
import MenuItem from "../../components/ui/MenuItem";
import { set } from "date-fns";
const Tab = createMaterialTopTabNavigator();
const healthMenus = [
  {
    icon: "barbell",
    title: "Chỉ số BMI",
    screen: "BMIScreen",
    color: "#34D399",
  },
  {
    icon: "heart",
    title: "Huyết áp",
    screen: "BloodPressureScreen",
    color: "#F87171",
  },
  {
    icon: "pulse",
    title: "Nhịp tim",
    screen: "HeartRateScreen",
    color: "#60A5FA",
  },
  {
    icon: "water",
    title: "Đường huyết",
    screen: "BloodGlucoseOxygenScreen",
    color: "#A78BFA",
  },
  {
    icon: "walk",
    title: "Hoạt động",
    screen: "ActivityScreen",
    color: "#FBBF24",
  },
];

const HealthMetricsScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = React.useState<boolean>(false);
  const [hasSyncedInitially, setHasSyncedInitially] = React.useState<
    boolean | null
  >(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const init = async () => {
    await initializeHealthConnect();
    const hasPermission = await checkAndRequestPermissions(
      permissionsToRequest
    );
    setHasPermission(hasPermission);
  };

  const checkInitialSync = async () => {
    const userId = await getUserID();
    if (userId) {
      const hasSynced = await checkInitialSyncStatus(userId);
      setHasSyncedInitially(hasSynced);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await init();
      await checkInitialSync();
      if (hasSyncedInitially) {
        const userId = await getUserID();
        if (userId) {
          const lastSynced = await dailySync();
          console.log("Last synced:", lastSynced);
        }
      } else {
        console.log("Chưa đồng bộ dữ liệu lần đầu");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [hasSyncedInitially]);

  const renderSyncNotice = () => {
    if (isLoading) {
      return (
        <View className="bg-gray-100 px-6 py-4 border-t border-gray-300 rounded-lg shadow-sm">
          <Text className="text-gray-800 text-lg font-semibold">
            Đang kiểm tra quyền truy cập...
          </Text>
        </View>
      );
    }

    if (!hasPermission) {
      return (
        <View className="bg-yellow-100 px-6 py-4 border-t border-yellow-300 rounded-lg shadow-sm">
          <Image
            source={require("../../assets/healthConnect.png")}
            className="w-12 h-12 mb-2"
          />
          <Text className="text-yellow-800 text-lg font-medium">
            ⚠️ Bạn chưa cấp đủ quyền truy cập Health Connect.
          </Text>
          <TouchableOpacity
            onPress={async () => {
              init();
            }}
          >
            <Text className="text-blue-600 mt-2 underline">
              Nhấn để cấp lại quyền
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isSyncing === true) {
      return (
        <View className="bg-yellow-100 px-6 py-4 border-t border-yellow-300 rounded-lg shadow-sm">
          <Image
            source={require("../../assets/healthConnect.png")}
            className="w-12 h-12 mb-2"
          />
          <Text className="text-yellow-800 text-lg font-medium">
            Đang đồng bộ dữ liệu sức khỏe...
          </Text>
        </View>
      );
    }
    if (hasSyncedInitially === null && isSyncing === false) {
      return (
        <View className="bg-blue-100 px-6 py-4 border-t border-blue-300 rounded-lg shadow-sm">
          <Image
            source={require("../../assets/healthConnect.png")}
            className="w-12 h-12 mb-2"
          />
          <Text className="text-blue-800 text-lg font-medium">
            Bạn cần đồng bộ dữ liệu sức khỏe lần đầu với Health Connect.
          </Text>
          <TouchableOpacity
            onPress={async () => {
              setIsSyncing(true);
              await performInitialSync();
              setIsSyncing(false);
            }}
          >
            <Text className="text-blue-600 mt-2">Bấm để đồng bộ ngay</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (hasSyncedInitially === true) {
      return (
        <View className="bg-blue-100 px-6 py-4 border-t border-blue-400 rounded-lg shadow-sm flex-row items-center">
          <Image
            source={require("../../assets/healthConnect.png")}
            className="w-12 h-12"
          />
          <Text className="ml-5 text-blue-800 text-lg font-semibold">
            Dữ liệu của bạn đã được đồng bộ.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View className="flex-1 bg-white">
      {renderSyncNotice()}
      <View className="mt-8 px-4">
        {healthMenus.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            title={item.title}
            color={item.color}
            onPress={() => navigation.navigate(item.screen)}
          />
        ))}
      </View>
    </View>
  );
};

export default HealthMetricsScreen;
