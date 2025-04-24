// // services/stringeeConfig.ts
// import {
//   StringeeClient,
//   StringeeClientListener,
// } from "stringee-react-native-v2";
// import { getUserID } from "./storage";
// console.log("StringeeClient initialized");
// const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
// const stringeeClient: StringeeClient = new StringeeClient();

// let ptID: string | undefined;
// let token: string;

// (async () => {
//   const userId = await getUserID();
//   ptID = userId !== null ? userId : undefined;
// })();

// // Listen for the StringeeClient event
// const stringeeClientListener: StringeeClientListener =
//   new StringeeClientListener();

// // Invoked when the StringeeClient is connected
// stringeeClientListener.onConnect = (stringeeClient, userId) => {
//   console.log("onConnect: ", userId);
// };

// // Invoked when the StringeeClient is disconnected
// stringeeClientListener.onDisConnect = (stringeeClient) => {
//   console.log("onDisConnect");
// };

// // Invoked when StringeeClient connect false
// stringeeClientListener.onFailWithError = (stringeeClient, code, message) => {
//   console.log("onFailWithError: ", message);
// };

// // Invoked when your token is expired
// stringeeClientListener.onRequestAccessToken = (stringeeClient) => {
//   console.log("onRequestAccessToken");
// };

// // Invoked when receive an incoming of StringeeCall2
// stringeeClientListener.onIncomingCall2 = (stringeeClient, stringeeCall2) => {
//   console.log("onIncomingCall2: ", JSON.stringify(stringeeCall2));
// };

// stringeeClient.setListener(stringeeClientListener);

// (async () => {
//   console.log("Connecting to StringeeClient...");
//   const response = await fetch(`${API_BASE_URL}/api/video_call/token`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ userID: ptID }),
//   });
//   const data = await response.json();
//   token = data.token;
//   console.log("Token: ", token);

//   if (token) {
//     stringeeClient.connect(token);
//   }
// })();

// export { stringeeClient, stringeeClientListener };
