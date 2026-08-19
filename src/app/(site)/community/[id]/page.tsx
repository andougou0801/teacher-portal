"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";

type Question = {
  id: string;
  category: string;
  nickname: string | null;
  question: string;
  created_at: string;
};

type Answer = {
  id: string;
  nickname: string | null;
  answer: string;
  created_at: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formNickname, setFormNickname] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !id) return;
    const [{ data: q, error: qErr }, { data: a, error: aErr }] = await Promise.all([
      supabase.from("questions").select("id, category, nickname, question, created_at").eq("id", id).single(),
      supabase
        .from("answers")
        .select("id, nickname, answer, created_at")
        .eq("question_id", id)
        .order("created_at", { ascending: true }),
    ]);
    if (qErr || aErr) {
      setLoadError("読み込みに失敗しました。しばらくしてから再度お試しください。");
      return;
    }
    setQuestion(q as Question);
    setAnswers((a as Answer[]) ?? []);
  }, [id]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase || !id) return;
    const text = formAnswer.trim();
    if (!text) {
      setSubmitMessage("回答内容を入力してください。");
      return;
    }
    if (text.length > 1000) {
      setSubmitMessage("回答は1000字以内でお願いします。");
      return;
    }
    setSubmitting(true);
    setSubmitMessage(null);
    const { error } = await supabase.from("answers").insert({
      question_id: id,
      nickname: formNickname.trim() || null,
      answer: text,
    });
    setSubmitting(false);
    if (error) {
      setSubmitMessage("投稿に失敗しました。しばらくしてから再度お試しください。");
      return;
    }
    setFormAnswer("");
    setSubmitMessage("回答しました！");
    load();
  }

  if (!isSupabaseConfigured) {
    return (
      <section className="mx-auto max-w-2xl px-8 py-14 text-center text-sm text-muted">
        このコミュニティ機能は現在準備中です。
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-8 py-14">
      <Link href="/community" className="mb-6 inline-block text-sm font-bold text-accent">
        ← 質問一覧にもどる
      </Link>

      {loadError && (
        <p className="text-center text-sm text-[#c0392b]">{loadError}</p>
      )}

      {!question && !loadError && (
        <p className="text-center text-sm text-muted">読み込み中...</p>
      )}

      {question && (
        <>
          <div className="rounded-2xl border border-line bg-white p-5">
            <span className="rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[13px] font-bold text-navy">
              {question.category}
            </span>
            <h1 className="my-2 text-lg font-bold">{question.question}</h1>
            <div className="text-[13px] text-muted">
              {question.nickname || "名無しの先生"}・{formatDate(question.created_at)}
            </div>
          </div>

          <h2 className="mt-8 mb-3 text-sm font-bold text-navy">
            回答（{answers?.length ?? 0}件）
          </h2>
          <div className="flex flex-col gap-3">
            {answers?.map((a) => (
              <div key={a.id} className="rounded-2xl border border-line bg-white p-4">
                <p className="text-sm leading-loose whitespace-pre-wrap">{a.answer}</p>
                <div className="mt-2 text-[13px] text-muted">
                  {a.nickname || "名無しの先生"}・{formatDate(a.created_at)}
                </div>
              </div>
            ))}
            {answers && answers.length === 0 && (
              <p className="text-center text-sm text-muted">
                まだ回答がありません。最初の回答者になりませんか？
              </p>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-3 text-sm font-bold text-navy">回答する</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label htmlFor="answer-text" className="sr-only">
                回答内容
              </label>
              <textarea
                id="answer-text"
                value={formAnswer}
                onChange={(e) => setFormAnswer(e.target.value)}
                maxLength={1000}
                placeholder="回答を入力してください（1000字まで）"
                className="min-h-24 w-full rounded-xl border border-line p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="answer-nickname" className="sr-only">
                  ニックネーム（任意）
                </label>
                <input
                  id="answer-nickname"
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
                  {submitting ? "投稿中..." : "回答する"}
                </button>
                {submitMessage && (
                  <span className="text-sm text-muted">{submitMessage}</span>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </section>
  );
}
