import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#22c55e",
        borderRadius: 10,
        width: width - 20, // Chiếm gần full screen
        minHeight: 80, // Tăng chiều cao
        paddingVertical: 12,
        justifyContent: "center",
      }}
      contentContainerStyle={{
        paddingHorizontal: 20,
      }}
      text1Style={{
        fontSize: 20, // To hơn
        fontWeight: "700",
        color: "#16a34a",
      }}
      text2Style={{
        fontSize: 16,
        color: "#4ade80",
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#dc2626",
        borderRadius: 10,
        width: width - 20,
        minHeight: 80,
        paddingVertical: 12,
        justifyContent: "center",
      }}
      contentContainerStyle={{
        paddingHorizontal: 20,
      }}
      text1Style={{
        fontSize: 20,
        fontWeight: "700",
        color: "#dc2626",
      }}
      text2Style={{
        fontSize: 16,
        color: "#f87171",
      }}
    />
  ),
};
