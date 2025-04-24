import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import NotificationModal from "../../components/ui/NotificationModal";
import Modal from "react-native-modal";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { getAvt, getUserID } from "../../services/storage";
import { stringeeClient } from "../../services/stringeeConfig";
import {
  StringeeCall2,
  StringeeVideoView,
  StringeeCall2Listener,
} from "stringee-react-native-v2";

const VideoCallScreen: React.FC = ({ navigation, route }: any) => {
  const { doctorID } = route.params;
  const [patientAvt, setPatientAvt] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [localTrack, setLocalTrack] = useState<any>(null);
  const [remoteTrack, setRemoteTrack] = useState<any>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationType, setNotificationType] = useState("success"); // Hoặc "error"
  const [notificationMessage, setNotificationMessage] = useState("");
  const [call, setCall] = useState<StringeeCall2 | null>(null);

  const localVideoRef = useRef(null);

  // const stringeeCall2Listener = new StringeeCall2Listener();

  // useEffect(() => {
  //   // Listen for incoming calls and initialize the call
  //   stringeeClientListener.onIncomingCall2 = (client, incomingCall) => {
  //     // Handle incoming call
  //     incomingCall
  //       .initAnswer()
  //       .then(() => {
  //         console.log("initAnswer success");
  //         incomingCall
  //           .answer()
  //           .then(() => {
  //             console.log("answer success");
  //             setCall(incomingCall); // Set the active call
  //           })
  //           .catch(console.error);
  //       })
  //       .catch(console.error);
  //   };
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const avt = await getAvt();
      setPatientAvt(avt);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPatientId = async () => {
      const id = await getUserID();
      setPatientId(id);
    };
    fetchPatientId();
  }, []);
  // Hàm xử lý việc tắt/bật micro
  const toggleAudio = () => {
    // if (call) {
    //   call
    //     .mute(!isAudioMuted)
    //     .then(() => {
    //       setIsAudioMuted(!isAudioMuted);
    //     })
    //     .catch(console.error);
    // }
  };

  // Hàm xử lý việc tắt/bật video
  const toggleVideo = () => {
    // if (call) {
    //   call
    //     .enableVideo(!isVideoEnabled)
    //     .then(() => {
    //       setIsVideoEnabled(!isVideoEnabled);
    //     })
    //     .catch(console.error);
    // }
  };

  // Hàm xử lý việc kết thúc cuộc gọi
  const hangUp = () => {
    // if (call) {
    //   call
    //     .hangup()
    //     .then(() => {
    //       console.log("hangup success");
    //       navigation.goBack(); // Go back after hanging up
    //     })
    //     .catch(console.error);
    // }
  };

  // // Handle local and remote tracks
  // stringeeCall2Listener.onReceiveLocalTrack = (call2, videoTrack) => {
  //   setLocalTrack(videoTrack);
  //   console.log("onReceiveLocalTrack");
  // };

  // stringeeCall2Listener.onReceiveRemoteTrack = (call2, videoTrack) => {
  //   setRemoteTrack(videoTrack);
  //   console.log("onReceiveRemoteTrack");
  // };

  // // Make a call
  // const makeCall = () => {
  //   if (!patientId || !doctorID) {
  //     console.error("Missing patientId or doctorID");
  //     return;
  //   }

  //   const newCall = new StringeeCall2({
  //     stringeeClient,
  //     from: patientId,
  //     to: doctorID,
  //   });
  //   newCall.setListener(stringeeCall2Listener);
  //   newCall
  //     .makeCall()
  //     .then(() => {
  //       console.log("makeCall success");
  //       setCall(newCall); // Set the active call
  //     })
  //     .catch(console.error);
  // };

  return (
    <View className="flex-1 bg-black">
      {/* Hiển thị avatar của bệnh nhân */}
      <View className="absolute top-4 right-4 w-32 h-48 rounded-md z-10">
        {isVideoEnabled ? (
          <Text>Video</Text>
        ) : (
          <Image
            source={
              patientAvt
                ? { uri: patientAvt }
                : require("../../assets/avatar-placeholder.png")
            }
            className="h-full w-full rounded-md"
          />
        )}
      </View>

      {/* Hiển thị video của bác sĩ */}
      <View className="flex-1 justify-center items-center">
        {/* {remoteTrack && (
          <StringeeVideoView
            style={{ flex: 1 }}
            videoTrack={remoteTrack}
            local={false}
          />
        )} */}
      </View>

      {/* Hiển thị video của bệnh nhân */}
      <View className="absolute top-10 left-4 w-32 h-48 rounded-md z-20">
        {/* {localTrack && (
          <StringeeVideoView
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
            videoTrack={localTrack}
            local={true}
          />
        )} */}
      </View>

      {/* Các nút điều khiển cuộc gọi */}
      <View className="absolute bottom-8 left-0 right-0 flex-row justify-center items-center gap-10">
        <TouchableOpacity
          onPress={toggleAudio}
          className="bg-teal-600 rounded-full p-4"
        >
          {isAudioMuted ? (
            <Feather name="mic-off" size={30} color="white" />
          ) : (
            <Feather name="mic" size={30} color="white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={hangUp}
          className="bg-red-500 rounded-full p-4"
        >
          <MaterialIcons name="call-end" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleVideo}
          className="bg-teal-600 rounded-full p-4"
        >
          {isVideoEnabled ? (
            <Feather name="video" size={30} color="white" />
          ) : (
            <Feather name="video-off" size={30} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {/* Modal thông báo */}
      <NotificationModal
        visible={notificationVisible}
        type={notificationType}
        message={notificationMessage}
        onClose={() => setNotificationVisible(false)}
      />

      {/* Modal gia hạn */}
      <Modal
        isVisible={modalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="justify-center items-center">
          <View className="bg-white rounded-2xl p-6 items-center">
            <Text className="text-lg font-bold text-center">
              Xóa khỏi bác sĩ yêu thích?
            </Text>
            <View className="flex-row justify-around mt-4 gap-5">
              <TouchableOpacity
                className="py-3 px-6 bg-gray-100 w-2/5 items-center rounded-full"
                onPress={() => setModalVisible(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity className="py-3 px-6 bg-gray-900 w-2/5 items-center rounded-full">
                <Text className="text-white">Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VideoCallScreen;
