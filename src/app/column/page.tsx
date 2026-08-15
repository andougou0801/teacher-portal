import type { Metadata } from "next";
import ComingSoonSection from "@/components/ComingSoonSection";

export const metadata: Metadata = {
  title: "先生のコラム | 全国教員支援ポータル（仮称）",
  description: "サイト運営者の視点で教育について発信するコラムページ（準備中）。",
};

const topics = [
  "学級経営", "授業", "子どもとの関わり", "教員生活", "若手教員向けアドバイス",
  "教育について考えたこと", "実際の授業実践", "教員の働き方", "ICT・AI教育",
];

export default function ColumnPage() {
  return (
    <ComingSoonSection
      eyebrow="Column"
      title="✏️ 先生のコラム"
      description="サイト運営者の視点で、教育について発信していく予定です（執筆者名は準備中です）。"
      topics={topics}
    />
  );
}
