import "./global.css";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { toastConfig } from "./components/ui/toastConfig";

import { AuthProvider } from "./context/AuthContext";
import Main from "./context/Main";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Main />
      </AuthProvider>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}
