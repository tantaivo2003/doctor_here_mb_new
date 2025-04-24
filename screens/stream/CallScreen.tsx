import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
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

const CustomTopView = () => {
  const { useParticipants, useDominantSpeaker } = useCallStateHooks();
  const participants = useParticipants();
  const dominantSpeaker = useDominantSpeaker();
  return (
    <View style={styles.topContainer}>
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.topText}>
        Video Call between {participants.map((p) => p.name).join(", ")}
      </Text>
      {dominantSpeaker?.name && (
        <Text style={styles.topText}>
          Dominant Speaker: {dominantSpeaker?.name}
        </Text>
      )}
    </View>
  );
};

type Props = { goToHomeScreen: () => void; callId: string };

const CustomCallControls = (props: CallControlProps) => {
  const call = useCall();
  return (
    <View style={styles.customCallControlsContainer}>
      <ToggleMic onPressHandler={call?.microphone.toggle} />
      <ToggleCamera onPressHandler={call?.camera.toggle} />
      <HangUpCallButton onHangupCallHandler={props.onHangupCallHandler} />
    </View>
  );
};

export const CallScreen = ({ goToHomeScreen, callId }: Props) => {
  const [call, setCall] = React.useState<Call | null>(null);
  const client = useStreamVideoClient();

  useEffect(() => {
    const _call = client?.call("default", callId);
    _call?.join({ create: true }).then(() => setCall(_call));
  }, [client, callId]);

  useEffect(() => {
    return () => {
      // cleanup the call on unmount if the call was not left already
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);

  if (!call) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Joining call...</Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <View style={styles.container}>
        <CallContent
          onHangupCallHandler={goToHomeScreen}
          CallControls={CustomCallControls}
        />
      </View>
    </StreamCall>
  );
};

const ParticipantCountText = () => {
  const { useParticipantCount } = useCallStateHooks();
  const participantCount = useParticipantCount();
  return (
    <Text style={styles.text}>Call has {participantCount} participants</Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  text: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  customCallControlsContainer: {
    position: "absolute",
    bottom: 40,
    paddingVertical: 10,
    width: "80%",
    marginHorizontal: 20,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around",
    backgroundColor: "orange",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 5,
    zIndex: 5,
  },
  topContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  topText: {
    color: "white",
  },
});
