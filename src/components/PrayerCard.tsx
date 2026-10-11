import React from "react";
import { View, Text, TouchableOpacity, Share, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Copy, Share2, Bookmark } from "lucide-react-native";
import { Prayer } from "../services/storageService";

interface PrayerCardProps {
  item: Prayer;
  index: number;
  arabicFontSize: number;
}

// 1. Definisikan komponen secara normal dulu
const PrayerCardComponent: React.FC<PrayerCardProps> = ({
  item,
  index,
  arabicFontSize,
}) => {
  const handleCopy = async () => {
    const textToCopy = `${item.title}\n\n${item.arabic}\n\n${item.latin || ""}\n\nTerjemahan:\n${item.translation || ""}`;
    await Clipboard.setStringAsync(textToCopy);
    Alert.alert("Tersalin!", "Teks doa berhasil disalin ke clipboard.");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${item.title}\n\n${item.arabic}\n\n${item.translation || ""}\n\n(Bagikan dari aplikasi My Prayer)`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="bg-white mx-4 mb-4 rounded-2xl p-4 shadow-sm border border-emerald-100/60">
      {/* Top Bar: Nomor Urut & Kategori */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="bg-emeraldPrimary w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-warmCream text-lg font-bold">{index + 1}</Text>
        </View>
        <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
          <Text className="text-xs font-semibold text-emeraldPrimary">
            {item.category}
          </Text>
        </View>
      </View>

      {/* Judul Doa */}
      <Text
        style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        className="text-base font-bold text-gray-800 mb-3 leading-snug"
      >
        {item.title}
      </Text>

      {/* Teks Arab */}
      <Text
        style={{
          fontFamily: "Amiri_700Bold",
          fontSize: arabicFontSize,
          lineHeight: arabicFontSize * 2,
        }}
        className="text-right font-serif text-gray-900 mb-4 tracking-wide"
      >
        {item.arabic}
      </Text>

      {/* Teks Latin */}
      {item.latin ? (
        <Text
          style={{ fontFamily: "PlusJakartaSans_400Regular" }}
          className="text-sm italic text-emerald-800 bg-emerald-50/50 p-2.5 rounded-lg mb-2 leading-relaxed"
        >
          {item.latin}
        </Text>
      ) : null}

      {/* Terjemahan */}
      {item.translation ? (
        <Text
          style={{ fontFamily: "PlusJakartaSans_400Regular" }}
          className="text-xs text-gray-600 leading-relaxed mb-4"
        >
          {item.translation}
        </Text>
      ) : null}

      {/* Action Buttons: Copy, Share, Bookmark */}
      <View className="flex-row justify-end items-center space-x-3 pt-3 border-t border-gray-100">
        <TouchableOpacity
          onPress={handleCopy}
          className="mr-2 flex-row items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 active:bg-gray-100"
        >
          <Copy size={14} color="#0F5132" />
          <Text className="text-xs font-medium text-emeraldPrimary">Salin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          className="mr-2 flex-row items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 active:bg-gray-100"
        >
          <Share2 size={14} color="#0F5132" />
          <Text className="text-xs font-medium text-emeraldPrimary">
            Bagikan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 active:bg-emerald-100">
          <Bookmark size={14} color="#0F5132" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 2. Ekspor dengan React.memo secara terpisah agar aman
export const PrayerCard = React.memo(PrayerCardComponent);
