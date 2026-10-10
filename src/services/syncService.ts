import { supabase } from "../lib/supabase";
import { storageService, Prayer } from "./storageService";

export const syncService = {
  async syncPrayers(): Promise<{ prayers: Prayer[]; updated: boolean }> {
    try {
      const localPrayers = await storageService.getPrayers();
      const lastSync = await storageService.getLastSync();

      // Cek apakah ada pembaharuan di server (updated_at > lastsync)
      let query = supabase
        .from("prayers")
        .select("*")
        .order("updated_at", { ascending: false });

      if (lastSync) {
        query = query.gt("updated_at", lastSync);
      }

      const { data: serverUpdates, error } = await query;

      if (error) {
        console.warn(
          "Gagal terhubung ke server, menggunakan data lokal",
          error.message,
        );
        return { prayers: localPrayers, updated: false };
      }

      // Jika tidak ada perubahan dari sisi server dan data lokal sudah ada, gunakan cache lokal
      if (
        (!serverUpdates || serverUpdates.length === 0) &&
        localPrayers.length > 0
      ) {
        return { prayers: localPrayers, updated: false };
      }

      // Jika ini pertama kali atau ada data baru/update dari server, ambil seluruh data terbaru
      const { data: allLatesPrayers, error: fetchError } = await supabase
        .from("prayers")
        .select("*")
        .order("created_at", { ascending: true });

      if (fetchError || !allLatesPrayers) {
        return { prayers: localPrayers, updated: false };
      }

      // Perbaharui cache lokal dana catat timestamp terbaru
      const newTimestamp = allLatesPrayers?.reduce(
        (max, p) => (p.updated_at > max ? p.updated_at : max),
        allLatesPrayers[0]?.updated_at || new Date().toISOString(),
      );

      await storageService.savePrayers(allLatesPrayers);
      await storageService.saveLastSync(newTimestamp);

      return { prayers: allLatesPrayers, updated: true };
    } catch (e) {
      console.error("Terjadi kesalahan saat sinkronisasi ", e);
      const fallbackData = await storageService.getPrayers();
      return { prayers: fallbackData, updated: false };
    }
  },
};
