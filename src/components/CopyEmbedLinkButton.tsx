"use client";

import { useState } from "react";

export default function CopyEmbedLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/embed/tools/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("このURLをコピーしてください", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-navy hover:bg-background focus-visible:ring-2 focus-visible:ring-accent"
    >
      {copied ? "コピーしました ✓" : "🔗 児童・先生に配るURLをコピー"}
    </button>
  );
}
