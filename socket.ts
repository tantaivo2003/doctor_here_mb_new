import { io, Socket } from "socket.io-client";
const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

// const socket: Socket = io("http://localhost:3001");
//Lấy địa chỉ IP của máy chủ từ biến môi trường VITE_API_BASE_URL
const socket: Socket = io(API_BASE_URL, {
  transports: ["websocket"],
});

export const registerUser = (username: string) => {
  console.log("Registering user:", username);
  socket.emit("register", username);
};

export const sendMessage = (
  sender: string,
  receiver: string,
  content: string,
  time: string,
  type: string,
  url: string
) => {
  socket.emit("chat_message", { sender, receiver, content, time, type, url });
};

export const onMessageReceived = (callback: (message: string) => void) => {
  socket.on("chat_message", callback);
};

export const recallMessage = (
  sender: string,
  receiver: string,
  content: string,
  time: string,
  type: string,
  url: string
) => {
  socket.emit("recall_message", { sender, receiver, content, time, type, url });
};

export const onRecallMessage = (callback: (body: string) => void) => {
  socket.on("recall_message", callback);
};

export default socket;
