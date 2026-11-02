"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseClient } from "@/lib/supabaseClient";

type GuideRow = {
  id: string;
  slug: string;
  title: string;
  tool: string;
  summary: string;
  what_it_does: string;
  how_to_use: string[];
  sample_prompt: string;
  caution: string;
  sort_order: number;
  hidden: boolean;
};

type Draft = Omit<GuideRow, "id" | "sort_order" | "how_to_use"> & {
  id?: string;
  /** 画面では1行＝1手順のテキストとして扱う */
  how_to_use_text: string;
};

const EMPTY: Draft = {
  slug: "",
  title: "",
  tool: "",
  summary: "",
  what_it_does: "",
  how_to_use_text: "",
  sample_prompt: "",
  caution: "",
  hidden: false,
};

const SETUP_MESSAGE =
  "この画面を使うには、supabase/005_ai_guides.sql をSupabaseのSQL Editorで1回実行してください。";

export default function AdminAiPage() {
  const [rows, setRows] = useState<GuideRow[] | null>(null);
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
      .from("ai_guides")
      .select(
        "id,slug,title,tool,summary,what_it_does,how_to_use,sample_prompt,caution,sort_order,hidden",
      )
      .order("sort_order", { ascending: true });
    if (error) {
      setMessage(
        error.message.includes("ai_guides")
          ? SETUP_MESSAGE
          : `読み込みに失敗しました：${error.message}`,
      );
      setRows([]);
      return;
    }
    setRows((data ?? []) as GuideRow[]);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, [load]);

  async function save() {
    if (!supabase || !draft) return;
    if (!draft.title.trim() || !draft.slug.trim()) {
      setMessage("題名と、アドレスに使う名前（slug）は必ず入れてください。");
      return;
    }
    setSaving(true);
    setMessage(null);

    const payload = {
      slug: draft.slug.trim(),
      title: draft.title.trim(),
      tool: draft.tool.trim(),
      summary: draft.summary.trim(),
      what_it_does: draft.what_it_does.trim(),
      // 空行は手順として数えない
      how_to_use: draft.how_to_use_text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      sample_prompt: draft.sample_prompt,
      caution: draft.caution.trim(),
      hidden: draft.hidden,
      updated_at: new Date().toISOString(),
    };

    const result = draft.id
      ? await supabase.from("ai_guides").update(payload).eq("id", draft.id)
      : await supabase.from("ai_guides").insert({
          ...payload,
          sort_order: Math.max(0, ...(rows ?? []).map((r) => r.sort_order)) + 1,
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

  async function remove(row: GuideRow) {
    if (!supabase) return;
    if (
      !window.confirm(`「${row.title}」を削除します。\n元に戻せません。よろしいですか？`)
    ) {
      return;
    }
    const { error } = await supabase.from("ai_guides").delete().eq("id", row.id);
    if (error) {
      setMessage(`削除できませんでした：${error.message}`);
      return;
    }
    setMessage("削除しました。");
    load();
  }

  async function toggleHidden(row: GuideRow) {
    if (!supabase) return;
    const { error } = await supabase
      .from("ai_guides")
      .update({ hidden: !row.hidden, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) {
      setMessage(`変更できませんでした：${error.message}`);
      return;
    }
    load();
  }

  async function move(index: number, direction: -1 | 1) {
    if (!supabase || !rows) return;
    const row = rows[index];
    const partner = rows[index + direction];
    if (!row || !partner) return;
    const results = await Promise.all([
      supabase.from("ai_guides").update({ sort_order: partner.sort_order }).eq("id", row.id),
      supabase.from("ai_guides").update({ sort_order: row.sort_order }).eq("id", partner.id),
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
  const field = "rounded-xl border border-line px-3 py-2 text-sm font-normal";

  return (
    <AdminShell title="先生のAI活用ガイドの管理">
      <p className="mb-4 text-sm text-muted">
        「先生のAI活用」に出すガイドを、ここで追加・編集・削除できます。
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
          ＋ 新しいガイドを追加する
        </button>
      )}

      {draft && (
        <div className="mb-6 rounded-2xl border border-accent bg-[#F7FAFF] p-5">
          <h2 className="mb-3 text-sm font-bold text-navy">
            {draft.id ? "編集する" : "新しいガイドを追加する"}
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              題名
              <input
                type="text"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className={field}
              />
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                アドレスに使う名前（半角英数字とハイフン）
                <input
                  type="text"
                  value={draft.slug}
                  placeholder="lesson-plan-drafting"
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  className={field}
                />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                使うAI
                <input
                  type="text"
                  value={draft.tool}
                  placeholder="ChatGPT / Claude"
                  onChange={(e) => setDraft({ ...draft, tool: e.target.value })}
                  className={field}
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              ひとことの説明（一覧に出ます）
              <textarea
                value={draft.summary}
                onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                className={`${field} min-h-16`}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              何ができるか
              <textarea
                value={draft.what_it_does}
                onChange={(e) => setDraft({ ...draft, what_it_does: e.target.value })}
                className={`${field} min-h-20`}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              どう使うか（1行に1つずつ書いてください）
              <textarea
                value={draft.how_to_use_text}
                onChange={(e) => setDraft({ ...draft, how_to_use_text: e.target.value })}
                className={`${field} min-h-24`}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              プロンプト例
              <textarea
                value={draft.sample_prompt}
                onChange={(e) => setDraft({ ...draft, sample_prompt: e.target.value })}
                className={`${field} min-h-24 font-mono`}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              気をつけること
              <textarea
                value={draft.caution}
                onChange={(e) => setDraft({ ...draft, caution: e.target.value })}
                className={`${field} min-h-20`}
              />
            </label>
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
        <div className="flex flex-col gap-2">
          {rows.map((row, i) => (
            <div
              key={row.id}
              className={`rounded-2xl border bg-white p-4 ${
                row.hidden ? "border-warn-line bg-warn-bg" : "border-line"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold">{row.title}</span>
                {row.tool && (
                  <span className="rounded-full bg-[#EAF2FA] px-2 py-0.5 text-[13px] font-bold text-navy">
                    {row.tool}
                  </span>
                )}
                {row.hidden && (
                  <span className="rounded-full bg-cta px-2 py-0.5 text-[13px] font-bold text-white">
                    非表示中
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13px] text-muted">{row.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      id: row.id,
                      slug: row.slug,
                      title: row.title,
                      tool: row.tool,
                      summary: row.summary,
                      what_it_does: row.what_it_does,
                      how_to_use_text: (row.how_to_use ?? []).join("\n"),
                      sample_prompt: row.sample_prompt,
                      caution: row.caution,
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
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className={`${btn} disabled:opacity-40`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1}
                  className={`${btn} disabled:opacity-40`}
                >
                  ↓
                </button>
                <button type="button" onClick={() => remove(row)} className={`${btn} text-cta`}>
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
