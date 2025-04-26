import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
// import {ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import ZegoUIKitPrebuiltCall from '@zegocloud/zego-uikit-prebuilt-call-rn';

export default function VoiceCallPage(props) {
    // Thay các giá trị thật vào đây
    const appID = 'YOUR_APP_ID';  // appID từ ZEGOCLOUD Admin Console
    const appSign = 'YOUR_APP_SIGN';  // appSign từ ZEGOCLOUD Admin Console
    const userID = 'user123';  // userID có thể là số điện thoại hoặc bất kỳ định danh nào của người dùng
    const userName = 'User Name';  // Tên hiển thị của người dùng
    const callID = 'call12345';  // Một ID duy nhất cho cuộc gọi

    return (
        <View style={styles.container}>
            {/* <ZegoUIKitPrebuiltCall
                appID={appID}
                appSign={appSign}
                userID={userID}
                userName={userName}
                callID={callID}
                config={{
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    onCallEnd: (callID, reason, duration) => { props.navigation.navigate('HomePage'); }
                }}
            /> */}
            <Text>Voice Call Page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
    },
});
