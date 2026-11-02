"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseClient } from "@/lib/supabaseClient";

/* アイスブレイクと学級レクは項目がよく似ているので、1つの画面で切りかえて扱う。 */

type Kind = "icebreakers" | "recreations";

const KIND_LABEL: Record<Kind, string> = {
  icebreakers: "アイスブレイク",
  recreations: "学級レク",
};

const ICE_CATEGORIES = [
  "会話・自己紹介系",
  "体を動かす系",
  "頭を使う・ゲーム系",
  "落ち着く・集中系",
];
const REC_CATEGORIES = [
  "そとあそび（鬼ごっこ系）",
  "そとあそび・体育館（体を動かす系）",
  "室内レク（体を動かす系）",
  "室内レク（静かに楽しむ系）",
];

/** 絵の種類。ここに無い名前を入れると絵が出ないので、選ぶ形にしている。 */
const ICE_SCENES = [
  "circle",
  "pair",
  "small-group",
  "line",
  "scatter",
  "front",
  "seated-circle",
];
const REC_SCENES = [
  "tag",
  "field",
  "ball",
  "relay",
  "rope",
  "team-line",
  "gym-circle",
  "seated-circle",
  "desk-group",
  "quiz",
];

const GRADES = ["低学年", "中学年", "高学年"];
const PLACES = ["校庭", "体育館", "教室"];
const OCCASIONS = ["お楽しみ会", "学級開き", "学期末", "雨の日"];

type Row = {
  id: string;
  slug: string;
  title: string;
  emoji: string;
  scene: string;
  category: string;
  duration: string;
  place: string;
  group_size: string;
  materials: string;
  steps: string[];
  tip: string | null;
  variation: string | null;
  sort_order: number;
  hidden: boolean;
  /* 学級レクだけ */
  grades?: string[];
  occasions?: string[];
  places?: string[];
  prep?: string;
  safety?: string | null;
  inclusion?: string | null;
  icebreaker_slug?: string | null;
};

type Draft = Omit<Row, "id" | "sort_order" | "steps"> & {
  id?: string;
  steps_text: string;
};

const SETUP_MESSAGE =
  "この画面を使うには、supabase/008_activities.sql をSupabaseのSQL Editorで1回実行してください。";

function emptyDraft(kind: Kind): Draft {
  return {
    slug: "",
    title: "",
    emoji: "",
    scene: kind === "icebreakers" ? ICE_SCENES[0] : REC_SCENES[0],
    category: kind === "icebreakers" ? ICE_CATEGORIES[0] : REC_CATEGORIES[0],
    duration: "",
    place: "",
    group_size: "",
    materials: "",
    steps_text: "",
    tip: "",
    variation: "",
    hidden: false,
    grades: [],
    occasions: [],
    places: [],
    prep: "",
    safety: "",
    inclusion: "",
    icebreaker_slug: "",
  };
}

