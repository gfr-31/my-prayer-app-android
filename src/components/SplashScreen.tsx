import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

interface CustomSplashScreenProps {
  onFinish: () => void;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
  onFinish,
}) => {
  // Nilai animasi untuk efek fade-in / zoom
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Jalankan animasi masuk
    scale.value = withTiming(1, { duration: 800 });

    // Tunggu 2 detik, lalu lakukan animasi fade-out keluar
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)(); // Beritahu App.tsx bahwa splash screen selesai
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      className="absolute inset-0 bg-warmCream justify-center items-center z-50"
    >
      <View className="items-center">
        {/* Logo transparan kamu */}
        <Image
          source={require("../../assets/icon.png")}
          className="w-48 h-48 mb-4"
          resizeMode="contain"
        />
        {/* Judul Aplikasi (Diubah ke warna hijau agar kontras dengan warmCream) */}
        <Text className="text-[#0F5132] text-2xl font-bold tracking-wider">
          My Prayer
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
