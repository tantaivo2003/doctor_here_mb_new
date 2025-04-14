import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
// import { someVideoCallLibrary, LocalVideo, RemoteVideo } from 'your-video-call-library'; // Thay thế bằng thư viện gọi video bạn chọn

const VideoCallScreen: React.FC = () => {
  // State quản lý trạng thái tắt/bật micro
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  // State quản lý trạng thái tắt/bật video
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  // State lưu trữ các stream video của người tham gia khác (key có thể là ID người dùng)
  const [remoteStreams, setRemoteStreams] = useState({});
  // Ref để truy cập view hiển thị video cục bộ (video của chính mình)
  const localVideoRef = useRef(null);

  // useEffect chạy một lần khi component mount và một lần khi unmount
  useEffect(() => {
    // TODO: Khởi tạo SDK gọi video ở đây
    // Ví dụ: someVideoCallLibrary.initialize();

    // TODO: Thiết lập các trình lắng nghe sự kiện cho signaling (thông báo)
    // Ví dụ:
    // someVideoCallLibrary.on('remoteStreamAdded', (event) => {
    //   setRemoteStreams(prevStreams => ({ ...prevStreams, [event.userId]: event.stream }));
    // });
    // someVideoCallLibrary.on('participantLeft', (userId) => {
    //   const newStreams = { ...remoteStreams };
    //   delete newStreams[userId];
    //   setRemoteStreams(newStreams);
    // });

    // TODO: Bắt đầu stream video cục bộ
    // Ví dụ:
    // someVideoCallLibrary.startLocalVideo(localVideoRef.current);

    // TODO: Truy cập camera và micro của thiết bị
    // Bạn có thể cần sử dụng một thư viện như 'react-native-webrtc' hoặc SDK của nhà cung cấp dịch vụ gọi video

    return () => {
      // TODO: Dọn dẹp tài nguyên khi component bị hủy
      // Ví dụ:
      // someVideoCallLibrary.stopLocalVideo();
      // someVideoCallLibrary.disconnect();
    };
  }, []); // Mảng dependency rỗng nghĩa là effect chỉ chạy khi mount và unmount

  // Hàm xử lý việc tắt/bật micro
  const toggleAudio = () => {
    // TODO: Logic để tắt/bật audio cục bộ (thường thông qua SDK gọi video)
    setIsAudioMuted(!isAudioMuted);
  };

  // Hàm xử lý việc tắt/bật video
  const toggleVideo = () => {
    // TODO: Logic để tắt/bật video cục bộ (thường thông qua SDK gọi video)
    setIsVideoEnabled(!isVideoEnabled);
  };

  // Hàm xử lý việc kết thúc cuộc gọi
  const hangUp = () => {
    // TODO: Logic để kết thúc cuộc gọi
    // Ví dụ: Gửi tín hiệu kết thúc cuộc gọi đến những người tham gia khác
    // Ví dụ: Điều hướng người dùng ra khỏi màn hình gọi video
  };

  return (
    <View className="flex-1 bg-black">
      {/* View hiển thị video cục bộ */}
      {isVideoEnabled && (
        <View className="absolute top-4 right-4 w-32 h-48 rounded-md overflow-hidden z-10">
          {/* TODO: Component hiển thị video cục bộ (thay thế Placeholder) */}
          {/* Ví dụ: <LocalVideo ref={localVideoRef} /> */}
          <Text className="text-white">Local Video (Placeholder)</Text>
        </View>
      )}

      {/* View hiển thị video của những người tham gia khác */}
      <View className="flex-1 justify-center items-center">
        {/* Duyệt qua danh sách các stream video từ xa và hiển thị chúng */}
        {Object.values(remoteStreams).map((stream, index) => (
          <View
            key={index}
            className="w-full h-full rounded-md overflow-hidden"
          >
            {/* TODO: Component hiển thị video từ xa (thay thế Placeholder) */}
            {/* Ví dụ: <RemoteVideo streamId={stream.id} /> */}
            <Text className="text-white">
              Remote Video {index + 1} (Placeholder)
            </Text>
          </View>
        ))}
        {/* Hiển thị thông báo nếu không có người tham gia khác */}
        {Object.keys(remoteStreams).length === 0 && (
          <Text className="text-white text-lg">
            Đang chờ người tham gia khác...
          </Text>
        )}
      </View>

      {/* View chứa các nút điều khiển */}
      <View className="absolute bottom-8 left-0 right-0 flex-row justify-around items-center">
        {/* Nút tắt/bật micro */}
        <TouchableOpacity
          onPress={toggleAudio}
          className="bg-gray-800 rounded-full p-4"
        >
          <Text className="text-white">
            {isAudioMuted ? "Bật tiếng" : "Tắt tiếng"}
          </Text>
        </TouchableOpacity>
        {/* Nút tắt/bật video */}
        <TouchableOpacity
          onPress={toggleVideo}
          className="bg-red-500 rounded-full p-4"
        >
          <Text className="text-white">
            {isVideoEnabled ? "Tắt video" : "Bật video"}
          </Text>
        </TouchableOpacity>
        {/* Nút kết thúc cuộc gọi */}
        <TouchableOpacity
          onPress={hangUp}
          className="bg-red-600 rounded-full p-4"
        >
          <Text className="text-white">Kết thúc</Text>
        </TouchableOpacity>
        {/* TODO: Thêm các nút điều khiển khác như chuyển camera */}
      </View>
    </View>
  );
};

export default VideoCallScreen;
