// // services/stringeeClient.ts
// import {
//   StringeeClient,
//   StringeeClientListener,
// } from "stringee-react-native-v2";

// const stringeeClient = new StringeeClient();

// // Biến lưu callback hiện tại cho onIncomingCall2
// let currentIncomingCallHandler: ((client: any, call: any) => void) | null =
//   null;

// export function setIncomingCallHandler(
//   handler: ((client: any, call: any) => void) | null
// ) {
//   currentIncomingCallHandler = handler;
// }

// const listener = new StringeeClientListener();

// // Các sự kiện mặc định
// listener.onConnect = (client, userId) => {
//   console.log("onConnect:", userId);
// };

// listener.onDisConnect = (client) => {
//   console.log("onDisConnect");
// };

// listener.onFailWithError = (client, code, message) => {
//   console.log("onFailWithError:", message);
// };

// listener.onRequestAccessToken = (client) => {
//   console.log("onRequestAccessToken");
// };

// // Chỉ onIncomingCall2 là thay đổi được
// listener.onIncomingCall2 = (client, call) => {
//   console.log("onIncomingCall2 - gọi handler tuỳ biến");
//   if (currentIncomingCallHandler) {
//     currentIncomingCallHandler(client, call);
//   } else {
//     console.warn("No incomingCall2 handler set");
//   }
// };

// stringeeClient.setListener(listener);

// export { stringeeClient };
