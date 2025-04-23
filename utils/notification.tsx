// utils/notification.tsx
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (!Device.isDevice) {
      console.warn("❌ Phải dùng thiết bị thật để nhận push token");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log("📱 Quyền hiện tại:", existingStatus);
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("❌ Không có quyền gửi thông báo");
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    console.log("🆔 Project ID:", projectId);

    if (!projectId) {
      console.warn("❌ Không tìm thấy projectId");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
      .data;
    console.log("✅ Push Token:", token);
    return token;
  } catch (err) {
    console.error("❌ Lỗi khi lấy push token:", err);
    return;
  }
}

export async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Hello từ App của bạn 👋",
    body: "Đây là thông báo thử nghiệm.",
    data: { customData: "abc123" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
