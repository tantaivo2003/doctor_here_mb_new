import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message"; // nếu bạn dùng Toast
import { predictDiabetes } from "../../api/PredictDiabetes";
import { getUserID } from "../../services/storage";
import LoadingModal from "../../components/ui/LoadingModal";

const DiabetesPredictionScreen = () => {
  const [tinhTrangHutThuoc, setTinhTrangHutThuoc] = useState("never");
  const [nongDoHbA1c, setNongDoHbA1c] = useState("");
  const [ketQua, setKetQua] = useState<boolean>();
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGuiThongTin = async () => {
    if (!tinhTrangHutThuoc || !nongDoHbA1c) {
      Toast.show({
        type: "error",
        text1: "Vui lòng điền đầy đủ thông tin!",
      });
      return;
    }

    const HbA1c = parseFloat(nongDoHbA1c);
    if (isNaN(HbA1c)) {
      Toast.show({
        type: "error",
        text1: "Nồng độ HbA1c không hợp lệ!",
      });
      return;
    }

    try {
      setLoading(true);
      const ptID = await getUserID();
      if (!ptID) {
        Toast.show({
          type: "error",
          text1: "Không tìm thấy ID người dùng!",
        });
        return;
      }
      const response = await predictDiabetes(ptID, {
        smoking_history: tinhTrangHutThuoc,
        HbA1c_level: HbA1c,
      });

      setKetQua(response);
      setShowResult(true);
      setLoading(false);
    } catch (error: any) {
      let errorText = "Đã xảy ra lỗi không xác định";

      const message = error.message;
      const jsonMatch = message.match(/{.*}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        errorText = parsed.error || errorText;
      } else {
        errorText = message;
      }

      Toast.show({
        type: "error",
        text1: "Lỗi khi gửi dữ liệu!",
        text2: errorText,
      });
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      {loading ? (
        <LoadingModal />
      ) : (
        <>
          <View className="mb-4">
            <Text className="text-lg font-bold mb-2">
              Tình trạng hút thuốc:
            </Text>
            <View className="bg-white border border-gray-300 rounded-lg shadow-sm px-3">
              <Picker
                selectedValue={tinhTrangHutThuoc}
                onValueChange={(itemValue) => setTinhTrangHutThuoc(itemValue)}
              >
                <Picker.Item label="Chưa bao giờ" value="never" />
                <Picker.Item label="Đã từng" value="former" />
                <Picker.Item label="Đang sử dụng" value="current" />
              </Picker>
            </View>
          </View>

          {/* Nồng độ HbA1c */}
          <View className="mb-6">
            <Text className="text-lg font-bold mb-2">
              Nồng độ HbA1c (trong 2-3 tháng):
            </Text>
            <View className="">
              <TextInput
                placeholder="Nhập số"
                value={nongDoHbA1c}
                onChangeText={setNongDoHbA1c}
                keyboardType="numeric"
                className="rounded-lg px-5 py-5 text-black bg-white border border-gray-300 shadow-sm"
              />
            </View>
          </View>
          {/* Nút Gửi thông tin */}
          <TouchableOpacity
            onPress={handleGuiThongTin}
            className="bg-teal-500 rounded-lg py-3 items-center shadow-md"
          >
            <Text className="text-white font-semibold text-lg">
              Gửi thông tin
            </Text>
          </TouchableOpacity>

          {/* Kết quả dự đoán */}
          {showResult &&
            (!ketQua ? (
              <View className="mt-6">
                <View className="bg-green-200 rounded-lg py-3 items-center">
                  <Text className="text-green-700 font-semibold text-base">
                    Bạn hiện không có nguy cơ bị tiểu đường
                  </Text>
                </View>
              </View>
            ) : (
              <View className="mt-6">
                <View className="bg-red-200 rounded-lg py-3 items-center">
                  <Text className="text-red-700 font-semibold text-base">
                    Bạn có nguy cơ tiểu đường
                  </Text>
                </View>
              </View>
            ))}

          <View className="mt-10">
            <Text className="text-lg font-bold mb-2">Chỉ số HbA1c là gì?:</Text>
            <Text className="text-base text-gray-700">
              Xét nghiệm hemoglobin A1c (HbA1c) phản ánh lượng glucose trong máu
              gắn với hemoglobin trong ba tháng qua. Ba tháng là tuổi thọ trung
              bình của một tế bào hồng cầu. Mức glucose trong máu càng cao thì
              lượng glucose gắn vào hemoglobin càng nhiều. Mức HbA1c cao là dấu
              hiệu của bệnh tiểu đường (đái tháo đường).
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default DiabetesPredictionScreen;
