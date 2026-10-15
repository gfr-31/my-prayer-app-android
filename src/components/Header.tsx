import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RefreshCw } from "lucide-react-native";

interface HeaderProps {
  onRefresh: () => void;
  syncStatus: string;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, syncStatus }) => {
  return (
    <View className="bg-warmCream px-4 pt-10 pb-4 shadow-md flex-row justify-between items-center">
      <View className="flex-row items-center space-x-3">
        {/* Mengganti ikon Moon dengan Logo My Prayer */}
        <Image
          source={require("../../assets/icon.png")}
          className="w-10 h-10"
          resizeMode="contain"
        />

        <View className="ml-2">
          <Text className="text-xl font-bold text-emeraldPrimary tracking-wide">
            My Prayer Mobile
          </Text>
          <Text className="text-[10px] text-emeraldPrimary">{syncStatus}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onRefresh}
        className="bg-emerald-800/80 p-2.5 rounded-full active:bg-emerald-700"
      >
        <RefreshCw size={18} color="#FAFAF7" />
      </TouchableOpacity>
    </View>
  );
};
