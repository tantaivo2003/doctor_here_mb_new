import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

//Stream io
import {
  Call,
  StreamCall,
  useStreamVideoClient,
  useCallStateHooks,
  CallingState,
  CallContent,
  CallControlProps,
  HangUpCallButton,
  ToggleAudioPublishingButton as ToggleMic,
  ToggleVideoPublishingButton as ToggleCamera,
  useCall,
} from "@stream-io/video-react-native-sdk";

import NotificationModal from "../../components/ui/NotificationModal";
import Modal from "react-native-modal";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import LoadingAnimation from "../../components/ui/LoadingAnimation";

import { getAvt, getUserID } from "../../services/storage";

const VideoCallScreen: React.FC = ({ navigation, route }: any) => {
  const { doctorId, callId, endTime } = route.params;
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

  const localVideoRef = useRef(null);

  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const callRef = useRef<Call | null>(null);

  const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
  const [userId, setUserId] = useState<string | null>("BN0000006");

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     const id = await getUserID();
  //     setUserId(id);
  //   };
  //   fetchUserId();
  // }, []);

  useEffect(() => {
    // const _call = client?.call("default", callId);
    // _call?.join({ create: true }).then(() => setCall(_call));
    const getCall = async () => {
      console.log("getcall");
      if (!userId) {
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/video_call/call/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userId,
          callID: callId,
        }),
      });

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log("Call response:", data);
        const _call = client?.call("default", callId);
        _call?.join({ create: true }).then(() => setCall(_call));
      } else {
        console.error("Error fetching call:", response.statusText);
        setNotificationVisible(true);
        setNotificationType("error");
        setNotificationMessage("Không thể tham gia cuộc gọi.");
      }
    };

    getCall();
  }, [client, callId, userId]);

  useEffect(() => {
    return () => {
      // cleanup the call on unmount if the call was not left already
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);

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

  //Kết thúc cuôc gọi khi hết thời gian
  const hangUp = async () => {
    await call?.leave();
    navigation.goBack();
  };

  useEffect(() => {
    if (!endTime) return;

    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const timeout = end - now;

    if (timeout > 0) {
      const timer = setTimeout(() => {
        hangUp(); // tự động rời cuộc gọi
      }, timeout);

      return () => clearTimeout(timer); // dọn dẹp nếu unmount
    } else {
      // Nếu đã quá thời gian thì rời ngay
      hangUp();
    }
  }, [endTime]);
  //Các nút tùy chỉnh
  const HangupCallButton = () => {
    const call = useCall();

    const hangUp = async () => {
      await call?.leave();
      navigation.goBack();
    };

    return (
      <TouchableOpacity
        onPress={hangUp}
        className="bg-red-500 rounded-full p-4"
      >
        <MaterialIcons name="call-end" size={30} color="white" />
      </TouchableOpacity>
    );
  };

  const ToggleVideoButton = () => {
    const call = useCall();
    const { useCameraState } = useCallStateHooks();
    const { status } = useCameraState();
    const toggleVideo = async () => {
      await call?.camera.toggle();
      setIsVideoEnabled((prev) => !prev);
    };

    return (
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
    );
  };

  const ToggleAudioButton = () => {
    const call = useCall();
    const { useMicrophoneState } = useCallStateHooks();
    const { status } = useMicrophoneState();
    const toggleAudio = async () => {
      await call?.microphone.toggle();
      setIsAudioMuted((prev) => !prev);
    };

    return (
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
    );
  };

  // Các nút điều khiển cuộc gọi
  const CustomCallControls = (props: CallControlProps) => {
    return (
      <View className="absolute bottom-8 left-0 right-0 flex-row justify-center items-center gap-10">
        <ToggleAudioButton />
        <ToggleVideoButton />
        <HangupCallButton />
      </View>
    );
  };

  if (!call) {
    return (
      <View className="flex-1 bg-blue-50 justify-center items-center px-6">
        <Ionicons name="time-outline" size={64} color="#3B82F6" />
        <Text className="text-xl font-semibold text-blue-700 mt-4 text-center">
          Đang kết nối với bác sĩ...
        </Text>

        <LoadingAnimation />
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <View className="flex-1 bg-white justify-center">
        {/* <CallContent onHangupCallHandler={navigation.goBack()} /> */}
        <CallContent CallControls={CustomCallControls} />
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
    </StreamCall>
  );
};

export default VideoCallScreen;
