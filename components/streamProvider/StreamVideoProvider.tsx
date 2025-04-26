// components/StreamVideoProvider.tsx
import React, { useEffect, useState } from "react";
import { StreamVideoClient } from "@stream-io/video-react-native-sdk";
import { StreamCall, StreamVideo } from "@stream-io/video-react-native-sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAvt, getUserID, getUsername } from "../../services/storage";

const API_KEY = "vnm8mphvy9cx"; // <-- Thay bằng Stream API key

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      // const userId = await getUserID();
      const userId = "BN0000006";

      const token = await AsyncStorage.getItem("stream_token");
      const apiKey = await AsyncStorage.getItem("stream_api_key");
      const username = "nguoidung1";

      console.log("User ID:", userId);

      //Nếu userID k có chuyển tới trang đăng nhập

      console.log(token);
      if (!token || !apiKey) {
        console.log("Token or API key not found, fetching new token...");
        console.log("API_BASE_URL:", API_BASE_URL);
        const response = await fetch(`${API_BASE_URL}/api/video_call/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: userId }),
        });

        console.log("Token response status:", response.status);

        let data = await response.json();
        if (response.ok) {
          try {
            console.log("Set items in AsyncStorage:");
            console.log("Token:", data.token);
            console.log("API Key:", data.api_key); // hoặc data.apiKey nếu server trả key kiểu đó

            if (!data.token || !data.api_key) {
              console.warn("Token or API Key is missing in response!");
              return;
            }

            await AsyncStorage.setItem("stream_token", data.token);
            await AsyncStorage.setItem("stream_api_key", data.api_key);
            console.log("Saved to AsyncStorage successfully ✅");
          } catch (err) {
            console.error("Error setting AsyncStorage:", err);
          }
        } else {
          console.error("Error fetching token:", data.message);
          return;
        }

        if (!userId) {
          console.error("User ID is null or undefined");
          return;
        }

        const client = new StreamVideoClient({
          apiKey: data.api_key,
          user: {
            id: userId,
            name: username || "Bệnh nhân", // Fallback for username
          },
          token: data.token,
        });

        console.log("Client initialized:", client);

        setVideoClient(client);
      } else {
        const client = new StreamVideoClient({
          apiKey: apiKey,
          user: {
            id: userId,
            name: username || "Bệnh nhân", // Fallback cho username
          },
          token: token,
        });

        console.log(
          "Client initialized with existing token and API key:",
          client
        );
        setVideoClient(client);
      }
    };

    init();

    return () => {
      videoClient?.disconnectUser();
    };
  }, []);

  if (!videoClient) return null;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
