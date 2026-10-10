import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RefreshCw } from "lucide-react-native";
import { Moon } from "lucide-react-native";

interface HeaderProps {
  onRefresh: () => void;
  syncStatus: string;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, syncStatus }) => {
  return (
    <View className="bg-warmCream px-4 pt-10 pb-4 shadow-md flex-row justify-between items-center">
      <View className="flex-row items-center space-x-2">
        <View className="bg-emerald-800 p-2 rounded-lg mr-3">
          <Moon size={22} color="#FAFAF7" />
        </View>
        <View>
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
