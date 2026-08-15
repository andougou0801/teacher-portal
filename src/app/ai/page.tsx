import type { Metadata } from "next";
import ComingSoonSection from "@/components/ComingSoonSection";

export const metadata: Metadata = {
  title: "先生のAI活用 | 全国教員支援ポータル（仮称）",
  description: "生成AIを授業準備や校務に活かすための入門ガイド（準備中）。",
};

const topics = [
  "ChatGPTの教育活用", "Claudeの教育活用", "Claude Code", "Canva",
  "AIによる教材作成", "AIによる授業案作成", "AIによるアイデア出し",
  "AIを使った学級経営", "生成AI利用時の注意点", "教育現場でのAI活用事例",
];

export default function AiPage() {
  return (
    <ComingSoonSection
      eyebrow="AI for Teachers"
      title="🤖 先生のAI活用"
      description="「何ができる？」「どう使う？」「実際のプロンプト」まで、初心者にも分かる形で紹介していく予定です。"
      topics={topics}
    />
  );
}
