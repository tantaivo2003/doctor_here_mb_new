import React, { useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Animated, Easing } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";

const LoadingModal = () => {
  const spinValue = new Animated.Value(0);

  const spin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spin());
  };
  useEffect(() => {
    spin();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <Modal isVisible={true} animationIn="zoomIn" animationOut="zoomOut">
      <SafeAreaView>
        <View className="mt-10 items-center justify-center">
          <Animated.View style={{ transform: [{ rotate }] }}>
            <FontAwesome name="spinner" size={40} color="blue" />
          </Animated.View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default LoadingModal;
