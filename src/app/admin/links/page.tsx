"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseClient } from "@/lib/supabaseClient";

/** 表示の並び順。サイト側（/links）と同じ順番にしておく。 */
const CATEGORIES = [
  "教育委員会・公的機関",
  "プリント・ドリル",
  "教科の理解を深める",
  "教科書会社の授業サポート",
  "毎日の話題（朝の会・帰りの会）",
  "ぬりえ",
  "めいろ・なぞなぞ",
] as const;

type LinkRow = {
  id: string;
  name: string;
  url: string;
  description: string;
  when_to_use: string;
  category: string;
  subject: string | null;
  sort_order: number;
  hidden: boolean;
};

type Draft = Omit<LinkRow, "id" | "sort_order"> & { id?: string };

const EMPTY: Draft = {
  name: "",
  url: "",
  description: "",
  when_to_use: "",
  category: CATEGORIES[0],
  subject: "",
  hidden: false,
};

const SETUP_MESSAGE =
  "この画面を使うには、supabase/004_official_links.sql をSupabaseのSQL Editorで1回実行してください。";

export default function AdminLinksPage() {
  const [rows, setRows] = useState<LinkRow[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = useMemo(() => getSupabaseClient(), []);

  const load = useCallback(async () => {
    if (!supabase) {
      setMessage("Supabaseの設定が見つかりません。");
      setRows([]);
      return;
    }
    const { data, error } = await supabase
      .from("official_links")
      .select("id,name,url,description,when_to_use,category,subject,sort_order,hidden")
      .order("sort_order", { ascending: true });
    if (error) {
      // テーブルがまだ無いときは、SQLの実行を案内する
      setMessage(
        error.message.includes("official_links")
          ? SETUP_MESSAGE
          : `読み込みに失敗しました：${error.message}`,
      );
      setRows([]);
      return;
    }
    setRows((data ?? []) as LinkRow[]);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, [load]);

  async function save() {
    if (!supabase || !draft) return;
    if (!draft.name.trim() || !draft.url.trim()) {
      setMessage("サイト名とURLは必ず入れてください。");
      return;
    }
    setSaving(true);
    setMessage(null);

    const payload = {
      name: draft.name.trim(),
      url: draft.url.trim(),
      description: draft.description.trim(),
      when_to_use: draft.when_to_use.trim(),
      category: draft.category,
      subject: draft.subject?.trim() ? draft.subject.trim() : null,
      hidden: draft.hidden,
      updated_at: new Date().toISOString(),
    };

    const result = draft.id
      ? await supabase.from("official_links").update(payload).eq("id", draft.id)
      : await supabase.from("official_links").insert({
          ...payload,
          // 新しいものは、同じカテゴリーの最後に置く
          sort_order:
            Math.max(0, ...(rows ?? []).map((r) => r.sort_order)) + 1,
        });

    setSaving(false);
    if (result.error) {
      setMessage(`保存できませんでした：${result.error.message}`);
      return;
    }
    setMessage(draft.id ? "保存しました。" : "追加しました。");
    setDraft(null);
    load();
  }

  async function remove(row: LinkRow) {
    if (!supabase) return;
    if (
      !window.confirm(
        `「${row.name}」を削除します。\n元に戻せません。よろしいですか？`,
      )
    ) {
      return;
    }
    const { error } = await supabase.from("official_links").delete().eq("id", row.id);
    if (error) {
      setMessage(`削除できませんでした：${error.message}`);
      return;
    }
    setMessage("削除しました。");
    load();
  }

  async function toggleHidden(row: LinkRow) {
    if (!supabase) return;
    const { error } = await supabase
      .from("official_links")
      .update({ hidden: !row.hidden, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) {
      setMessage(`変更できませんでした：${error.message}`);
      return;
    }
    load();
  }

  /** 同じカテゴリーの中で、1つ上／下と並び順を入れかえる。 */
  async function move(row: LinkRow, direction: -1 | 1) {
    if (!supabase || !rows) return;
    const sameCategory = rows.filter((r) => r.category === row.category);
    const index = sameCategory.findIndex((r) => r.id === row.id);
    const partner = sameCategory[index + direction];
    if (!partner) return;

    const [a, b] = [row.sort_order, partner.sort_order];
    const results = await Promise.all([
      supabase.from("official_links").update({ sort_order: b }).eq("id", row.id),
      supabase.from("official_links").update({ sort_order: a }).eq("id", partner.id),
    ]);
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      setMessage(`並びかえに失敗しました：${failed.error.message}`);
      return;
    }
    load();
  }

  const btn =
    "rounded-full border border-line bg-white px-3 py-1 text-[13px] font-bold hover:bg-background";

  return (
    <AdminShell title="便利な公式サイト集の管理">
      <p className="mb-4 text-sm text-muted">
        サイトの「便利な公式サイト集」に出すリンクを、ここで追加・編集・削除できます。
        「非表示」にすると、消さずにサイトから見えなくできます。
      </p>

      {message && (
        <p className="mb-4 rounded-xl bg-warn-bg px-4 py-2.5 text-sm text-warn">
          {message}
        </p>
      )}

      {!draft && (
        <button
          type="button"
          onClick={() => setDraft({ ...EMPTY })}
          className="mb-5 rounded-full bg-cta px-6 py-2.5 text-sm font-bold text-white hover:bg-cta-dark"
        >
          ＋ 新しいサイトを追加する
        </button>
      )}

      {draft && (
        <div className="mb-6 rounded-2xl border border-accent bg-[#F7FAFF] p-5">
          <h2 className="mb-3 text-sm font-bold text-navy">
            {draft.id ? "編集する" : "新しいサイトを追加する"}
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              サイト名
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="rounded-xl border border-line px-3 py-2 text-sm font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              URL
              <input
                type="text"
                value={draft.url}
                placeholder="https://..."
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                className="rounded-xl border border-line px-3 py-2 text-sm font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              どんなサイトか
              <textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className="min-h-20 rounded-xl border border-line px-3 py-2 text-sm font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              使うタイミング
              <input
                type="text"
                value={draft.when_to_use}
                placeholder="〜したいときに。"
                onChange={(e) => setDraft({ ...draft, when_to_use: e.target.value })}
                className="rounded-xl border border-line px-3 py-2 text-sm font-normal"
              />
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col gap-1 text-[13px] font-bold">
                カテゴリー
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="rounded-xl border border-line px-3 py-2 text-sm font-normal"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-[13px] font-bold">
                教科（「教科の理解を深める」のときだけ）
                <input
                  type="text"
                  value={draft.subject ?? ""}
                  placeholder="国語・算数 など"
                  onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                  className="rounded-xl border border-line px-3 py-2 text-sm font-normal"
                />
              </label>
            </div>
            <label className="flex items-center gap-2 text-[13px] font-bold">
              <input
                type="checkbox"
                checked={draft.hidden}
                onChange={(e) => setDraft({ ...draft, hidden: e.target.checked })}
              />
              サイトに出さない（非表示）
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-full bg-cta px-6 py-2 text-sm font-bold text-white hover:bg-cta-dark disabled:opacity-60"
            >
              {saving ? "保存中..." : "保存する"}
            </button>
            <button type="button" onClick={() => setDraft(null)} className={btn}>
              やめる
            </button>
          </div>
        </div>
      )}

      {rows === null ? (
        <p className="text-sm text-muted">読み込み中です…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted">まだ登録がありません。</p>
      ) : (
        CATEGORIES.map((category) => {
          const list = rows.filter((r) => r.category === category);
          if (list.length === 0) return null;
          return (
            <div key={category} className="mb-6">
              <h2 className="mb-2 text-sm font-bold text-navy">
                {category}（{list.length}件）
              </h2>
              <div className="flex flex-col gap-2">
                {list.map((row, i) => (
                  <div
                    key={row.id}
                    className={`rounded-2xl border bg-white p-4 ${
                      row.hidden ? "border-warn-line bg-warn-bg" : "border-line"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold">{row.name}</span>
                      {row.subject && (
                        <span className="rounded-full bg-[#EAF2FA] px-2 py-0.5 text-[13px] font-bold text-navy">
                          {row.subject}
                        </span>
                      )}
                      {row.hidden && (
                        <span className="rounded-full bg-cta px-2 py-0.5 text-[13px] font-bold text-white">
                          非表示中
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[13px] break-all text-muted">{row.url}</p>
                    <p className="mt-1 text-[13px] text-muted">{row.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            id: row.id,
                            name: row.name,
                            url: row.url,
                            description: row.description,
                            when_to_use: row.when_to_use,
                            category: row.category,
                            subject: row.subject ?? "",
                            hidden: row.hidden,
                          })
                        }
                        className={`${btn} text-navy`}
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleHidden(row)}
                        className={`${btn} text-navy`}
                      >
                        {row.hidden ? "再表示する" : "非表示にする"}
                      </button>
                      <button
                        type="button"
                        onClick={() => move(row, -1)}
                        disabled={i === 0}
                        className={`${btn} disabled:opacity-40`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(row, 1)}
                        disabled={i === list.length - 1}
                        className={`${btn} disabled:opacity-40`}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(row)}
                        className={`${btn} text-cta`}
                      >
                        削除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </AdminShell>
  );
}
