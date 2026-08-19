"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";
import { qaCategories } from "@/lib/qaCategories";

type QuestionRow = {
  id: string;
  category: string;
  nickname: string | null;
  question: string;
  created_at: string;
  answers: { count: number }[];
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export default function CommunityPage() {
  const [questions, setQuestions] = useState<QuestionRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("すべて");

  const [formCategory, setFormCategory] = useState<string>(qaCategories[0]);
  const [formNickname, setFormNickname] = useState("");
  const [formQuestion, setFormQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("questions")
      .select("id, category, nickname, question, created_at, answers(count)")
      .order("created_at", { ascending: false });
    if (error) {
      setLoadError("読み込みに失敗しました。しばらくしてから再度お試しください。");
      return;
    }
    setQuestions((data as QuestionRow[]) ?? []);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    loadQuestions();
  }, [loadQuestions]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const text = formQuestion.trim();
    if (!text) {
      setSubmitMessage("質問内容を入力してください。");
      return;
    }
    if (text.length > 300) {
      setSubmitMessage("質問は300字以内でお願いします。");
      return;
    }
    setSubmitting(true);
    setSubmitMessage(null);
    const { error } = await supabase.from("questions").insert({
      category: formCategory,
      nickname: formNickname.trim() || null,
      question: text,
    });
    setSubmitting(false);
    if (error) {
      setSubmitMessage("投稿に失敗しました。しばらくしてから再度お試しください。");
      return;
    }
    setFormQuestion("");
    setSubmitMessage("投稿しました！");
    loadQuestions();
  }

  const filtered =
    questions === null
      ? null
      : activeCategory === "すべて"
        ? questions
        : questions.filter((q) => q.category === activeCategory);

  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Community
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">
          💬 先生の「困った」Q&A・コミュニティ
        </h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          気になることを気軽に質問して、他の先生からの回答をもらえる掲示板です。
          ニックネームは任意、会員登録は不要です。
        </p>
      </div>

      {!isSupabaseConfigured ? (
        <div className="rounded-2xl border border-warn-line bg-warn-bg p-6 text-center text-sm text-warn">
          このコミュニティ機能は現在準備中です。公開までしばらくお待ちください。
        </div>
      ) : (
        <>
          <div className="mb-8 rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-3 text-sm font-bold text-navy">質問を投稿する</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {qaCategories.map((cat) => (
                  <label
                    key={cat}
                    className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm font-bold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                      formCategory === cat
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-white text-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={formCategory === cat}
                      onChange={() => setFormCategory(cat)}
                      className="sr-only"
                    />
                    {cat}
                  </label>
                ))}
              </div>
              <label htmlFor="question-text" className="sr-only">
                質問内容
              </label>
              <textarea
                id="question-text"
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                maxLength={300}
                placeholder="困っていることを書いてください（300字まで）"
                className="min-h-24 w-full rounded-xl border border-line p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="question-nickname" className="sr-only">
                  ニックネーム（任意）
                </label>
                <input
                  id="question-nickname"
                  type="text"
                  value={formNickname}
                  onChange={(e) => setFormNickname(e.target.value)}
                  maxLength={20}
                  placeholder="ニックネーム（任意）"
                  className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-cta px-6 py-2 text-sm font-bold text-white hover:bg-cta-dark disabled:opacity-60"
                >
                  {submitting ? "投稿中..." : "質問を投稿する"}
                </button>
                {submitMessage && (
                  <span className="text-sm text-muted">{submitMessage}</span>
                )}
              </div>
            </form>
          </div>

          <div className="mb-5 flex flex-wrap justify-center gap-2">
            {["すべて", ...qaCategories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3.5 py-2 text-sm font-bold focus-visible:ring-2 focus-visible:ring-accent ${
                  activeCategory === cat
                    ? "bg-navy text-white"
                    : "bg-white text-muted border border-line"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loadError && (
            <p className="mb-4 text-center text-sm text-[#c0392b]">{loadError}</p>
          )}

          {filtered === null && !loadError && (
            <p className="text-center text-sm text-muted">読み込み中...</p>
          )}

          {filtered !== null && filtered.length === 0 && (
            <p className="text-center text-sm text-muted">
              まだ質問がありません。最初の質問を投稿してみませんか？
            </p>
          )}

          <div className="flex flex-col gap-3">
            {filtered?.map((q) => (
              <Link
                key={q.id}
                href={`/community/${q.id}`}
                className="rounded-2xl border border-line bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[13px] font-bold text-navy">
                    {q.category}
                  </span>
                  <span className="shrink-0 rounded-lg bg-background px-2.5 py-1 text-[13px] font-bold text-navy">
                    回答 {q.answers?.[0]?.count ?? 0}
                  </span>
                </div>
                <h3 className="my-1.5 text-sm font-bold">{q.question}</h3>
                <div className="text-[13px] text-muted">
                  {q.nickname || "名無しの先生"}・{formatDate(q.created_at)}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
