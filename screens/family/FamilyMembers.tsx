import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { FamilyMemberItem } from "../../components/family/FamilyMemberItem";
import {
  fetchFamilyMembers,
  fetchPendingInvites,
  updateRelationship,
  confirmRelationship,
  createRelationship,
} from "../../api/Family";
import { FamilyMember, PendingInvite } from "../../types/types";
import { getUserID } from "../../services/storage";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import LoadingModal from "../../components/ui/LoadingModal";
import ConfirmModal from "../../components/ui/ComfirmModal";
import Modal from "react-native-modal";
import SelectField from "../../components/ui/SelectField";
import TextInputField from "../../components/ui/TextInputField";
import Toast from "react-native-toast-message";
import { set } from "date-fns";

const relationshipOptions = [
  { title: "Chồng", icon: "account-cowboy-hat" }, // Người đàn ông - phong cách "người lớn", mạnh mẽ
  { title: "Vợ", icon: "human-female" }, // Người phụ nữ
  { title: "Con trai", icon: "baby-face-outline" }, // Em bé trai
  { title: "Con gái", icon: "baby-face" }, // Em bé gái
  { title: "Ông", icon: "account-tie" }, // Người đàn ông già - áo vest cà vạt
  { title: "Bà", icon: "account-outline" }, // Người phụ nữ (không có icon "bà già" chuẩn, dùng outline cho nhẹ nhàng)
  { title: "Anh/Chị", icon: "account" }, // Người trưởng thành
  { title: "Em", icon: "account-child" }, // Em nhỏ
  { title: "Khác", icon: "account-question" }, // Khác
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
  const [selectedRole, setSelectedRole] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [newMemberRole, setNewMemberRole] = useState<string>("");
  const [newMemberPhoneNumber, setNewMemberPhoneNumber] = useState<string>("");

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
      console.log("API: ", pID, selectedMember?.ma_benh_nhan_2, selectedRole);

      const result = await updateRelationship(
        pID,
        selectedMember?.ma_benh_nhan_2,
        selectedRole
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

  const handleAddMember = async () => {
    // Log thông tin trước khi gọi API
    console.log("API: ", newMemberPhoneNumber, newMemberRole);

    // Kiểm tra nếu số điện thoại và mối quan hệ không rỗng
    if (!newMemberPhoneNumber || !newMemberRole) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng điền đầy đủ thông tin.",
      });
      setAddMemberModalVisible(false);
      return;
    }

    try {
      const pID = await getUserID();
      if (!pID) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Có lỗi hệ thống xảy ra! Hãy đăng nhập lại.",
        });
        setAddMemberModalVisible(false);
        return;
      }
      // Gọi hàm createRelationship với thông tin từ form
      const response = await createRelationship(
        pID,
        newMemberPhoneNumber,
        newMemberRole
      );

      // Xử lý kết quả từ API
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đã gửi lời mời thành công!",
      });

      // Đóng modal sau khi thêm thành viên thành công
      setAddMemberModalVisible(false);
    } catch (err) {
      // Xử lý lỗi nếu có
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Hãy nhập đúng số điện thoại",
      });
      setAddMemberModalVisible(false);
    }
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
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className="w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg"
          onPress={() => {
            setAddMemberModalVisible(true);
          }}
        >
          <Text className="text-white text-3xl">+</Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={changeRoleModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        onBackdropPress={() => setChangeRoleModalVisible(false)}
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
              placeholder="Thay đổi quan hệ"
              onChange={(val) => setSelectedRole(val)}
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

      <Modal
        isVisible={addMemberModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        onBackdropPress={() => setAddMemberModalVisible(false)}
      >
        <View className="justify-center items-center">
          <View className="bg-white rounded-2xl p-6">
            <Text className="text-lg font-bold text-center mb-3">
              Thêm thành viên
            </Text>

            {/* Thêm trường nhập liệu cho số điện thoại */}
            <TextInputField
              iconName="phone"
              label="Số điện thoại"
              value={newMemberPhoneNumber}
              onChangeText={setNewMemberPhoneNumber} // Cập nhật state khi người dùng nhập
              keyboardType="phone-pad" // Chỉ nhận đầu vào là số
              placeholder="Nhập số điện thoại"
            />

            {/* Thêm SelectField cho mối quan hệ */}
            <SelectField
              label="Quan hệ"
              data={relationshipOptions}
              value={newMemberRole || ""}
              placeholder="Thay đổi quan hệ"
              onChange={(val) => setNewMemberRole(val)}
            />

            {/* Các nút Hủy và Thêm */}
            <View className="flex-row justify-around mt-3 gap-5">
              <TouchableOpacity
                className="py-3 px-6 bg-gray-100 w-2/5 items-center rounded-full"
                onPress={() => setAddMemberModalVisible(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 px-6 bg-blue-500 w-2/5 items-center rounded-full"
                onPress={() => handleAddMember()}
              >
                <Text className="text-white">Thêm</Text>
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
