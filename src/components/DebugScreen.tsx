import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard"; // Modul resmi Expo untuk salin teks
import { syncService } from "../services/syncService";
import { storageService } from "../services/storageService";

export default function DebugPanel() {
  const [debugLog, setDebugLog] = useState<string>(
    "Memulai pelacakan alur data...",
  );
  const [prayerCount, setPrayerCount] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  useEffect(() => {
    runDebugFlowTrace();
  }, []);

  const runDebugFlowTrace = async () => {
    let log = "=== 1. PENGECEKAN ENV ===\n";
    try {
      const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      log += `URL: ${url ? "ADA (" + url.substring(0, 15) + "...)" : "KOSONG / UNDEFINED"}\n`;
      log += `KEY: ${key ? "ADA (Len: " + key.length + ")" : "KOSONG / UNDEFINED"}\n\n`;

      log += "=== 2. CEK STORAGE LOKAL ===\n";
      const localData = await storageService.getPrayers();
      log += `Data di Cache Lokal: ${localData.length} doa ditemukan\n\n`;

      log += "=== 3. TES SINKRONISASI SERVER ===\n";
      const result = await syncService.syncPrayers();

      setPrayerCount(result.prayers.length);
      log += `Status Update: ${result.updated ? "Ada Pembaruan" : "Tidak Ada Update"}\n`;
      log += `Total Doa Final: ${result.prayers.length}\n`;
      log += "✅ Alur data berhasil dieksekusi!";

      setDebugLog(log);
    } catch (e: any) {
      log += `\n❌ ERROR ALUR: ${e.message}`;
      setDebugLog(log);
    }
  };

  // Fungsi untuk menyalin seluruh teks log ke clipboard
  const handleCopyLog = async () => {
    await Clipboard.setStringAsync(debugLog);
    Alert.alert("Berhasil", "Log debug berhasil disalin ke clipboard!");
  };

  return (
    <View className="absolute bottom-4 left-4 right-4 z-50 bg-slate-900/95 p-4 rounded-2xl border border-slate-700 shadow-2xl">
      {/* Header Box Debug */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white font-bold text-sm">
          🛠️ Debug Flow (Doa: {prayerCount})
        </Text>

        <View className="flex-row space-x-2">
          {/* Tombol Salin Log */}
          <TouchableOpacity onPress={handleCopyLog}>
            <Text className="text-cyan-400 text-xs font-bold px-2 py-1 bg-slate-800 rounded mr-1">
              Salin Log
            </Text>
          </TouchableOpacity>

          {/* Tombol Minimize/Maximize */}
          <TouchableOpacity onPress={() => setIsMinimized(!isMinimized)}>
            <Text className="text-emerald-400 text-xs font-bold px-2 py-1 bg-slate-800 rounded">
              {isMinimized ? "Maximize" : "Minimize"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Konten Log Alur Data */}
      {!isMinimized && (
        <ScrollView className="max-h-40 bg-black/60 p-2.5 rounded-lg border border-slate-800 mb-2">
          <Text className="text-emerald-400 font-mono text-[11px] leading-relaxed">
            {debugLog}
          </Text>
        </ScrollView>
      )}

      <Text className="text-slate-400 text-[10px] text-center">
        Panel pelacakan alur data aktif. Salin log jika butuh analisis lebih
        lanjut.
      </Text>
    </View>
  );
}
