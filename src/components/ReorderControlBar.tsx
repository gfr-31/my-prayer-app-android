import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowUpDown, Check } from "lucide-react-native";

interface ReorderControlBarProps {
  isReorderMode: boolean;
  onToggleReorderMode: () => void;
}

export const ReorderControlBar: React.FC<ReorderControlBarProps> = ({
  isReorderMode,
  onToggleReorderMode,
}) => {
  return (
    <View className="px-4 py-2.5 bg-emerald-50/80 border-b border-emerald-100/80 flex-row justify-between items-center shadow-xs">
      <View className="flex-row items-center space-x-2">
        <View
          className={`w-2 h-2 rounded-full ${isReorderMode ? "bg-amber-500 animate-pulse" : "bg-emerald-600"}`}
        />
        <Text className="text-xs text-emerald-900 font-semibold ml-1">
          {isReorderMode ? "Mode Atur Posisi Aktif" : "Mode Baca Normal"}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onToggleReorderMode}
        className={`flex-row items-center px-3.5 py-1.5 rounded-xl shadow-xs ${
          isReorderMode
            ? "bg-emeraldPrimary"
            : "bg-white border border-emerald-200"
        }`}
        activeOpacity={0.8}
      >
        {isReorderMode ? (
          <>
            <Check size={16} color="#FAFAF7" style={{ marginRight: 6 }} />
            <Text className="text-xs text-warmCream font-bold">
              Simpan Urutan
            </Text>
          </>
        ) : (
          <>
            <ArrowUpDown size={16} color="#0F5132" style={{ marginRight: 6 }} />
            <Text className="text-xs text-emeraldPrimary font-bold">
              Atur Posisi
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
