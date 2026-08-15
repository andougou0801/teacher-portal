import type { Metadata } from "next";
import ComingSoonSection from "@/components/ComingSoonSection";

export const metadata: Metadata = {
  title: "先生の「困った！」Q&A | 全国教員支援ポータル（仮称）",
  description: "教員が検索しそうな悩みをQ&A形式でまとめたページ（準備中）。",
};

const topics = [
  "授業中に子どもが話を聞かない", "クラスがざわざわする", "宿題をやってこない",
  "子ども同士のトラブルが起きた", "保護者に電話するとき何を話せばいい？",
  "個人懇談で何を話せばいい？", "初任者だけど何を準備すればいい？",
  "学級開きで何をすればいい？",
];

export default function QaPage() {
  return (
    <ComingSoonSection
      eyebrow="Q&A"
      title="❓ 先生の「困った！」Q&A"
      description="教員が検索しそうな悩みを、Q&A形式でまとめていく予定です。「困っていること」から探せるようにします。"
      topics={topics}
    />
  );
}
