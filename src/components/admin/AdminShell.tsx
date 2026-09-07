"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";

type Status = "loading" | "signed-out" | "signed-in";

/**
 * 管理画面の共通枠。ログインしていない間は中身（children）を表示しない。
 * 実際の権限チェックはSupabase側のRLSで行っているため、この画面はあくまで入口。
 */
export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<Status>(
    isSupabaseConfigured ? "loading" : "signed-out",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? "signed-in" : "signed-out");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? "signed-in" : "signed-out");
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignIn = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const supabase = getSupabaseClient();
      if (!supabase) return;
      setSubmitting(true);
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError("メールアドレスかパスワードが正しくないようです。");
      }
      setPassword("");
      setSubmitting(false);
    },
    [email, password],
  );

  const handleSignOut = useCallback(async () => {
    const supabase = getSupabaseClient();
    await supabase?.auth.signOut();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-sm text-muted">
          データベースの接続設定がされていないため、管理画面は利用できません。
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center text-sm text-muted">
        読み込み中です…
      </div>
    );
  }

  if (status === "signed-out") {
    return (
      <div className="mx-auto max-w-sm px-6 py-16">
        <h1 className="mb-1 text-center text-xl font-bold">管理画面</h1>
        <p className="mb-6 text-center text-sm text-muted">
          サイトの記事・ツール・Q&Aを管理します。
        </p>
        <form
          onSubmit={handleSignIn}
          className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5"
        >
          <label className="text-sm font-bold" htmlFor="admin-email">
            メールアドレス
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-line px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          />
          <label className="text-sm font-bold" htmlFor="admin-password">
            パスワード
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-line px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          />
          {error && <p className="text-sm font-bold text-cta">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-full bg-cta px-6 py-2.5 text-sm font-bold text-white hover:bg-cta-dark disabled:opacity-60"
          >
            {submitting ? "確認中…" : "ログイン"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          <Link href="/" className="font-bold text-accent hover:underline">
            ← サイトにもどる
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/admin" className="font-bold text-accent hover:underline">
            管理メニュー
          </Link>
          <Link href="/" className="font-bold text-accent hover:underline">
            サイト
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-line bg-white px-3 py-1 font-bold text-navy hover:bg-background"
          >
            ログアウト
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
