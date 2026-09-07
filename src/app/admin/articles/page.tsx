"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { tools } from "@/lib/tools";

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string[] | null;
  author: string;
  read_time: string;
  published_at: string;
  section: "column" | "lesson" | "classroom" | "event" | null;
  subject: string | null;
  month: string | null;
  situation: string | null;
  related_tools: string[] | null;
  related_icebreakers: string[] | null;
  status: "draft" | "published";
};

const SECTIONS = [
  { value: "", label: "記事一覧のみ" },
  { value: "column", label: "コラム" },
  { value: "lesson", label: "授業・教材アイデア" },
  { value: "classroom", label: "学級経営・子ども対応" },
  { value: "event", label: "学校行事・年間行事" },
] as const;

const MONTHS = [
  "4月", "5月", "6月", "7月", "8月", "9月",
  "10月", "11月", "12月", "1月", "2月", "3月",
];

const emptyForm = (): ArticleRow => ({
  id: "",
  slug: "",
  title: "",
  category: "",
  summary: "",
  body: [],
  author: "全国教員支援ポータル編集部",
  read_time: "3分で読める",
  published_at: new Date().toISOString().slice(0, 10),
  section: null,
  subject: null,
  month: null,
  situation: null,
  related_tools: [],
  related_icebreakers: [],
  status: "draft",
});

/** 日本語タイトルからは英字スラッグを作れないため、日付＋連番で自動生成する。 */
function generateSlug(): string {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `post-${today}-${suffix}`;
}

