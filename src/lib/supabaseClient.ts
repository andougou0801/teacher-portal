import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;

/** 環境変数が未設定の場合は null を返す（開発中や設定前でもビルド・表示は壊れないようにする）。 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        // ログイン状態をブラウザに保存し、期限が切れる前に自動で更新し続ける。
        // 既定値と同じだが、管理画面のログインが維持されるかを左右する設定なので明示しておく。
        persistSession: true,
        autoRefreshToken: true,
        // このサイトはメール＋パスワードのみ。URLのトークン解析は不要。
        detectSessionInUrl: false,
        storageKey: "teacher-portal-auth",
      },
    });
  }
  return client;
}
