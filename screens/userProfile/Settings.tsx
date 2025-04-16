// Foo.jsx
import Toast from "react-native-toast-message";
import { Button } from "react-native";

const SettingsScreen = () => {
  const showToast = () => {
    Toast.show({
      type: "error",
      text1: "Hello",
      text2: "This is some something 👋",
    });
  };

  return <Button title="Show toast" onPress={showToast} />;
};

export default SettingsScreen;
