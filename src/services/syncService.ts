import { supabase } from "../lib/supabase";
import { storageService, Prayer } from "./storageService";

export const syncService = {
  async syncPrayers(): Promise<{ prayers: Prayer[]; updated: boolean }> {
    try {
      const localPrayers = await storageService.getPrayers();
      const lastSyncTime = await storageService.getLastSync();

      // LANGSUNG AMBIL SEMUA DATA TERBARU DARI SUPABASE (Lewati pengecekan lastSync sementara)
      const { data: allLatestPrayers, error: fetchError } = await supabase
        .from("prayers")
        .select("*")
        .order("order_index", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });

      if (fetchError || !allLatestPrayers || allLatestPrayers.length === 0) {
        console.warn(
          "Gagal ambil dari server, pakai lokal:",
          fetchError?.message,
        );
        return { prayers: localPrayers, updated: false };
      }

      // Cari timestamp terbaru dari data Supabase
      const latestServerTimestamp = allLatestPrayers.reduce(
        (max, p) => (p.updated_at > max ? p.updated_at : max),
        allLatestPrayers[0]?.updated_at || new Date().toISOString(),
      );

      // Bandingkan apakah server lebih baru dari HP
      // Jika belum pernah sync (lastSyncTime null) atau server lebih baru -> berarti ada update!
      const hasNewUpdate =
        !lastSyncTime || latestServerTimestamp > lastSyncTime;

      // Simpan data & timestamp baru ke storage lokal
      await storageService.savePrayers(allLatestPrayers);
      await storageService.saveLastSync(latestServerTimestamp);

      return { prayers: allLatestPrayers, updated: hasNewUpdate };
    } catch (e) {
      console.error("Terjadi kesalahan saat sinkronisasi ", e);
      const fallbackData = await storageService.getPrayers();
      return { prayers: fallbackData, updated: false };
    }
  },
};
