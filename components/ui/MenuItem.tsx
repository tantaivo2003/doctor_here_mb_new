import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FC } from "react";

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  color?: string;
}

const MenuItem: FC<MenuItemProps> = ({
  icon,
  title,
  onPress,
  color = "black",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-gray-100"
    >
      <View className="flex-row items-center">
        <Ionicons name={icon} size={22} color={color} />
        <Text className="ml-4 text-lg font-medium text-gray-600">{title}</Text>
      </View>
      <AntDesign name="rightcircleo" size={24} color="#A1A1AA" />
    </TouchableOpacity>
  );
};

export default MenuItem;
