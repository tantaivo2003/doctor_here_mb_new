import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";

import { storeAvt, getAuthData } from "../../services/storage";
import { pickImageFromLibrary } from "../../utils/imagePicker";
import { validateInsuranceInfo } from "../../utils/validators";
import { uploadAvatar, fetchPatientDetail } from "../../api/Patient";
import { fetchInsuranceInfo, updateInsuranceInfo } from "../../api/Patient";
import { InsuranceInfo } from "../../types/types";

import LoadingModal from "../../components/ui/LoadingModal";
import TextInputField from "../../components/ui/TextInputField";
import DatePickerField from "../../components/ui/DatePickerField";

import dayjs from "dayjs";

export default function HealthInsurance({ navigation }: any) {
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo | null>(
    null
  );
  const [patientId, setPatientId] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const getInsuranceInfo = async () => {
        setLoading(true);
        const userData = await getAuthData();
        setAvatar(userData?.avtUrl || null);
        setFullName(userData?.fullName || null);
        setPatientId(userData?.userId || null);
        const data = await fetchInsuranceInfo(userData?.userId || "");
        if (data) {
          setInsuranceInfo(data);
        }
        setLoading(false);
      };
      getInsuranceInfo();
    }, [])
  );

  const handleSave = async () => {
    if (!insuranceInfo || !patientId) return;

    setLoading(true);
    const validation = validateInsuranceInfo(insuranceInfo);
    if (!validation.isValid) {
      setModalVisible(false);
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Lỗi xác thực",
        text2: validation.message,
      });
      return;
    }

    try {
      console.log("Insurance Info", insuranceInfo);
      console.log("Patient ID", patientId);

      await updateInsuranceInfo(patientId, {
        ten_bao_hiem: insuranceInfo.registeredHospital,
        so_the_bhyt: insuranceInfo.insuranceCode,
        ngay_cap: insuranceInfo.issuedDate,
        ngay_het_han: insuranceInfo.expiredDate,
        tien_su_benh: insuranceInfo.medicalHistory,
        nhom_mau: insuranceInfo.bloodType,
      });

      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Thông tin bảo hiểm đã được cập nhật 🎉",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Thất bại",
        text2: "Cập nhật thông tin bảo hiểm thất bại 😢",
      });
    } finally {
      setModalVisible(false);
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
            <TouchableOpacity className="relative">
              <Image
                source={
                  avatar
                    ? { uri: avatar }
                    : require("../../assets/avatar-placeholder.png")
                }
                className="w-48 h-48 rounded-full"
              />
            </TouchableOpacity>
            <Text className="mt-4 text-xl font-semibold">{fullName}</Text>
          </View>
          {insuranceInfo && (
            <>
              <TextInputField
                iconName="file-document"
                placeholder="Tiền sử bệnh"
                value={insuranceInfo.medicalHistory}
                label="Tiền sử bệnh"
                onChangeText={(text) =>
                  setInsuranceInfo({ ...insuranceInfo, medicalHistory: text })
                }
              />
              <TextInputField
                iconName="water"
                placeholder="Nhóm máu"
                value={insuranceInfo.bloodType}
                label="Nhóm máu"
                onChangeText={(text) =>
                  setInsuranceInfo({ ...insuranceInfo, bloodType: text })
                }
              />
              <TextInputField
                iconName="card-account-details"
                placeholder="Mã BHYT"
                value={insuranceInfo.insuranceCode}
                label="Mã BHYT"
                onChangeText={(text) =>
                  setInsuranceInfo({ ...insuranceInfo, insuranceCode: text })
                }
              />
              <TextInputField
                iconName="hospital"
                placeholder="Bệnh viện đăng ký"
                value={insuranceInfo.registeredHospital}
                label="Bệnh viện đăng ký"
                onChangeText={(text) =>
                  setInsuranceInfo({
                    ...insuranceInfo,
                    registeredHospital: text,
                  })
                }
              />
              <DatePickerField
                label="Ngày cấp"
                date={new Date(insuranceInfo.issuedDate)}
                onChange={(date) =>
                  setInsuranceInfo({
                    ...insuranceInfo,
                    issuedDate: dayjs(date).format("YYYY-MM-DD"),
                  })
                }
              />
              <DatePickerField
                label="Ngày hết hạn"
                date={new Date(insuranceInfo.expiredDate)}
                onChange={(date) =>
                  setInsuranceInfo({
                    ...insuranceInfo,
                    expiredDate: dayjs(date).format("YYYY-MM-DD"),
                  })
                }
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
