import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { FamilyMemberItem } from "../../components/family/FamilyMemberItem";
import {
  fetchFamilyMembers,
  fetchPendingInvites,
  updateRelationship,
  confirmRelationship,
} from "../../api/Family";
import { FamilyMember, PendingInvite } from "../../types/types";
import { getUserID } from "../../services/storage";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import LoadingModal from "../../components/ui/LoadingModal";
import ConfirmModal from "../../components/ui/ComfirmModal";
import Modal from "react-native-modal";
import SelectField from "../../components/ui/SelectField";
import Toast from "react-native-toast-message";

const relationshipOptions = [
  { title: "Chồng", icon: "human-male" },
  { title: "Vợ", icon: "human-female" },
  { title: "Con trai", icon: "human-male-child" },
  { title: "Con gái", icon: "human-female-child" },
  { title: "Ông", icon: "human-male-male" },
  { title: "Bà", icon: "human-female-female" },
  { title: "Anh/Chị", icon: "account-group" },
  { title: "Em", icon: "account-child" },
  { title: "Khác", icon: "account-question" },
];

const FamilyMembers = ({ navigation }: any) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null
  );
  const [selectedPending, setSelectedPending] = useState<PendingInvite | null>(
    null
  );
  const [seletedRole, setSeletedRole] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const [changeRoleModalVisible, setChangeRoleModalVisible] = useState(false);
  const [confirmRalativeModalVisible, setConfirmRalativeModalVisible] =
    useState(false);
  const getFamilyData = async () => {
    try {
      const ptID = await getUserID();
      if (!ptID) {
        console.log("Không tìm thấy ID người dùng trong bộ nhớ.");
        return;
      }

      const data = await fetchFamilyMembers(ptID);
      setMembers(data);

      const pendingData = await fetchPendingInvites(ptID);
      setPendingInvites(pendingData);
    } catch (err) {
      console.log("Lỗi khi lấy danh sách thành viên:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getFamilyData();
  }, []);

  const handlePressMember = (member: FamilyMember) => {
    navigation.navigate("MemberDetailNav", { member });
  };

  const handleChangeRole = (member: FamilyMember) => {
    setSelectedMember(member);
    console.log(selectedMember?.than_phan);
    setChangeRoleModalVisible(true);
  };

  const confirmChangeRole = async () => {
    setChangeRoleModalVisible(false);
    setLoadingModalVisible(true);
    try {
      const pID = await getUserID();
      console.log("API: ", pID, selectedMember?.ma_benh_nhan_2, seletedRole);

      const result = await updateRelationship(
        pID,
        selectedMember?.ma_benh_nhan_2,
        seletedRole
      );
      getFamilyData();
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Cập nhật mối quan hệ thành công.",
      });
    } catch (err) {
      console.log("Lỗi khi cập nhật mối quan hệ:", err);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Có lỗi xảy ra khi cập nhật mối quan hệ.",
      });
    }
    setLoadingModalVisible(false);
  };

  const handlePressPending = (member: PendingInvite) => {
    setSelectedPending(member);
    setConfirmRalativeModalVisible(true);
  };

  const conFirmPending = async () => {
    setConfirmRalativeModalVisible(false);
    setLoadingModalVisible(true);
    try {
      const ptID = await getUserID();
      console.log("API: ", ptID, selectedPending?.ma_benh_nhan_1);

      if (!ptID || !selectedPending) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Có lỗi xảy ra khi cập nhật mối quan hệ.",
        });
        return;
      }
      const result = await confirmRelationship(
        ptID,
        selectedPending?.ma_benh_nhan_1
      );
      getFamilyData();
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: `Đã thêm ${selectedPending?.ho_va_ten} vào danh sách thành viên.`,
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Có lỗi xảy ra khi cập nhật mối quan hệ.",
      });
    }

    setLoadingModalVisible(false);
  };
  return (
    <View className="flex-1 bg-white px-4">
      {loadingModalVisible && <LoadingModal />}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <LoadingAnimation />
          <Text className="mt-2 text-gray-500">
            Đang tải danh sách thành viên...
          </Text>
        </View>
      ) : (
        <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
          <Text className="text-lg font-bold mb-2">Thành viên</Text>
          {members.length > 0 ? (
            members.map((item) => (
              <View
                className="flex-row items-center mb-2"
                key={item.ma_benh_nhan_2}
              >
                <FamilyMemberItem
                  member={item}
                  onPress={() => handlePressMember(item)}
                  onChangeStatus={() => {
                    handleChangeRole(item);
                  }}
                />
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-center mb-4">
              Không có thành viên nào
            </Text>
          )}

          <Text className="text-lg font-bold mt-6 mb-2">Chờ xác nhận</Text>
          {pendingInvites.length > 0 ? (
            pendingInvites.map((item) => (
              <FamilyMemberItem
                key={item.ma_benh_nhan_1}
                member={item}
                onPress={() => handlePressPending(item)}
                onChangeStatus={() => {
                  handlePressPending(item);
                }}
              />
            ))
          ) : (
            <Text className="text-gray-500 text-center mb-4">
              Không có lời mời chờ xác nhận
            </Text>
          )}
        </ScrollView>
      )}

      <Modal
        isVisible={changeRoleModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="justify-center items-center">
          <View className="bg-white rounded-2xl p-6 ">
            <Text className="text-lg font-bold text-center mb-3">
              Thay đổi vai trò
            </Text>
            <SelectField
              label=""
              data={relationshipOptions}
              value={selectedMember?.than_phan || ""}
              placeholder="Thay đổi thân phận"
              onChange={(val) => setSeletedRole(val)}
            />
            <View className="flex-row justify-around mt-3 gap-5">
              <TouchableOpacity
                className="py-3 px-6 bg-gray-100 w-2/5 items-center rounded-full"
                onPress={() => setChangeRoleModalVisible(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 px-6 bg-blue-500 w-2/5 items-center rounded-full"
                onPress={() => confirmChangeRole()}
              >
                <Text className="text-white">Thay đổi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={confirmRalativeModalVisible}
        title="Thêm thành viên"
        message={`Xác nhận thêm ${selectedPending?.ho_va_ten} vào danh sách thành viên không?`}
        onCancel={() => setConfirmRalativeModalVisible(false)}
        onConfirm={conFirmPending}
      />
    </View>
  );
};

export default FamilyMembers;
