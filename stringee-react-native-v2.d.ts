// types/stringee-react-native-v2.d.ts

declare module "stringee-react-native-v2" {
  import * as React from "react";
  import { ViewStyle } from "react-native";
  // Định nghĩa kiểu StringeeServerAddress (nếu cần thiết)
  interface StringeeServerAddress {
    address: string; // Địa chỉ máy chủ
    port: number; // Cổng kết nối
  }

  // Định nghĩa class StringeeClientListener
  export class StringeeClientListener {
    // Phương thức gọi khi kết nối thành công
    onConnect(stringeeClient: StringeeClient, userId: string): void {}

    // Phương thức gọi khi kết nối bị ngắt
    onDisConnect(stringeeClient: StringeeClient): void {}

    // Phương thức gọi khi kết nối thất bại
    onFailWithError(
      stringeeClient: StringeeClient,
      code: number,
      message: string
    ): void {}

    // Phương thức gọi khi token hết hạn
    onRequestAccessToken(stringeeClient: StringeeClient): void {}

    // Phương thức gọi khi có cuộc gọi đến (StringeeCall)
    onIncomingCall(stringeeClient: StringeeClient, stringeeCall: any): void {}

    // Phương thức gọi khi có cuộc gọi đến (StringeeCall2)
    onIncomingCall2(stringeeClient: StringeeClient, stringeeCall2: any): void {}

    // Phương thức gọi khi nhận tin nhắn tuỳ chỉnh
    onCustomMessage(
      stringeeClient: StringeeClient,
      from: string,
      data: object
    ): void {}

    // Phương thức gọi khi có sự thay đổi trong chat (conversation/message)
    onObjectChange(
      stringeeClient: StringeeClient,
      objectType: any,
      objectChanges: Array<any>,
      changeType: any
    ): void {}

    // Phương thức gọi khi nhận yêu cầu chat
    onReceiveChatRequest(
      stringeeClient: StringeeClient,
      chatRequest: ChatRequest
    ): void {}

    // Phương thức gọi khi nhận yêu cầu chuyển giao chat
    onReceiveTransferChatRequest(
      stringeeClient: StringeeClient,
      chatRequest: ChatRequest
    ): void {}

    // Phương thức gọi khi hết thời gian chờ để trả lời chat
    onTimeoutAnswerChat(
      stringeeClient: StringeeClient,
      chatRequest: ChatRequest
    ): void {}

    // Phương thức gọi khi hết thời gian chờ trong hàng đợi chat
    onTimeoutInQueue(
      stringeeClient: StringeeClient,
      convId: string,
      customerId: string,
      customerName: string
    ): void {}

    // Phương thức gọi khi cuộc trò chuyện kết thúc
    onConversationEnded(
      stringeeClient: StringeeClient,
      convId: string,
      endedBy: string
    ): void {}

    // Phương thức gọi khi người dùng bắt đầu gõ
    onUserBeginTyping(
      stringeeClient: StringeeClient,
      convId: string,
      userId: string,
      displayName: string
    ): void {}

    // Phương thức gọi khi người dùng kết thúc việc gõ
    onUserEndTyping(
      stringeeClient: StringeeClient,
      convId: string,
      userId: string,
      displayName: string
    ): void {}
  }

  // Định nghĩa kiểu StringeeClient
  export class StringeeClient {
    userId: string; // ID của người dùng
    isConnected: boolean; // Trạng thái kết nối với server

    // Constructor để tạo đối tượng StringeeClient
    constructor(options?: {
      serverAddresses?: StringeeServerAddress[];
      baseUrl?: string;
      stringeeXBaseUrl?: string;
    });

    // Phương thức để thiết lập listener cho client
    setListener(stringeeClientListener: StringeeClientListener): void;

    // Phương thức kết nối với server
    connect(token: string): void;

    // Phương thức ngắt kết nối với server
    disconnect(): void;

    // Phương thức đăng ký push notification
    registerPush(
      deviceToken: string,
      isProduction: boolean,
      isVoip: boolean
    ): Promise<void>;

    // Phương thức đăng ký push notification và xóa các token cũ
    registerPushAndDeleteOthers(
      deviceToken: string,
      isProduction: boolean,
      isVoip: boolean,
      packageNames: string[]
    ): Promise<void>;

    // Phương thức hủy đăng ký push notification
    unregisterPush(deviceToken: string): Promise<void>;

