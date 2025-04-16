import ChatListScreen from "./ChatListScreen";
import ChatDetailScreen from "./ChatDetailScreen";
import VideoCallScreen from "./CallScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
const ChatStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Chat"
      component={ChatListScreen}
      options={{ title: "Tin nhắn", headerTitleAlign: "center" }}
    />
    <Stack.Screen
      name="ChatDetailScreen"
      component={ChatDetailScreen}
      options={{
        title: "Trò chuyện",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="VideoCallScreen"
      component={VideoCallScreen}
      options={{
        title: "Cuộc gọi video",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);
export default ChatStack;
