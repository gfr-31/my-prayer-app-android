import { Minus, Plus, Type } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface FontResizerProps {
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

export const FontResizer: React.FC<FontResizerProps> = ({
  fontSize,
  setFontSize,
}) => {
  const decreaseFont = () => setFontSize((prev) => Math.max(20, prev - 2));
  const increaseFont = () => setFontSize((prev) => Math.min(48, prev + 2));

  return (
    <View className="bg-white mx-4 my-3 p-3 rounded-xl shadow-sm border border-emerald-100 flex-row justify-between items-center">
      <View className="flex-row items-center space-x-2 ">
        <Type size={18} color="#0F5132" />
        <Text className="flex-1 text-xs font-semibold text-emeraldPrimary ml-2">
          Ukuran Font Arab :
        </Text>

        <View className="flex-row items-center space-x-2">
          <TouchableOpacity
            onPress={decreaseFont}
            className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 active:bg-emerald-100"
          >
            <Minus size={16} color="#0F5132" />
          </TouchableOpacity>

          <Text className="text-sm font-bold text-emeraldPrimary mx-2 border rounded-lg px-3 py-1.5 border-emerald-200">
            {fontSize} px
          </Text>

          <TouchableOpacity
            onPress={increaseFont}
            className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 active:bg-emerald-100"
          >
            <Plus size={16} color="#0F5132" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
