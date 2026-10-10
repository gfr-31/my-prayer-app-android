import "./global.css";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Prayer } from "./src/services/storageService";
import { syncService } from "./src/services/syncService";
import { Header } from "./src/components/Header";
import { FontResizer } from "./src/components/FontResizer";
import { PrayerCard } from "./src/components/PrayerCard";
import { ChevronDown, ChevronUp } from "lucide-react-native";

// Import Google Fonts
import {
  useFonts,
  Amiri_400Regular,
  Amiri_700Bold,
} from "@expo-google-fonts/amiri";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

// Ambil tinggi layar HP
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  // Load Fonts
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<string>(
    "Memulai sinkronisasi....",
  );
  const [arabicFontSize, setArabicFontSize] = useState<number>(24);

  const flatListRef = useRef<FlatList>(null);

  // State untuk menyimpan posisi scroll saat ini
  const currentScrollOffset = useRef<number>(0);

  const loadAndSyncData = async () => {
    setLoading(true);
    const result = await syncService.syncPrayers();
    setPrayers(result.prayers);
    setSyncStatus(
      result.updated ? "Data diperbaharui" : "Offline / Cache aktif",
    );
    setLoading(false);
  };

  useEffect(() => {
    loadAndSyncData();
  }, []);

  // Fungsi Scroll Bertahap (Naik / Turun sesuai viewport bacaan)
  const handleScrollStep = (direction: "up" | "down") => {
    // Scroll sejauh 70% dari tinggi layar (sama seperti di web app my-prayer)
    const scrollAmount = SCREEN_HEIGHT * 0.7;
    let newOffset =
      direction === "down"
        ? currentScrollOffset.current + scrollAmount
        : currentScrollOffset.current - scrollAmount;

    if (newOffset < 0) newOffset = 0;

    flatListRef.current?.scrollToOffset({
      offset: newOffset,
      animated: true,
    });
  };

  // Tunggu font selesai dimuat sebelum menampilkan UI
  if (!fontsLoaded) {
    return (
      <View className="flex-1 bg-warmCream justify-center items-center">
        <ActivityIndicator size="large" color="#0F5132" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-warmCream">
      <StatusBar style="light" />

      {/* Header */}
      <Header onRefresh={loadAndSyncData} syncStatus={syncStatus} />

      {/* Font Resizer */}
      <FontResizer fontSize={arabicFontSize} setFontSize={setArabicFontSize} />

      {/* Content / Prayer List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0F5132" />
          <Text className="text-sm text-gray-600 mt-2">
            Memuat Doa & Dzikir...
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={prayers}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          onScroll={(event) => {
            currentScrollOffset.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => (
            <PrayerCard
              item={item}
              index={index}
              arabicFontSize={arabicFontSize}
            />
          )}
        />
      )}

      {/* Floating Scroll Navigation (Atas & Bawah) */}
      <View className="absolute bottom-20 right-6 flex-col space-y-2">
        <TouchableOpacity
          onPress={() => handleScrollStep("up")}
          className=" border-5 border-warmCream mb-3 bg-emeraldPrimary p-3 rounded-full shadow-lg active:bg-emerald-800 opacity-90"
        >
          <ChevronUp size={30} color="#FAFAF7" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleScrollStep("down")}
          className="border-5 border-warmCream  bg-emeraldPrimary p-3 rounded-full shadow-lg active:bg-emerald-800 opacity-90"
        >
          <ChevronDown size={30} color="#FAFAF7" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
