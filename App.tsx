import "./global.css";
import * as SplashScreen from "expo-splash-screen";
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
import { Prayer, storageService } from "./src/services/storageService";
import { syncService } from "./src/services/syncService";
import { Header } from "./src/components/Header";
import { FontResizer } from "./src/components/FontResizer";
import { PrayerCard } from "./src/components/PrayerCard";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Check,
} from "lucide-react-native";

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
import { ReorderControlBar } from "./src/components/ReorderControlBar";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
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

  // State baru untuk mengontrol mode atur posisi
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);

  const flatListRef = useRef<FlatList>(null);
  const currentScrollOffset = useRef<number>(0);

  const loadAndSyncData = async () => {
    try {
      setLoading(true);

      // Panggil fungsi sinkronisasi
      const result = await syncService.syncPrayers();

      // Pastikan result dan result.prayers benar-benar ada dan berupa Array
      if (result && Array.isArray(result.prayers)) {
        setPrayers(result.prayers);
        setSyncStatus(result.updated ? "Data diperbaharui" : "Cache aktif");
      } else {
        // Fallback jika format data dari service tidak sesuai
        setPrayers([]);
        setSyncStatus("Gagal memuat format data");
      }
    } catch (error) {
      console.error("Crash prevented in loadAndSyncData:", error);
      // Berikan nilai aman agar aplikasi tidak force close
      setPrayers([]);
      setSyncStatus("Mode offline / Gagal sinkronisasi");
    } finally {
      // Pastikan loading selalu dimatikan dalam kondisi apapun
      setLoading(false);
    }
  };

  // Mencegah splash screen tertutup otomatis sebelum data siap
  SplashScreen.preventAutoHideAsync().catch(() => {});
  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Panggil fungsi pemuatan & sinkronisasi data
        await loadAndSyncData();
      } catch (error) {
        console.error("Gagal memuat data saat inisialisasi:", error);
        // PENTING: Berikan data default/kosong agar state tidak undefined
        // setPrayers([]);
      } finally {
        // 2. Pastikan Splash Screen SELALU ditutup, baik berhasil maupun error
        await SplashScreen.hideAsync().catch(() => {});
      }
    };

    initApp();
  }, []);

  const handleScrollStep = (direction: "up" | "down") => {
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

  // Fungsi untuk memindahkan posisi doa ke atas atau ke bawah
  const movePrayerPosition = (index: number, direction: "up" | "down") => {
    const newPrayers = [...prayers];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Validasi batas atas dan bawah
    if (targetIndex < 0 || targetIndex >= newPrayers.length) return;

    // Tukar posisi elemen dalam array
    const temp = newPrayers[index];
    newPrayers[index] = newPrayers[targetIndex];
    newPrayers[targetIndex] = temp;

    setPrayers(newPrayers);
  };

  const handleSaveReorder = async () => {
    // Berikan order_index baru sesuai urutan array saat ini
    const updatedWithIndex = prayers.map((item, index) => ({
      ...item,
      order_index: index,
    }));

    setPrayers(updatedWithIndex);
    await storageService.savePrayers(updatedWithIndex);
    setIsReorderMode(false); // Keluar dari mode atur
  };

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

      <Header onRefresh={loadAndSyncData} syncStatus={syncStatus} />

      <ReorderControlBar
        isReorderMode={isReorderMode}
        onToggleReorderMode={() => {
          if (isReorderMode) {
            handleSaveReorder();
          } else {
            setIsReorderMode(true);
          }
        }}
      />

      <FontResizer fontSize={arabicFontSize} setFontSize={setArabicFontSize} />

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
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          onScroll={(event) => {
            currentScrollOffset.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => (
            <View className="relative">
              <PrayerCard
                item={item}
                index={index}
                arabicFontSize={arabicFontSize}
              />

              {isReorderMode && (
                <View className="absolute right-4 top-4 flex-row space-x-1 bg-white/90 p-1 rounded-lg shadow border border-gray-200">
                  {/* Tombol Panah Atas */}
                  <TouchableOpacity
                    onPress={() => movePrayerPosition(index, "up")}
                    disabled={index === 0}
                    className={`p-2 rounded ${index === 0 ? "opacity-30" : "bg-emerald-100 active:bg-emerald-200"} mr-1`}
                  >
                    <ChevronUp size={18} color="#0F5132" />
                  </TouchableOpacity>

                  {/* Tombol Panah Bawah */}
                  <TouchableOpacity
                    onPress={() => movePrayerPosition(index, "down")}
                    disabled={index === prayers.length - 1}
                    className={`p-2 rounded ${index === prayers.length - 1 ? "opacity-30" : "bg-emerald-100 active:bg-emerald-200"}`}
                  >
                    <ChevronDown size={18} color="#0F5132" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}

      {/* Floating Scroll Navigation */}
      {!isReorderMode && (
        <View className="absolute bottom-20 right-6 flex-col space-y-2">
          <TouchableOpacity
            onPress={() => handleScrollStep("up")}
            className="border-5 border-warmCream mb-3 bg-emeraldPrimary p-3 rounded-full shadow-lg active:bg-emerald-800 opacity-90"
          >
            <ChevronUp size={30} color="#FAFAF7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleScrollStep("down")}
            className="border-5 border-warmCream bg-emeraldPrimary p-3 rounded-full shadow-lg active:bg-emerald-800 opacity-90"
          >
            <ChevronDown size={30} color="#FAFAF7" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
