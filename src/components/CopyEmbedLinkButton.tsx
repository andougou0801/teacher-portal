"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function CopyEmbedLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  function getUrl() {
    return `${window.location.origin}/embed/tools/${slug}`;
  }

  async function handleCopy() {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("このURLをコピーしてください", url);
    }
  }

  async function handleToggleQr() {
    if (!qrDataUrl) {
      const dataUrl = await QRCode.toDataURL(getUrl(), { width: 220, margin: 1 });
      setQrDataUrl(dataUrl);
    }
    setShowQr((prev) => !prev);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-navy hover:bg-background focus-visible:ring-2 focus-visible:ring-accent"
        >
          {copied ? "コピーしました ✓" : "🔗 児童・先生に配るURLをコピー"}
        </button>
        <button
          type="button"
          onClick={handleToggleQr}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-navy hover:bg-background focus-visible:ring-2 focus-visible:ring-accent"
        >
          {showQr ? "QRコードを閉じる" : "📱 QRコードを表示"}
        </button>
      </div>
      {showQr && qrDataUrl && (
        <div className="mt-3 inline-block rounded-2xl border border-line bg-white p-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- 端末内で生成したdata URLのため next/image は不要 */}
          <img src={qrDataUrl} alt="このツールを開くQRコード" width={220} height={220} />
          <p className="mt-2 text-sm text-muted">
            タブレット・スマホのカメラで読み取ると、そのままツールが開きます。
          </p>
        </div>
      )}
    </div>
  );
}
