import type { Metadata } from "next";
import ComingSoonSection from "@/components/ComingSoonSection";

export const metadata: Metadata = {
  title: "学級経営・子ども対応 | 全国教員支援ポータル（仮称）",
  description: "教員が日々困りやすい学級経営・子ども対応の場面別ページ（準備中）。",
};

const topics = [
  "学級開き", "学級目標", "班活動", "係活動", "掃除", "給食", "褒め方", "叱り方",
  "子ども同士のトラブル", "授業中の私語", "不登校・登校しぶり", "保護者対応", "個人懇談",
];

export default function ClassroomPage() {
  return (
    <ComingSoonSection
      eyebrow="Classroom"
      title="🏫 学級経営・子ども対応"
      description="教員が日々困りやすい場面から探せるページを目指しています。"
      topics={topics}
    />
  );
}
