import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Prayer {
  id: string;
  order_index: number;
  title: string;
  category: string;
  arabic: string;
  latin?: string;
  translation?: string;
  created_at?: string;
  updated_at: string;
}

const STORAGE_KEYS = {
  PRAYERS: "@my_prayer_prayers_data",
  LAST_SYNC: "@my_prayer_last_sync_timestamp",
};

export const storageService = {
  // Simpan daftar doa ke cache lokal
  async savePrayers(prayers: Prayer[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
    } catch (e) {
      console.error("Gagal menyimpan doa ke lokal: ", e);
    }
  },

  // Ambil daftar doa dari cache lokal (Kembalikan array kosong jika belum ada data)
  async getPrayers(): Promise<Prayer[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PRAYERS);
      if (data) {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      }
      return []; // Jika kosong, kembalikan array kosong supaya aplikasi tahu data belum di-download
    } catch (e) {
      console.error("Gagal mengambil doa ke lokal : ", e);
      return [];
    }
  },

  // Simpan timestamp sinkronisasi terakhir
  async saveLastSync(timestamp: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
    } catch (e) {
      console.error("Gagal menyimpan timestamp async : ", e);
    }
  },

  // Ambil timestamp sinkronisai terakhir
  async getLastSync(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (e) {
      console.error("Gagal membaca timestamp async : ", e);
      return null;
    }
  },
};
