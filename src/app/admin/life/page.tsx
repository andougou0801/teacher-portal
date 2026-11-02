"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { SubItem } from "@/lib/lifeTerms";

type GroupRow = {
  id: string;
  title: string;
  icon: string;
  note: string | null;
  sort_order: number;
  hidden: boolean;
};

type TermRow = {
  id: string;
  group_title: string;
  name: string;
  description: string;
  sub_items: SubItem[] | null;
  sort_order: number;
  hidden: boolean;
};

type TermDraft = {
  id?: string;
  group_title: string;
  name: string;
  description: string;
  sub_items: SubItem[];
  hidden: boolean;
};

const SETUP_MESSAGE =
  "この画面を使うには、supabase/006_life_terms.sql をSupabaseのSQL Editorで1回実行してください（先に004も実行してください）。";

export default function AdminLifePage() {
  const [groups, setGroups] = useState<GroupRow[] | null>(null);
  const [terms, setTerms] = useState<TermRow[]>([]);
  const [groupDraft, setGroupDraft] = useState<Partial<GroupRow> | null>(null);
  const [termDraft, setTermDraft] = useState<TermDraft | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = useMemo(() => getSupabaseClient(), []);

  const load = useCallback(async () => {
    if (!supabase) {
      setMessage("Supabaseの設定が見つかりません。");
      setGroups([]);
      return;
    }
    const [g, t] = await Promise.all([
      supabase
        .from("life_groups")
        .select("id,title,icon,note,sort_order,hidden")
        .order("sort_order", { ascending: true }),
      supabase
        .from("life_terms")
        .select("id,group_title,name,description,sub_items,sort_order,hidden")
        .order("sort_order", { ascending: true }),
    ]);
    if (g.error) {
      setMessage(
        g.error.message.includes("life_groups")
          ? SETUP_MESSAGE
          : `読み込みに失敗しました：${g.error.message}`,
      );
      setGroups([]);
      return;
    }
    setGroups((g.data ?? []) as GroupRow[]);
    setTerms(t.error ? [] : ((t.data ?? []) as TermRow[]));
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, [load]);

  /* ---------- まとまり（グループ） ---------- */

  async function saveGroup() {
    if (!supabase || !groupDraft) return;
    if (!groupDraft.title?.trim()) {
      setMessage("まとまりの名前は必ず入れてください。");
      return;
    }
    setSaving(true);
    const payload = {
      title: groupDraft.title.trim(),
      icon: (groupDraft.icon ?? "").trim(),
      note: groupDraft.note?.trim() ? groupDraft.note.trim() : null,
      hidden: groupDraft.hidden ?? false,
      updated_at: new Date().toISOString(),
    };
    const before = groups?.find((x) => x.id === groupDraft.id);
    const result = groupDraft.id
      ? await supabase.from("life_groups").update(payload).eq("id", groupDraft.id)
      : await supabase.from("life_groups").insert({
          ...payload,
          sort_order: Math.max(0, ...(groups ?? []).map((x) => x.sort_order)) + 1,
        });
    // 名前を変えたときは、ぶら下がっている用語の group_title も一緒に直す
    if (!result.error && before && before.title !== payload.title) {
      await supabase
        .from("life_terms")
        .update({ group_title: payload.title })
        .eq("group_title", before.title);
    }
    setSaving(false);
    if (result.error) {
      setMessage(`保存できませんでした：${result.error.message}`);
      return;
    }
    setMessage("保存しました。");
    setGroupDraft(null);
    load();
  }

  async function removeGroup(row: GroupRow) {
    if (!supabase) return;
    const count = terms.filter((t) => t.group_title === row.title).length;
    if (
      !window.confirm(
        `「${row.title}」を削除します。中の用語${count}件も一緒に消えます。\n元に戻せません。よろしいですか？`,
      )
    ) {
      return;
    }
    await supabase.from("life_terms").delete().eq("group_title", row.title);
    const { error } = await supabase.from("life_groups").delete().eq("id", row.id);
    if (error) {
      setMessage(`削除できませんでした：${error.message}`);
      return;
    }
    setMessage("削除しました。");
    load();
  }

  /* ---------- 用語 ---------- */

  async function saveTerm() {
    if (!supabase || !termDraft) return;
    if (!termDraft.name.trim()) {
      setMessage("用語の名前は必ず入れてください。");
      return;
    }
    setSaving(true);
    const payload = {
      group_title: termDraft.group_title,
      name: termDraft.name.trim(),
      description: termDraft.description.trim(),
      sub_items: termDraft.sub_items.length > 0 ? termDraft.sub_items : null,
      hidden: termDraft.hidden,
      updated_at: new Date().toISOString(),
    };
    const sameGroup = terms.filter((t) => t.group_title === termDraft.group_title);
    const result = termDraft.id
      ? await supabase.from("life_terms").update(payload).eq("id", termDraft.id)
      : await supabase.from("life_terms").insert({
          ...payload,
          sort_order: Math.max(0, ...sameGroup.map((t) => t.sort_order)) + 1,
        });
    setSaving(false);
    if (result.error) {
      setMessage(`保存できませんでした：${result.error.message}`);
      return;
    }
    setMessage("保存しました。");
    setTermDraft(null);
    load();
  }

  async function removeTerm(row: TermRow) {
    if (!supabase) return;
    if (!window.confirm(`「${row.name}」を削除します。\n元に戻せません。よろしいですか？`)) {
      return;
    }
    const { error } = await supabase.from("life_terms").delete().eq("id", row.id);
    if (error) {
      setMessage(`削除できませんでした：${error.message}`);
      return;
    }
    setMessage("削除しました。");
    load();
  }

  async function moveTerm(row: TermRow, direction: -1 | 1) {
    if (!supabase) return;
    const list = terms.filter((t) => t.group_title === row.group_title);
    const index = list.findIndex((t) => t.id === row.id);
    const partner = list[index + direction];
    if (!partner) return;
    await Promise.all([
      supabase.from("life_terms").update({ sort_order: partner.sort_order }).eq("id", row.id),
      supabase.from("life_terms").update({ sort_order: row.sort_order }).eq("id", partner.id),
    ]);
    load();
  }

  async function moveGroup(row: GroupRow, direction: -1 | 1) {
    if (!supabase || !groups) return;
    const index = groups.findIndex((g) => g.id === row.id);
    const partner = groups[index + direction];
    if (!partner) return;
    await Promise.all([
      supabase.from("life_groups").update({ sort_order: partner.sort_order }).eq("id", row.id),
      supabase.from("life_groups").update({ sort_order: row.sort_order }).eq("id", partner.id),
    ]);
    load();
  }

  const btn =
    "rounded-full border border-line bg-white px-3 py-1 text-[13px] font-bold hover:bg-background";
  const field = "rounded-xl border border-line px-3 py-2 text-sm font-normal";

  return (
    <AdminShell title="忙しい先生のためのページの管理">
      <p className="mb-4 text-sm text-muted">
        休暇や育児・介護の制度の説明を、ここで編集できます。
        「まとまり」（見出し）の中に「用語」が並ぶ形です。
        ページ下部の公式窓口のリンクは、
        <strong>「便利な公式サイト集」の管理画面</strong>
        で「忙しい先生のためのページ」カテゴリーとして編集します。
      </p>

      {message && (
        <p className="mb-4 rounded-xl bg-warn-bg px-4 py-2.5 text-sm text-warn">{message}</p>
      )}

      {!groupDraft && !termDraft && (
        <button
          type="button"
          onClick={() => setGroupDraft({ title: "", icon: "", note: "", hidden: false })}
          className="mb-5 rounded-full bg-cta px-6 py-2.5 text-sm font-bold text-white hover:bg-cta-dark"
        >
          ＋ 新しいまとまりを追加する
        </button>
      )}

      {groupDraft && (
        <div className="mb-6 rounded-2xl border border-accent bg-[#F7FAFF] p-5">
          <h2 className="mb-3 text-sm font-bold text-navy">
            {groupDraft.id ? "まとまりを編集する" : "新しいまとまりを追加する"}
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex w-28 flex-col gap-1 text-[13px] font-bold">
                絵文字
                <input
                  type="text"
                  value={groupDraft.icon ?? ""}
                  placeholder="🌴"
                  onChange={(e) => setGroupDraft({ ...groupDraft, icon: e.target.value })}
                  className={field}
                />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                まとまりの名前
                <input
                  type="text"
                  value={groupDraft.title ?? ""}
                  onChange={(e) => setGroupDraft({ ...groupDraft, title: e.target.value })}
                  className={field}
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              まとまりの説明（なくてもよい）
              <textarea
                value={groupDraft.note ?? ""}
                onChange={(e) => setGroupDraft({ ...groupDraft, note: e.target.value })}
                className={`${field} min-h-20`}
              />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={saveGroup}
              disabled={saving}
              className="rounded-full bg-cta px-6 py-2 text-sm font-bold text-white hover:bg-cta-dark disabled:opacity-60"
            >
              {saving ? "保存中..." : "保存する"}
            </button>
            <button type="button" onClick={() => setGroupDraft(null)} className={btn}>
              やめる
            </button>
          </div>
        </div>
      )}

      {termDraft && (
        <div className="mb-6 rounded-2xl border border-accent bg-[#F7FAFF] p-5">
          <h2 className="mb-3 text-sm font-bold text-navy">
            {termDraft.id ? "用語を編集する" : "新しい用語を追加する"}
            <span className="ml-2 font-normal text-muted">（{termDraft.group_title}）</span>
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              用語の名前
              <input
                type="text"
                value={termDraft.name}
                onChange={(e) => setTermDraft({ ...termDraft, name: e.target.value })}
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              説明
              <textarea
                value={termDraft.description}
                onChange={(e) => setTermDraft({ ...termDraft, description: e.target.value })}
                className={`${field} min-h-28`}
              />
            </label>

            <div className="rounded-xl border border-line bg-white p-3">
              <div className="mb-2 text-[13px] font-bold">
                内わけ（特別休暇の号など。要らなければ空のままで大丈夫です）
              </div>
              {termDraft.sub_items.map((item, i) => (
                <div key={i} className="mb-2 flex flex-wrap items-end gap-2 border-b border-line pb-2">
                  <label className="flex flex-1 flex-col gap-1 text-[12px]">
                    名前
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const next = [...termDraft.sub_items];
                        next[i] = { ...item, name: e.target.value };
                        setTermDraft({ ...termDraft, sub_items: next });
                      }}
                      className={field}
                    />
                  </label>
                  <label className="flex w-40 flex-col gap-1 text-[12px]">
                    条文
                    <input
                      type="text"
                      value={item.article}
                      onChange={(e) => {
                        const next = [...termDraft.sub_items];
                        next[i] = { ...item, article: e.target.value };
                        setTermDraft({ ...termDraft, sub_items: next });
                      }}
                      className={field}
                    />
                  </label>
                  <label className="flex w-40 flex-col gap-1 text-[12px]">
                    日数
                    <input
                      type="text"
                      value={item.duration}
                      onChange={(e) => {
                        const next = [...termDraft.sub_items];
                        next[i] = { ...item, duration: e.target.value };
                        setTermDraft({ ...termDraft, sub_items: next });
                      }}
                      className={field}
                    />
                  </label>
                  <label className="flex items-center gap-1 pb-2 text-[12px] font-bold">
                    <input
                      type="checkbox"
                      checked={!!item.common}
                      onChange={(e) => {
                        const next = [...termDraft.sub_items];
                        next[i] = { ...item, common: e.target.checked };
                        setTermDraft({ ...termDraft, sub_items: next });
                      }}
                    />
                    よく使う
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setTermDraft({
                        ...termDraft,
                        sub_items: termDraft.sub_items.filter((_, j) => j !== i),
                      })
                    }
                    className={`${btn} mb-1 text-cta`}
                  >
                    この行を消す
                  </button>
                  <label className="flex w-full flex-col gap-1 text-[12px]">
                    くわしい説明
                    <textarea
                      value={item.note ?? ""}
                      onChange={(e) => {
                        const next = [...termDraft.sub_items];
                        next[i] = { ...item, note: e.target.value };
                        setTermDraft({ ...termDraft, sub_items: next });
                      }}
                      className={`${field} min-h-16`}
                    />
                  </label>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setTermDraft({
                    ...termDraft,
                    sub_items: [
                      ...termDraft.sub_items,
                      { name: "", article: "", duration: "", note: "", common: false },
                    ],
                  })
                }
                className={btn}
              >
                ＋ 内わけを1つ足す
              </button>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={saveTerm}
              disabled={saving}
              className="rounded-full bg-cta px-6 py-2 text-sm font-bold text-white hover:bg-cta-dark disabled:opacity-60"
            >
              {saving ? "保存中..." : "保存する"}
            </button>
            <button type="button" onClick={() => setTermDraft(null)} className={btn}>
              やめる
            </button>
          </div>
        </div>
      )}

      {groups === null ? (
        <p className="text-sm text-muted">読み込み中です…</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-muted">まだ登録がありません。</p>
      ) : (
        groups.map((group, gi) => {
          const list = terms.filter((t) => t.group_title === group.title);
          return (
            <div key={group.id} className="mb-6 rounded-2xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg">{group.icon}</span>
                <span className="text-sm font-bold">{group.title}</span>
                <span className="text-[13px] text-muted">（用語{list.length}件）</span>
              </div>
              {group.note && <p className="mt-1 text-[13px] text-muted">{group.note}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setGroupDraft({ ...group })}
                  className={`${btn} text-navy`}
                >
                  まとまりを編集
                </button>
                <button
                  type="button"
                  onClick={() => moveGroup(group, -1)}
                  disabled={gi === 0}
                  className={`${btn} disabled:opacity-40`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveGroup(group, 1)}
                  disabled={gi === groups.length - 1}
                  className={`${btn} disabled:opacity-40`}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTermDraft({
                      group_title: group.title,
                      name: "",
                      description: "",
                      sub_items: [],
                      hidden: false,
                    })
                  }
                  className={`${btn} text-accent`}
                >
                  ＋ 用語を足す
                </button>
                <button
                  type="button"
                  onClick={() => removeGroup(group)}
                  className={`${btn} text-cta`}
                >
                  まとまりごと削除
                </button>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {list.map((row, i) => (
                  <div key={row.id} className="rounded-xl border border-line bg-background p-3">
                    <div className="text-sm font-bold">{row.name}</div>
                    <p className="mt-1 line-clamp-2 text-[13px] text-muted">{row.description}</p>
                    {row.sub_items && row.sub_items.length > 0 && (
                      <p className="mt-1 text-[12px] text-accent">
                        内わけ {row.sub_items.length}件
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setTermDraft({
                            id: row.id,
                            group_title: row.group_title,
                            name: row.name,
                            description: row.description,
                            sub_items: row.sub_items ?? [],
                            hidden: row.hidden,
                          })
                        }
                        className={`${btn} text-navy`}
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTerm(row, -1)}
                        disabled={i === 0}
                        className={`${btn} disabled:opacity-40`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTerm(row, 1)}
                        disabled={i === list.length - 1}
                        className={`${btn} disabled:opacity-40`}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTerm(row)}
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
