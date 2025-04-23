// screens/NotificationTestScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "../../utils/notification";

export default function NotificationTestScreen() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });
  }, []);

  return (
    <View className="flex-1 items-center justify-center px-4">
      <Text className="text-lg font-semibold mb-4">Push Notification Test</Text>
      <Text className="mb-4 text-center">
        Token: {expoPushToken ?? "Đang lấy token..."}
      </Text>
      <Button
        title="Gửi thông báo thử"
        onPress={() => {
          if (expoPushToken) {
            sendPushNotification(expoPushToken);
          } else {
            alert("Chưa có token!");
          }
        }}
      />
    </View>
  );
}
