import React from "react";
import { Pressable, Text } from "react-native";

type CellProps = {
  value: string | null;
  onPress: () => void;
};

const Cell: React.FC<CellProps> = ({ value, onPress }) => {
  return (
    <Pressable
      className="w-10 h-10 items-center justify-center border border-gray-300"
      onPress={onPress}
    >
      <Text className="text-xl text-center">{value}</Text>
    </Pressable>
  );
};
export default Cell;
