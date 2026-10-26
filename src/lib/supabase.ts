import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const rawKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// console.log("DEBUG SUPABASE URL:", rawUrl);
// console.log("DEBUG SUPABASE KEY:", rawKey ? "ADA ISINYA" : "KOSONG/UNDEFINED");

// Validasi apakah URL valid berformat HTTP/HTTPS
const isValidUrl = typeof rawUrl === "string" && rawUrl.startsWith("http");

// Gunakan URL placeholder yang aman jika variabel kosong saat build,
// agar aplikasi tetap bisa terbuka dan masuk ke mode offline/local cache.
const SUPABASE_URL = isValidUrl ? rawUrl : "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY = rawKey || "placeholder-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
