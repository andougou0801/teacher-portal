"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { tools, type Tool } from "@/lib/tools";

type Setting = { slug: string; hidden: boolean; sort_order: number | null };

export default function AdminToolsPage() {
  const [order, setOrder] = useState<Tool[]>(tools);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = useMemo(() => getSupabaseClient(), []);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("tool_settings")
      .select("slug,hidden,sort_order");
    if (error) {
      setMessage("設定の読み込みに失敗しました。");
      setLoading(false);
      return;
    }
    const settings = new Map(
      ((data ?? []) as Setting[]).map((row) => [row.slug, row]),
    );
    setHidden(
      Object.fromEntries(
        tools.map((tool) => [tool.slug, settings.get(tool.slug)?.hidden ?? false]),
      ),
    );
    setOrder(
      [...tools].sort(
        (a, b) =>
          (settings.get(a.slug)?.sort_order ?? Number.MAX_SAFE_INTEGER) -
          (settings.get(b.slug)?.sort_order ?? Number.MAX_SAFE_INTEGER),
      ),
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, [load]);

  function move(index: number, direction: -1 | 1) {
    setOrder((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function save() {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);
    const payload = order.map((tool, index) => ({
      slug: tool.slug,
      hidden: hidden[tool.slug] ?? false,
      sort_order: index,
    }));
    const { error } = await supabase
      .from("tool_settings")
      .upsert(payload, { onConflict: "slug" });
    setSaving(false);
    if (error) {
      setMessage(`保存できませんでした：${error.message}`);
      return;
    }
    setMessage("保存しました。サイトへの反映は最大1分ほどかかります。");
  }

  return (
    <AdminShell title="ツールの表示設定">
      <p className="mb-4 text-sm text-muted">
        表示をオフにしたツールは、一覧からも個別ページからも見えなくなります（配布済みのURLも開けなくなります）。
        ツール本体の追加や中身の修正は、開発者へご依頼ください。
      </p>

      {message && (
        <p className="mb-4 rounded-xl bg-warn-bg px-4 py-2.5 text-sm text-warn">
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted">読み込み中です…</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {order.map((tool, index) => (
              <div
                key={tool.slug}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-white p-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="ひとつ上へ"
                      className="px-2 text-sm font-bold text-accent disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === order.length - 1}
                      aria-label="ひとつ下へ"
                      className="px-2 text-sm font-bold text-accent disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                  <span className="text-xl">{tool.icon}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold">{tool.name}</div>
                    <div className="text-[13px] text-muted">
                      {tool.audience === "student" ? "子ども向け" : "先生向け"}
                    </div>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={!(hidden[tool.slug] ?? false)}
                    onChange={(e) =>
                      setHidden((prev) => ({
                        ...prev,
                        [tool.slug]: !e.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                  />
                  サイトに表示
                </label>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="mt-4 rounded-full bg-cta px-6 py-2.5 text-sm font-bold text-white hover:bg-cta-dark disabled:opacity-60"
          >
            {saving ? "保存中…" : "この内容で保存する"}
          </button>
        </>
      )}
    </AdminShell>
  );
}