export default function AdminActivitiesPage() {
  const [kind, setKind] = useState<Kind>("icebreakers");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = useMemo(() => getSupabaseClient(), []);
  const isRec = kind === "recreations";

  const load = useCallback(async () => {
    if (!supabase) {
      setMessage("Supabaseの設定が見つかりません。");
      setRows([]);
      return;
    }
    setRows(null);
    const columns = isRec
      ? "id,slug,title,emoji,scene,category,grades,occasions,duration,prep,place,places,group_size,materials,steps,tip,variation,safety,inclusion,icebreaker_slug,sort_order,hidden"
      : "id,slug,title,emoji,scene,category,duration,place,group_size,materials,steps,tip,variation,sort_order,hidden";
    const { data, error } = await supabase
      .from(kind)
      .select(columns)
      .order("sort_order", { ascending: true });
    if (error) {
      setMessage(
        error.message.includes(kind) ? SETUP_MESSAGE : `読み込みに失敗しました：${error.message}`,
      );
      setRows([]);
      return;
    }
    setRows((data ?? []) as unknown as Row[]);
  }, [supabase, kind, isRec]);

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

    const base = {
      slug: draft.slug.trim(),
      title: draft.title.trim(),
      emoji: draft.emoji.trim(),
      scene: draft.scene,
      category: draft.category,
      duration: draft.duration.trim(),
      place: draft.place.trim(),
      group_size: draft.group_size.trim(),
      materials: draft.materials.trim(),
      steps: draft.steps_text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      tip: draft.tip?.trim() ? draft.tip.trim() : null,
      variation: draft.variation?.trim() ? draft.variation.trim() : null,
      hidden: draft.hidden,
      updated_at: new Date().toISOString(),
    };
    const payload = isRec
      ? {
          ...base,
          grades: draft.grades ?? [],
          occasions: draft.occasions ?? [],
          places: draft.places ?? [],
          prep: draft.prep?.trim() ?? "",
          safety: draft.safety?.trim() ? draft.safety.trim() : null,
          inclusion: draft.inclusion?.trim() ? draft.inclusion.trim() : null,
          icebreaker_slug: draft.icebreaker_slug?.trim()
            ? draft.icebreaker_slug.trim()
            : null,
        }
      : base;

    const result = draft.id
      ? await supabase.from(kind).update(payload).eq("id", draft.id)
      : await supabase.from(kind).insert({
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

  async function remove(row: Row) {
    if (!supabase) return;
    if (!window.confirm(`「${row.title}」を削除します。\n元に戻せません。よろしいですか？`)) {
      return;
    }
    const { error } = await supabase.from(kind).delete().eq("id", row.id);
    if (error) {
      setMessage(`削除できませんでした：${error.message}`);
      return;
    }
    setMessage("削除しました。");
    load();
  }

  async function toggleHidden(row: Row) {
    if (!supabase) return;
    await supabase
      .from(kind)
      .update({ hidden: !row.hidden, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    load();
  }

  async function move(index: number, direction: -1 | 1) {
    if (!supabase || !rows) return;
    const row = rows[index];
    const partner = rows[index + direction];
    if (!row || !partner) return;
    await Promise.all([
      supabase.from(kind).update({ sort_order: partner.sort_order }).eq("id", row.id),
      supabase.from(kind).update({ sort_order: row.sort_order }).eq("id", partner.id),
    ]);
    load();
  }

  function toggleIn(list: string[] | undefined, value: string): string[] {
    const current = list ?? [];
    return current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
  }

  const btn =
    "rounded-full border border-line bg-white px-3 py-1 text-[13px] font-bold hover:bg-background";
  const field = "rounded-xl border border-line px-3 py-2 text-sm font-normal";

  return (
    <AdminShell title="アイスブレイク・学級レクの管理">
      <p className="mb-4 text-sm text-muted">
        遊びの中身を、ここで追加・編集・削除できます。
        「非表示」にすると、消さずにサイトから見えなくできます。
      </p>

      <div className="mb-5 flex gap-2">
        {(["icebreakers", "recreations"] as Kind[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setKind(k);
              setDraft(null);
              setMessage(null);
            }}
            className={`rounded-full px-5 py-2 text-sm font-bold ${
              kind === k ? "bg-navy text-white" : "border border-line bg-white text-muted"
            }`}
          >
            {KIND_LABEL[k]}
          </button>
        ))}
      </div>

      {message && (
        <p className="mb-4 rounded-xl bg-warn-bg px-4 py-2.5 text-sm text-warn">{message}</p>
      )}

      {!draft && (
        <button
          type="button"
          onClick={() => setDraft(emptyDraft(kind))}
          className="mb-5 rounded-full bg-cta px-6 py-2.5 text-sm font-bold text-white hover:bg-cta-dark"
        >
          ＋ 新しい{KIND_LABEL[kind]}を追加する
        </button>
      )}

      {draft && (
        <div className="mb-6 rounded-2xl border border-accent bg-[#F7FAFF] p-5">
          <h2 className="mb-3 text-sm font-bold text-navy">
            {draft.id ? "編集する" : `新しい${KIND_LABEL[kind]}を追加する`}
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex w-24 flex-col gap-1 text-[13px] font-bold">
                絵文字
                <input
                  type="text"
                  value={draft.emoji}
                  onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
                  className={field}
                />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                題名
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className={field}
                />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                アドレスに使う名前（半角英数字とハイフン）
                <input
                  type="text"
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  className={field}
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                カテゴリー
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className={field}
                >
                  {(isRec ? REC_CATEGORIES : ICE_CATEGORIES).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex w-48 flex-col gap-1 text-[13px] font-bold">
                絵の種類
                <select
                  value={draft.scene}
                  onChange={(e) => setDraft({ ...draft, scene: e.target.value })}
                  className={field}
                >
                  {(isRec ? REC_SCENES : ICE_SCENES).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                かかる時間
                <input
                  type="text"
                  value={draft.duration}
                  placeholder="10〜15分"
                  onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                  className={field}
                />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                場所（表示用の文）
                <input
                  type="text"
                  value={draft.place}
                  onChange={(e) => setDraft({ ...draft, place: e.target.value })}
                  className={field}
                />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                人数
                <input
                  type="text"
                  value={draft.group_size}
                  onChange={(e) => setDraft({ ...draft, group_size: e.target.value })}
                  className={field}
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-[13px] font-bold">
              準備するもの
              <input
                type="text"
                value={draft.materials}
                onChange={(e) => setDraft({ ...draft, materials: e.target.value })}
                className={field}
              />
            </label>

            {isRec && (
              <>
                <label className="flex flex-col gap-1 text-[13px] font-bold">
                  場を作るのにかかる時間
                  <input
                    type="text"
                    value={draft.prep ?? ""}
                    placeholder="なし／5分 など"
                    onChange={(e) => setDraft({ ...draft, prep: e.target.value })}
                    className={field}
                  />
                </label>
                <div className="flex flex-wrap gap-6">
                  <div className="text-[13px] font-bold">
                    対象学年
                    <div className="mt-1 flex gap-3 font-normal">
                      {GRADES.map((g) => (
                        <label key={g} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={(draft.grades ?? []).includes(g)}
                            onChange={() =>
                              setDraft({ ...draft, grades: toggleIn(draft.grades, g) })
                            }
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="text-[13px] font-bold">
                    場所（絞り込み用）
                    <div className="mt-1 flex gap-3 font-normal">
                      {PLACES.map((p) => (
                        <label key={p} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={(draft.places ?? []).includes(p)}
                            onChange={() =>
                              setDraft({ ...draft, places: toggleIn(draft.places, p) })
                            }
                          />
                          {p}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="text-[13px] font-bold">
                    こんなときに
                    <div className="mt-1 flex gap-3 font-normal">
                      {OCCASIONS.map((o) => (
                        <label key={o} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={(draft.occasions ?? []).includes(o)}
                            onChange={() =>
                              setDraft({ ...draft, occasions: toggleIn(draft.occasions, o) })
                            }
                          />
                          {o}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <label className="flex flex-col gap-1 text-[13px] font-bold">
              やり方（1行に1つずつ書いてください）
              <textarea
                value={draft.steps_text}
                onChange={(e) => setDraft({ ...draft, steps_text: e.target.value })}
                className={`${field} min-h-32`}
              />
            </label>

            <label className="flex flex-col gap-1 text-[13px] font-bold">
              うまくいくコツ（なくてもよい）
              <textarea
                value={draft.tip ?? ""}
                onChange={(e) => setDraft({ ...draft, tip: e.target.value })}
                className={`${field} min-h-16`}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              アレンジ（なくてもよい）
              <textarea
                value={draft.variation ?? ""}
                onChange={(e) => setDraft({ ...draft, variation: e.target.value })}
                className={`${field} min-h-16`}
              />
            </label>

            {isRec && (
              <>
                <label className="flex flex-col gap-1 text-[13px] font-bold">
                  安全面で確かめること（なくてもよい）
                  <textarea
                    value={draft.safety ?? ""}
                    onChange={(e) => setDraft({ ...draft, safety: e.target.value })}
                    className={`${field} min-h-16`}
                  />
                </label>
                <label className="flex flex-col gap-1 text-[13px] font-bold">
                  どの子も参加できるようにする工夫（なくてもよい）
                  <textarea
                    value={draft.inclusion ?? ""}
                    onChange={(e) => setDraft({ ...draft, inclusion: e.target.value })}
                    className={`${field} min-h-16`}
                  />
                </label>
                <label className="flex flex-col gap-1 text-[13px] font-bold">
                  同じ遊びのアイスブレイクのslug（あれば相互リンクされます）
                  <input
                    type="text"
                    value={draft.icebreaker_slug ?? ""}
                    onChange={(e) => setDraft({ ...draft, icebreaker_slug: e.target.value })}
                    className={field}
                  />
                </label>
              </>
            )}

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
          <p className="text-[13px] text-muted">全{rows.length}件</p>
          {rows.map((row, i) => (
            <div
              key={row.id}
              className={`rounded-2xl border bg-white p-4 ${
                row.hidden ? "border-warn-line bg-warn-bg" : "border-line"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span>{row.emoji}</span>
                <span className="text-sm font-bold">{row.title}</span>
                <span className="rounded-full bg-[#EAF2FA] px-2 py-0.5 text-[13px] font-bold text-navy">
                  {row.category}
                </span>
                <span className="text-[13px] text-muted">{row.duration}</span>
                {row.hidden && (
                  <span className="rounded-full bg-cta px-2 py-0.5 text-[13px] font-bold text-white">
                    非表示中
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...row,
                      steps_text: (row.steps ?? []).join("\n"),
                      tip: row.tip ?? "",
                      variation: row.variation ?? "",
                      safety: row.safety ?? "",
                      inclusion: row.inclusion ?? "",
                      icebreaker_slug: row.icebreaker_slug ?? "",
                      prep: row.prep ?? "",
                      grades: row.grades ?? [],
                      occasions: row.occasions ?? [],
                      places: row.places ?? [],
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
