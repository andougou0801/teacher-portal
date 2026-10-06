"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { tools, type Tool } from "@/lib/tools";

type Setting = {
  slug: string;
  hidden: boolean;
  sort_order: number | null;
  description?: string | null;
};

/** カード一覧で読みやすく収まる長さの目安。超えても保存はできる。 */
const DESCRIPTION_GUIDE = 160;

export default function AdminToolsPage() {
  const [order, setOrder] = useState<Tool[]>(tools);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  // 既定の説明（tools.ts）から書き換えたぶんだけを持つ。空文字は「既定に戻す」。
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = useMemo(() => getSupabaseClient(), []);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("tool_settings")
      .select("slug,hidden,sort_order,description");
    if (error) {
      setMessage(
        error.message.includes("description")
          ? "説明文の欄を使うには、supabase/003_tool_descriptions.sql をSQL Editorで1回実行してください。"
          : "設定の読み込みに失敗しました。",
      );
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
    setDescriptions(
      Object.fromEntries(
        tools.map((tool) => [tool.slug, settings.get(tool.slug)?.description ?? ""]),
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
      // 空欄のままなら tools.ts の説明をそのまま使う
      description: (descriptions[tool.slug] ?? "").trim() || null,
    }));
    const { error } = await supabase
      .from("tool_settings")
      .upsert(payload, { onConflict: "slug" });
    setSaving(false);
    if (error) {
      setMessage(
        error.message.includes("description")
          ? `保存できませんでした：${error.message}（supabase/003_tool_descriptions.sql をSQL Editorで1回実行してください）`
          : `保存できませんでした：${error.message}`,
      );
      return;
    }
    setMessage("保存しました。サイトへの反映は最大1分ほどかかります。");
  }

  return (
    <AdminShell title="ツールの表示設定">
      <p className="mb-4 text-sm text-muted">
        表示をオフにしたツールは、一覧からも個別ページからも見えなくなります（配布済みのURLも開けなくなります）。
        説明文は「説明文を編集」から書き換えられ、ツール一覧・個別ページ・検索結果にそのまま出ます。
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
            {order.map((tool, index) => {
              const edited = (descriptions[tool.slug] ?? "").trim();
              const shown = edited || tool.description;
              const open = openSlug === tool.slug;
              return (
              <div
                key={tool.slug}
                className="rounded-2xl border border-line bg-white p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
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
                      {edited && "・説明を書き換え済み"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenSlug(open ? null : tool.slug)}
                    className="rounded-full border border-line px-3 py-1.5 text-[13px] font-bold text-navy hover:bg-[#EAF2FA]"
                  >
                    {open ? "説明文を閉じる" : "説明文を編集"}
                  </button>
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
                </div>

                {!open && (
                  <p className="mt-2 line-clamp-2 text-[13px] text-muted">{shown}</p>
                )}

                {open && (
                  <div className="mt-3 border-t border-line pt-3">
                    <textarea
                      value={descriptions[tool.slug] ?? ""}
                      onChange={(e) =>
                        setDescriptions((prev) => ({
                          ...prev,
                          [tool.slug]: e.target.value,
                        }))
                      }
                      rows={5}
                      placeholder={tool.description}
                      className="w-full rounded-xl border border-line p-3 text-sm"
                    />
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[13px]">
                      <span
                        className={
                          shown.length > DESCRIPTION_GUIDE ? "text-warn" : "text-muted"
                        }
                      >
                        {shown.length}文字
                        {shown.length > DESCRIPTION_GUIDE &&
                          `（${DESCRIPTION_GUIDE}文字くらいまでが読みやすい目安です）`}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setDescriptions((prev) => ({ ...prev, [tool.slug]: "" }))
                        }
                        disabled={!edited}
                        className="font-bold text-accent disabled:opacity-40"
                      >
                        もとの説明に戻す
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDescriptions((prev) => ({
                            ...prev,
                            [tool.slug]: tool.description,
                          }))
                        }
                        className="font-bold text-accent"
                      >
                        もとの説明を読み込んで直す
                      </button>
                    </div>
                    <p className="mt-1.5 text-[13px] text-muted">
                      空欄のまま保存すると、開発者が用意した説明にもどります。
                    </p>
                  </div>
                )}
              </div>
              );
            })}
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
