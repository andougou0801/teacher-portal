"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseClient } from "@/lib/supabaseClient";

type QuestionRow = {
  id: string;
  category: string;
  nickname: string | null;
  question: string;
  created_at: string;
  hidden: boolean;
};

type AnswerRow = {
  id: string;
  question_id: string;
  nickname: string | null;
  answer: string;
  created_at: string;
  hidden: boolean;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ja-JP");
}

export default function AdminQaPage() {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [reportCounts, setReportCounts] = useState<Record<string, number>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = useMemo(() => getSupabaseClient(), []);

  const load = useCallback(async () => {
    if (!supabase) return;
    const [questionResult, answerResult] = await Promise.all([
      supabase
        .from("questions")
        .select("id,category,nickname,question,created_at,hidden")
        .order("created_at", { ascending: false }),
      supabase
        .from("answers")
        .select("id,question_id,nickname,answer,created_at,hidden")
        .order("created_at", { ascending: true }),
    ]);

    if (questionResult.error || answerResult.error) {
      setMessage("読み込みに失敗しました。時間をおいて開き直してください。");
      setLoading(false);
      return;
    }
    setQuestions((questionResult.data ?? []) as QuestionRow[]);
    setAnswers((answerResult.data ?? []) as AnswerRow[]);

    // 通報件数（reportsテーブルが無い場合もあるため、失敗しても続行する）
    const { data: reports } = await supabase
      .from("reports")
      .select("question_id,answer_id");
    if (reports) {
      const counts: Record<string, number> = {};
      for (const row of reports as {
        question_id: string | null;
        answer_id: string | null;
      }[]) {
        const key = row.question_id ?? row.answer_id;
        if (key) counts[key] = (counts[key] ?? 0) + 1;
      }
      setReportCounts(counts);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, [load]);

  async function toggleHidden(
    table: "questions" | "answers",
    id: string,
    nextHidden: boolean,
  ) {
    if (!supabase) return;
    const { error } = await supabase
      .from(table)
      .update({ hidden: nextHidden })
      .eq("id", id);
    if (error) {
      setMessage(`変更できませんでした：${error.message}`);
      return;
    }
    setMessage(nextHidden ? "非表示にしました。" : "再表示しました。");
    load();
  }

  async function remove(table: "questions" | "answers", id: string) {
    if (!supabase) return;
    const label =
      table === "questions"
        ? "この質問と、ぶら下がっている回答をすべて削除します。"
        : "この回答を削除します。";
    if (!window.confirm(`${label}\n元に戻せません。よろしいですか？`)) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      setMessage(`削除できませんでした：${error.message}`);
      return;
    }
    setMessage("削除しました。");
    load();
  }

  const buttonClass =
    "rounded-full border border-line bg-white px-3 py-1 text-[13px] font-bold hover:bg-background";

  return (
    <AdminShell title="Q&Aの管理">
      <p className="mb-4 text-sm text-muted">
        「非表示」にすると、投稿は残したままサイトから見えなくなります（あとで元に戻せます）。
        「削除」は元に戻せません。
      </p>

      {message && (
        <p className="mb-4 rounded-xl bg-warn-bg px-4 py-2.5 text-sm text-warn">
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted">読み込み中です…</p>
      ) : questions.length === 0 ? (
        <p className="text-sm text-muted">まだ投稿がありません。</p>
      ) : (
        <div className="flex flex-col gap-2">
          {questions.map((question) => {
            const relatedAnswers = answers.filter(
              (answer) => answer.question_id === question.id,
            );
            const reports = reportCounts[question.id] ?? 0;
            const open = openId === question.id;

            return (
              <div
                key={question.id}
                className={`rounded-2xl border bg-white p-4 ${
                  question.hidden ? "border-warn-line bg-warn-bg" : "border-line"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 text-[13px]">
                  <span className="rounded-full bg-[#EAF2FA] px-2 py-0.5 font-bold text-navy">
                    {question.category}
                  </span>
                  <span className="text-muted">
                    {question.nickname || "匿名"}・{formatDate(question.created_at)}
                  </span>
                  {reports > 0 && (
                    <span className="rounded-full bg-warn-bg px-2 py-0.5 font-bold text-warn">
                      通報 {reports}件
                    </span>
                  )}
                  {question.hidden && (
                    <span className="rounded-full bg-cta px-2 py-0.5 font-bold text-white">
                      非表示中
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm">{question.question}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      toggleHidden("questions", question.id, !question.hidden)
                    }
                    className={`${buttonClass} text-navy`}
                  >
                    {question.hidden ? "再表示する" : "非表示にする"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove("questions", question.id)}
                    className={`${buttonClass} text-cta`}
                  >
                    削除
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : question.id)}
                    className={`${buttonClass} text-accent`}
                  >
                    回答 {relatedAnswers.length}件を{open ? "閉じる" : "見る"}
                  </button>
                </div>

                {open && relatedAnswers.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
                    {relatedAnswers.map((answer) => (
                      <div
                        key={answer.id}
                        className={`rounded-xl p-3 ${
                          answer.hidden ? "bg-warn-bg" : "bg-background"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
                          {answer.nickname || "匿名"}・{formatDate(answer.created_at)}
                          {(reportCounts[answer.id] ?? 0) > 0 && (
                            <span className="font-bold text-warn">
                              通報 {reportCounts[answer.id]}件
                            </span>
                          )}
                          {answer.hidden && (
                            <span className="font-bold text-cta">非表示中</span>
                          )}
                        </div>
                        <p className="mt-1 text-sm">{answer.answer}</p>
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              toggleHidden("answers", answer.id, !answer.hidden)
                            }
                            className={`${buttonClass} text-navy`}
                          >
                            {answer.hidden ? "再表示する" : "非表示にする"}
                          </button>
                          <button
                            type="button"
                            onClick={() => remove("answers", answer.id)}
                            className={`${buttonClass} text-cta`}
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
