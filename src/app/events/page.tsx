import type { Metadata } from "next";
import ComingSoonSection from "@/components/ComingSoonSection";

export const metadata: Metadata = {
  title: "学校行事・年間行事 | 全国教員支援ポータル（仮称）",
  description: "時期ごとに必要な情報を探せる、年間行事の準備ガイド（準備中）。",
};

const topics = [
  "4月：学級開き・始業式・入学式",
  "5〜6月：授業参観・遠足・運動会",
  "7〜8月：夏休み・個人懇談・夏休みの宿題",
  "9〜12月：運動会・学習発表会・修学旅行・冬休み",
  "1〜3月：卒業・6年生を送る会・年度末・学級じまい",
];

export default function EventsPage() {
  return (
    <ComingSoonSection
      eyebrow="Events"
      title="📅 学校行事・年間行事"
      description="時期ごとに必要な情報を探せるページを目指しています。"
      topics={topics}
    />
  );
}