export default function AdminArticlesPage() {
  const [rows, setRows] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ArticleRow | null>(null);
  const [bodyText, setBodyText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = useMemo(() => getSupabaseClient(), []);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      setMessage("記事の読み込みに失敗しました。時間をおいて開き直してください。");
    } else {
      setRows((data ?? []) as ArticleRow[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, [load]);

  function startNew() {
    const draft = emptyForm();
    draft.slug = generateSlug();
    setForm(draft);
    setBodyText("");
    setMessage(null);
  }

  function startEdit(row: ArticleRow) {
    setForm({ ...row });
    setBodyText((row.body ?? []).join("\n\n"));
    setMessage(null);
  }

  async function save() {
    if (!supabase || !form) return;
    if (!form.title.trim()) {
      setMessage("タイトルを入力してください。");
      return;
    }
    setSaving(true);
    setMessage(null);

    const payload = {
      slug: form.slug.trim() || generateSlug(),
      title: form.title.trim(),
      category: form.category.trim() || "お知らせ",
      summary: form.summary.trim(),
      body: bodyText
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
      author: form.author.trim() || "全国教員支援ポータル編集部",
      read_time: form.read_time.trim(),
      published_at: form.published_at,
      section: form.section,
      subject: form.section === "lesson" ? form.subject : null,
      month: form.section === "event" ? form.month : null,
      situation: form.section === "classroom" ? form.situation : null,
      related_tools: form.related_tools ?? [],
      related_icebreakers: form.related_icebreakers ?? [],
      status: form.status,
    };

    const { error } = form.id
      ? await supabase.from("articles").update(payload).eq("id", form.id)
      : await supabase.from("articles").insert(payload);

    setSaving(false);
    if (error) {
      setMessage(`保存できませんでした：${error.message}`);
      return;
    }
    setForm(null);
    setMessage("保存しました。サイトへの反映は最大1分ほどかかります。");
    load();
  }

  async function remove(row: ArticleRow) {
    if (!supabase) return;
    if (!window.confirm(`「${row.title}」を削除します。よろしいですか？`)) return;
    const { error } = await supabase.from("articles").delete().eq("id", row.id);
    if (error) {
      setMessage(`削除できませんでした：${error.message}`);
      return;
    }
    setMessage("削除しました。");
    load();
  }

  function toggleRelatedTool(slug: string) {
    setForm((prev) => {
      if (!prev) return prev;
      const current = prev.related_tools ?? [];
      return {
        ...prev,
        related_tools: current.includes(slug)
          ? current.filter((s) => s !== slug)
          : [...current, slug],
      };
    });
  }

  const inputClass =
    "w-full rounded-xl border border-line px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

  return (
    <AdminShell title="記事・コラムの管理">
      {message && (
        <p className="mb-4 rounded-xl bg-warn-bg px-4 py-2.5 text-sm text-warn">
          {message}
        </p>
      )}

      {form ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">
              {form.id ? "記事を編集" : "新しい記事"}
            </h2>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="text-sm font-bold text-accent hover:underline"
            >
              閉じる
            </button>
          </div>

          <label className="flex flex-col gap-1 text-sm font-bold">
            タイトル
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-bold">
            カテゴリー（例：学級経営、ICT活用）
            <input
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-bold">
            要約（一覧に表示される短い説明）
            <textarea
              className={`${inputClass} min-h-20`}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-bold">
            本文
            <span className="text-sm font-normal text-muted">
              段落の区切りは「空行」を1つ入れてください。空行ごとに段落として表示されます。
            </span>
            <textarea
              className={`${inputClass} min-h-64`}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-bold">
            掲載先
            <select
              className={inputClass}
              value={form.section ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  section: (e.target.value || null) as ArticleRow["section"],
                })
              }
            >
              {SECTIONS.map((section) => (
                <option key={section.value} value={section.value}>
                  {section.label}
                </option>
              ))}
            </select>
          </label>

          {form.section === "lesson" && (
            <label className="flex flex-col gap-1 text-sm font-bold">
              教科（例：国語、算数）
              <input
                className={inputClass}
                value={form.subject ?? ""}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </label>
          )}

          {form.section === "event" && (
            <label className="flex flex-col gap-1 text-sm font-bold">
              時期
              <select
                className={inputClass}
                value={form.month ?? ""}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
              >
                <option value="">選んでください</option>
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
          )}

          {form.section === "classroom" && (
            <label className="flex flex-col gap-1 text-sm font-bold">
              場面（例：学級開き、保護者対応）
              <input
                className={inputClass}
                value={form.situation ?? ""}
                onChange={(e) => setForm({ ...form, situation: e.target.value })}
              />
            </label>
          )}

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-bold">
              記事の下に表示する関連ツール（任意）
            </legend>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => {
                const checked = (form.related_tools ?? []).includes(tool.slug);
                return (
                  <button
                    key={tool.slug}
                    type="button"
                    onClick={() => toggleRelatedTool(tool.slug)}
                    className={`rounded-full border px-3 py-1 text-[13px] font-bold ${
                      checked
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-white text-navy"
                    }`}
                  >
                    {tool.icon} {tool.name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm font-bold">
              公開日
              <input
                type="date"
                className={inputClass}
                value={form.published_at}
                onChange={(e) =>
                  setForm({ ...form, published_at: e.target.value })
                }
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-bold">
              読了時間
              <input
                className={inputClass}
                value={form.read_time}
                onChange={(e) => setForm({ ...form, read_time: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-bold">
              状態
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as ArticleRow["status"],
                  })
                }
              >
                <option value="draft">下書き（サイトには出ません）</option>
                <option value="published">公開</option>
              </select>
            </label>
          </div>

          <details>
            <summary className="cursor-pointer text-sm font-bold text-accent">
              詳細設定（URL・著者名）
            </summary>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-bold">
                URL（半角英数字）
                <input
                  className={inputClass}
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-bold">
                著者名
                <input
                  className={inputClass}
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </label>
            </div>
          </details>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-full bg-cta px-6 py-2.5 text-sm font-bold text-white hover:bg-cta-dark disabled:opacity-60"
            >
              {saving ? "保存中…" : "保存する"}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="rounded-full border border-line bg-white px-6 py-2.5 text-sm font-bold text-navy hover:bg-background"
            >
              やめる
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={startNew}
            className="mb-4 rounded-full bg-cta px-6 py-2.5 text-sm font-bold text-white hover:bg-cta-dark"
          >
            ＋ 新しい記事を書く
          </button>

          {loading ? (
            <p className="text-sm text-muted">読み込み中です…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted">
              まだ記事がありません。「新しい記事を書く」から追加してください。
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-white p-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[13px] font-bold ${
                          row.status === "published"
                            ? "bg-[#EAF2FA] text-navy"
                            : "bg-warn-bg text-warn"
                        }`}
                      >
                        {row.status === "published" ? "公開中" : "下書き"}
                      </span>
                      <span className="text-[13px] text-muted">
                        {row.category}・{row.published_at}
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-bold">{row.title}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-bold text-navy hover:bg-background"
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(row)}
                      className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-bold text-cta hover:bg-background"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