    // Phương thức gửi tin nhắn tuỳ chỉnh tới người dùng khác
    sendCustomMessage(toUserId: string, message: string): Promise<void>;
  }

  // export type ObjectType = "conversation" | "message"; // Các loại đối tượng có thể thay đổi
  // export type ChangeType = "insert" | "update" | "delete"; // Các loại thay đổi của đối tượng
  export interface ChatRequest {
    requestId: string;
    customerId: string;
    customerName: string;
    // Các thuộc tính khác của yêu cầu chat
  }
  // export type CallType =
  //   | "appToAppOutgoing"
  //   | "appToAppIncoming"
  //   | "appToPhone"
  //   | "phoneToApp"; // Loại cuộc gọi
  // export type VideoResolution = "normal" | "hd"; // Độ phân giải video

  export class StringeeCall2 {
    callId: string;
    serial?: number; // Chỉ có trên iOS
    from: string;
    fromAlias: string;
    to: string;
    toAlias: string;
    callType: any;
    isVideoCall: boolean;
    customData: string;
    videoResolution: any;
    uuid: string;

    constructor(props: {
      stringeeClient: StringeeClient;
      from: string;
      to: string;
    });

    setListener(stringeeCall2Listener: StringeeCall2Listener): void;
    makeCall(): Promise<void>;
    initAnswer(): Promise<void>;
    answer(): Promise<void>;
    hangup(): Promise<void>;
    reject(): Promise<void>;
    sendDtmf(dtmf: string): Promise<void>;
    sendCallInfo(callInfo: string): Promise<void>;
    getCallStats(): Promise<string>;
    switchCamera(): Promise<void>;
    enableVideo(enabled: boolean): Promise<void>;
    mute(mute: boolean): Promise<void>;
    setSpeakerphoneOn(on: boolean): Promise<void>;
    resumeVideo(): Promise<void>; // Chỉ Android
    generateUUID(): Promise<void>; // Chỉ iOS
  }

  // export type SignalingState =
  //   | "calling"
  //   | "ringing"
  //   | "answered"
  //   | "ended"
  //   | "busy";
  // export type MediaState = "connected" | "disconnected";
  // export type MediaType = "audio" | "video";
  // export type AudioDevice =
  //   | "speakerPhone"
  //   | "wiredHeadset"
  //   | "earpiece"
  //   | "bluetooth"
  //   | "none";

  export interface StringeeVideoTrack {
    // Có thể mở rộng thêm nếu cần render ra view
    trackId?: string;
    isLocal?: boolean;
  }

  export class StringeeCall2Listener {
    constructor();

    onChangeSignalingState?(
      stringeeCall2: StringeeCall2,
      signalingState: any,
      reason: string,
      sipCode: number,
      sipReason: string
    ): void;

    onChangeMediaState?(
      stringeeCall2: StringeeCall2,
      mediaState: any,
      description: string
    ): void;

    onReceiveCallInfo?(stringeeCall2: StringeeCall2, callInfo: string): void;

    onReceiveDtmfDigit?(stringeeCall2: StringeeCall2, dtmf: string): void;

    onHandleOnAnotherDevice?(
      stringeeCall2: StringeeCall2,
      signalingState: any,
      reason: string
    ): void;

    onReceiveLocalTrack?(
      stringeeCall2: StringeeCall2,
      stringeeVideoTrack: StringeeVideoTrack
    ): void;

    onReceiveRemoteTrack?(
      stringeeCall2: StringeeCall2,
      stringeeVideoTrack: StringeeVideoTrack
    ): void;

    onTrackMediaStateChange?(
      stringeeCall2: StringeeCall2,
      from: string,
      mediaType: any,
      enable: boolean
    ): void;

    onAudioDeviceChange?(
      stringeeCall2: StringeeCall2,
      selectedAudioDevice: any,
      availableAudioDevices: Array<any>
    ): void;
  }

  // export type StringeeVideoScalingType = "fill" | "fit";

  export interface StringeeVideoViewProps {
    uuid?: string;
    videoTrack: StringeeVideoTrack;
    local?: boolean;
    scalingType?: any;
    style?: ViewStyle | ViewStyle[];
  }

  // JSX-compatible declaration
  export const StringeeVideoView: React.FC<StringeeVideoViewProps>;
}
