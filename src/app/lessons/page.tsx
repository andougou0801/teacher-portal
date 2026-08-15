import type { Metadata } from "next";
import ComingSoonSection from "@/components/ComingSoonSection";

export const metadata: Metadata = {
  title: "授業・教材アイデア | 全国教員支援ポータル（仮称）",
  description: "「明日の授業に使える」教科別・場面別のアイデア集（準備中）。",
};

const topics = [
  "国語", "算数", "理科", "社会", "体育", "音楽", "図工", "道徳", "総合",
  "学級活動", "授業開き", "授業終わり", "5分でできる活動", "アイスブレイク",
];

export default function LessonsPage() {
  return (
    <ComingSoonSection
      eyebrow="Lessons"
      title="📚 授業・教材アイデア"
      description="「明日の授業に使える」を合言葉に、教科別・場面別のアイデアを紹介していく予定です。"
      topics={topics}
    />
  );
}
