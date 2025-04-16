import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";

import { storeAvt, storeFullName } from "../../services/storage";
import { pickImageFromLibrary } from "../../utils/imagePicker";
import {
  isValidEmail,
  isValidPhone,
  isValidCCCD,
} from "../../utils/validators";
import {
  uploadAvatar,
  fetchPatientDetail,
  updatePatientDetail,
} from "../../api/Patient";
import { Patient } from "../../types/types";

import LoadingModal from "../../components/ui/LoadingModal";
import TextInputField from "../../components/ui/TextInputField";
import DatePickerField from "../../components/ui/DatePickerField";
import SelectField from "../../components/ui/SelectField";

import dayjs from "dayjs";

const genderOptions = [
  { title: "Nam", icon: "gender-male" },
  { title: "Nữ", icon: "gender-female" },
  { title: "Khác", icon: "gender-transgender" },
];

export default function PersonalInfo({ navigation }: any) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const getPatientDetail = async () => {
        setLoading(true);
        const data = await fetchPatientDetail();
        if (data) {
          setPatient(data);
          setAvatar(data.avatarUrl);
        }
        setLoading(false);
      };
      getPatientDetail();
    }, [])
  );
  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) {
      setAvatar(uri); // chỉ hiển thị ảnh mới tạm thời
    }
  };

  const handleSave = async () => {
    setModalVisible(false);
    if (!patient) return;

    setLoading(true);
    try {
      let avatarUrlToSave = patient.avatarUrl;

      // Nếu avatar đã chọn khác với avatar gốc, thì upload và cập nhật
      if (avatar && avatar !== patient.avatarUrl) {
        const fileType = avatar.split(".").pop();
        const fileName = `${patient.patientCode}.${fileType}`;
        const uploadResult = await uploadAvatar(avatar, fileName);
        if (uploadResult && uploadResult[0]?.url) {
          avatarUrlToSave = uploadResult[0].url;
          await storeAvt(avatarUrlToSave);
        } else {
          Toast.show({
            type: "error",
            text1: "Cập nhật thất bại",
            text2: "Đã xảy ra lỗi khi cập nhật ảnh đại diện.",
          });
          return;
        }
      }

      // VALIDATION
      if (patient.email && !isValidEmail(patient.email)) {
        Toast.show({
          type: "error",
          text1: "Cập nhật thất bại",
          text2: "Email không hợp lệ",
        });
        return;
      }

      if (patient.phone && !isValidPhone(patient.phone)) {
        Toast.show({
          type: "error",
          text1: "Cập nhật thất bại",
          text2: "Số điện thoại không hợp lệ",
        });

        return;
      }

      if (patient.cccd && !isValidCCCD(patient.cccd)) {
        Toast.show({
          type: "error",
          text1: "Cập nhật thất bại",
          text2: "Số CCCD không hợp lệ",
        });
        return;
      }

      const payload = {
        ho_va_ten: patient.fullName ?? "",
        avt_url: avatarUrlToSave ?? "",
        cccd: patient.cccd ?? "",
        dan_toc: patient.ethnicity ?? "",
        quoc_tich: patient.nationality ?? "",
        dia_chi: patient.address ?? "",
        email: patient.email ?? "",
        sdt: patient.phone ?? "",
        ngay_sinh: patient.birthDate ?? "",
        gioi_tinh: patient.gender ?? "",
      };

      await updatePatientDetail(patient.patientCode, payload);
      await storeFullName(payload.ho_va_ten); // cập nhật full name

      setPatient({ ...patient, avatarUrl: avatarUrlToSave }); // cập nhật lại state
      Toast.show({
        type: "success",
        text1: "Cập nhật thành công",
        text2: "Thông tin cá nhân đã được lưu.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Cập nhật thất bại",
        text2: "Đã xảy ra lỗi khi cập nhật thông tin.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-5 ">
      {loading ? (
        <LoadingModal />
      ) : (
        <>
          <View className="items-center mb-6">
            <TouchableOpacity onPress={pickImage} className="relative">
              <Image
                source={
                  avatar
                    ? { uri: avatar }
                    : require("../../assets/avatar-placeholder.png")
                }
                className="w-48 h-48 rounded-full"
              />
              <View className="absolute bottom-1 right-1 bg-gray-200 p-1 rounded-full">
                <FontAwesome name="pencil" size={16} color="black" />
              </View>
            </TouchableOpacity>
            <Text className="mt-4 text-xl font-semibold">
              {patient?.fullName}
            </Text>
          </View>

          {patient && (
            <>
              <TextInputField
                label="Họ và tên"
                iconName="account"
                placeholder="Họ và tên"
                value={patient.fullName}
                onChangeText={(text) =>
                  setPatient({ ...patient, fullName: text })
                }
              />
              <TextInputField
                label="Số điện thoại"
                iconName="phone"
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
                value={patient.phone}
                onChangeText={(text) => setPatient({ ...patient, phone: text })}
              />
              <TextInputField
                label="Email"
                iconName="email"
                placeholder="Email"
                keyboardType="email-address"
                value={patient.email}
                onChangeText={(text) => setPatient({ ...patient, email: text })}
              />
              <DatePickerField
                label="Ngày sinh"
                date={new Date(patient.birthDate)}
                onChange={(date) =>
                  setPatient({
                    ...patient,
                    birthDate: dayjs(date).format("YYYY-MM-DD"),
                  })
                }
              />
              <SelectField
                label="Giới tính"
                data={genderOptions}
                value={patient.gender || ""}
                placeholder="Chọn giới tính"
                onChange={(val) => setPatient({ ...patient, gender: val })}
              />
              <TextInputField
                label="Địa chỉ"
                iconName="map-marker"
                placeholder="Địa chỉ"
                value={patient.address || ""}
                onChangeText={(text) =>
                  setPatient({ ...patient, address: text })
                }
              />
              <TextInputField
                label="Quốc tịch"
                iconName="earth"
                placeholder="Quốc tịch"
                value={patient.nationality || ""}
                onChangeText={(text) =>
                  setPatient({ ...patient, nationality: text })
                }
              />
              <TextInputField
                label="Dân tộc"
                iconName="account-group"
                placeholder="Dân tộc"
                value={patient.ethnicity || ""}
                onChangeText={(text) =>
                  setPatient({ ...patient, ethnicity: text })
                }
              />
              <TextInputField
                label="Số CCCD"
                iconName="card-account-details"
                placeholder="CCCD"
                value={patient.cccd || ""}
                onChangeText={(text) => setPatient({ ...patient, cccd: text })}
              />
              <TouchableOpacity
                className="py-3 px-6 bg-blue-500 items-center rounded-full"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-white">Lưu</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
      <View className="mb-10"></View>
      {/* Modal Xác Nhận Lưu */}
      <Modal
        isVisible={modalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="justify-center items-center">
          <View className="bg-white rounded-2xl p-6 items-center">
            <Text className="text-lg font-bold text-center">
              Xác nhận lưu thay đổi
            </Text>

            <Text className="text-center text-gray-500 my-5">
              Bạn có chắc muốn lưu thay đổi?
            </Text>
            <View className="flex-row justify-around mt-4 gap-5">
              <TouchableOpacity
                className="py-3 px-6 bg-gray-100 w-2/5 items-center rounded-full"
                onPress={() => setModalVisible(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 px-6 bg-blue-500 w-2/5 items-center rounded-full"
                onPress={handleSave}
              >
                <Text className="text-white">Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
