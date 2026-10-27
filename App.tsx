import "./global.css";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { ReorderControlBar } from "./src/components/ReorderControlBar";
import { CustomSplashScreen } from "./src/components/SplashScreen";
import DebugPanel from "./src/components/DebugScreen";
import { supabase } from "./src/lib/supabase";

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
  const [arabicFontSize, setArabicFontSize] = useState<number>(22);
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // State untuk titik merah (Hanya aktif jika Realtime mendeteksi perubahan)
  const [hasUpdate, setHasUpdate] = useState<boolean>(false);

  const currentScrollOffset = useRef<number>(0);
  const flatListRef = useRef<FlatList>(null);

  // 1. Fungsi Inisialisasi Pertama Kali / Download Wajib dari Server
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const result = await syncService.syncPrayers();

      if (
        result &&
        Array.isArray(result.prayers) &&
        result.prayers.length > 0
      ) {
        setPrayers(result.prayers);
        setSyncStatus("Data sinkron (Online)");
      } else {
        const localCache = await storageService.getPrayers();
        setPrayers(localCache);
        setSyncStatus("Menggunakan data lokal");
      }
    } catch (error) {
      // console.log("Gagal koneksi awal:", error);
      const localCache = await storageService.getPrayers();

      // Jika belum ada data sama sekali di HP dan internet mati, wajib munculkan pop-up
      if (!localCache || localCache.length <= 1) {
        Alert.alert(
          "Koneksi Terputus",
          "Aplikasi memerlukan koneksi internet untuk mengunduh data pada awal instalasi. Periksa koneksi Anda.",
          [{ text: "OK" }],
        );
        setSyncStatus("Offline (Belum ada data)");
      } else {
        setPrayers(localCache);
        setSyncStatus("Mode Offline (Data Tersimpan)");
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Fungsi saat User KLIK TOMBOL SYNC MANUAL (Mematikan titik merah)
  const handleManualSync = async () => {
    try {
      setLoading(true);
      const result = await syncService.syncPrayers();

      if (
        result &&
        Array.isArray(result.prayers) &&
        result.prayers.length > 0
      ) {
        setPrayers(result.prayers);
        setSyncStatus("Data berhasil diperbarui");
        setHasUpdate(false);
      } else {
        Alert.alert(
          "Gagal Sinkronisasi",
          "Tidak dapat memperbarui data dari server.",
        );
      }
    } catch (error) {
      console.error("Gagal sinkronisasi manual:", error);
      Alert.alert(
        "Kesalahan",
        "Gagal menyinkronkan data. Periksa koneksi internet Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  // 3. useEffect Inisialisasi & Pasang Supabase Realtime Listener untuk Titik Merah
  useEffect(() => {
    const initApp = async () => {
      try {
        await fetchInitialData();
      } catch (error) {
        console.error("Gagal memuat data saat inisialisasi:", error);
      } finally {
        setIsReady(true);
      }
    };

    initApp();

    const prayerChannel = supabase
      .channel("public:prayers")
      .on(
        "postgres_changes",
        {
          event: "*", // Mendengar INSERT, UPDATE, atau DELETE di Supabase
          schema: "public",
          table: "prayers",
        },
        (payload) => {
          // console.log("Perubahan terdeteksi secara real-time!", payload);

          // NYALAKAN TITIK MERAH SUPAYA USER TAHU ADA UPDATE
          setHasUpdate(true);
          setSyncStatus("Ada pembaruan baru!");
        },
      )
      .subscribe((status) => {
        // console.log("Realtime status:", status);
      });

    // Membersihkan channel saat aplikasi ditutup
    return () => {
      supabase.removeChannel(prayerChannel);
    };
  }, []);

  if (!isReady) {
    return null;
  }

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

  const movePrayerPosition = (index: number, direction: "up" | "down") => {
    const newPrayers = [...prayers];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPrayers.length) return;

    const temp = newPrayers[index];
    newPrayers[index] = newPrayers[targetIndex];
    newPrayers[targetIndex] = temp;

    setPrayers(newPrayers);
  };

  const handleSaveReorder = async () => {
    const updatedWithIndex = prayers.map((item, index) => ({
      ...item,
      order_index: index,
    }));

    setPrayers(updatedWithIndex);
    await storageService.savePrayers(updatedWithIndex);
    setIsReorderMode(false);
  };

  if (!fontsLoaded) {
    return (
      <View className="flex-1 bg-warmCream justify-center items-center">
        <ActivityIndicator size="large" color="#0F5132" />
      </View>
    );
  }

  if (showSplash) {
    return <CustomSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <View className="flex-1 bg-warmCream">
      <StatusBar style="light" />

      {/* Header menggunakan fungsi handleManualSync saat tombol refresh diklik */}
      <Header
        onRefresh={handleManualSync}
        syncStatus={syncStatus}
        hasUpdate={hasUpdate}
      />

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
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
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
                  <TouchableOpacity
                    onPress={() => movePrayerPosition(index, "up")}
                    disabled={index === 0}
                    className={`p-2 rounded ${index === 0 ? "opacity-30" : "bg-emerald-100 active:bg-emerald-200"} mr-1`}
                  >
                    <ChevronUp size={18} color="#0F5132" />
                  </TouchableOpacity>

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

      {/* <DebugPanel /> */}
    </View>
  );
}
