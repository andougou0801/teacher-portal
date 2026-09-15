/**
 * Supabaseの無料プランは約1週間アクセスがないとプロジェクトが休止し、
 * Q&Aと管理画面が止まる（管理画面のログイン状態も切れる）。
 * vercel.json のcronから1日1回ここを叩いて「使用中」の状態を保つ。
 *
 * ルートハンドラはNext.js 16では既定でキャッシュされないため、
 * 毎回実際にSupabaseへリクエストが飛ぶ。
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return Response.json({ ok: false, reason: "not-configured" });
  }

  try {
    const response = await fetch(`${url}/rest/v1/questions?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    return Response.json({ ok: response.ok, status: response.status });
  } catch {
    // 休止中などで届かなくても、cron自体は失敗扱いにしない。
    return Response.json({ ok: false, reason: "unreachable" });
  }
}
