import { TouchableOpacity, Text, View } from "react-native";
import { FC } from "react";
import { FontAwesome5 } from "@expo/vector-icons";

import DigestIcon from "../icons/DigestIcon";

interface ShortcutButtonProps {
  icon: string;
  title: string;
  color: string;
  onPress: () => void;
}

const ShortcutButton: FC<ShortcutButtonProps> = ({
  icon,
  title,
  color,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="flex-1 items-center p-3 rounded-2xl bg-white"
      onPress={onPress}
    >
      <View className="relative">
        <View
          className="w-16 h-16 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          {icon === "digest" ? (
            <DigestIcon width={30} height={30} color="white" />
          ) : (
            <FontAwesome5 name={icon} size={30} color="white" />
          )}
        </View>

        <View
          className="absolute top-0 left-0 w-10 h-10 rounded-tl-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderBottomRightRadius: 32,
          }}
        />
      </View>

      <Text className="mt-2 text-sm font-semibold text-gray-700 text-center">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ShortcutButton;
