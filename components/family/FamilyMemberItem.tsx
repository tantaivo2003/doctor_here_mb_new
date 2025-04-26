import { View, Text, Image, TouchableOpacity } from "react-native";
import { FC } from "react";
import { FamilyMember, PendingInvite } from "../../types/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface FamilyMemberItemProps {
  member: FamilyMember | PendingInvite;
  onPress: () => void;
  onChangeStatus: () => void;
}

export const FamilyMemberItem: FC<FamilyMemberItemProps> = ({
  member,
  onPress,
  onChangeStatus,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-3 bg-white rounded-lg shadow-sm mb-2"
    >
      {/* Ảnh đại diện */}
      <Image
        source={
          member.avt_url
            ? { uri: member.avt_url }
            : require("../../assets/avatar-placeholder.png")
        }
        className="w-16 h-16 rounded-full"
      />

      {/* Thông tin */}
      <View className="flex-1 ml-3">
        <Text className="text-lg font-semibold text-gray-900">
          {member.ho_va_ten}
        </Text>
        <Text className="text-gray-500 text-sm">
          Thân phận: {member.than_phan}
        </Text>
      </View>
      <TouchableOpacity onPress={onChangeStatus}>
        <FontAwesome name="pencil-square-o" size={24} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
