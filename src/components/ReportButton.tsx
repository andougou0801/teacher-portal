"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

const REASONS = ["不適切な内容", "スパム・広告", "個人情報が含まれる", "その他"];

type Props = {
  questionId?: string;
  answerId?: string;
};

export default function ReportButton({ questionId, answerId }: Props) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleReport(reason: string) {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setSubmitting(true);
    await supabase.from("reports").insert({
      question_id: questionId ?? null,
      answer_id: answerId ?? null,
      reason,
    });
    setSubmitting(false);
    setDone(true);
    setOpen(false);
  }

  if (done) {
    return <span className="text-[13px] text-muted">通報しました。ご協力ありがとうございます。</span>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[13px] text-muted hover:text-warn focus-visible:ring-2 focus-visible:ring-accent"
      >
        🚩 通報する
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[13px] text-muted">理由：</span>
      {REASONS.map((reason) => (
        <button
          key={reason}
          type="button"
          disabled={submitting}
          onClick={() => handleReport(reason)}
          className="rounded-full border border-line bg-white px-2.5 py-1 text-[13px] text-muted hover:border-warn hover:text-warn disabled:opacity-60"
        >
          {reason}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-[13px] text-muted underline"
      >
        キャンセル
      </button>
    </div>
  );
}
