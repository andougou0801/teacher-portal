import type { Metadata } from "next";
import ComingSoonSection from "@/components/ComingSoonSection";

export const metadata: Metadata = {
  title: "忙しい先生のためのページ | 全国教員支援ポータル（仮称）",
  description: "福利厚生・休暇・手当など、先生自身の生活を支える制度情報ページ（準備中）。",
};

const topics = [
  "福利厚生", "年休", "育児休業", "介護休暇", "手当", "共済", "住宅", "保険",
  "資産形成", "教員向け制度", "働き方", "メンタルヘルス", "退職・定年関連",
];

export default function LifePage() {
  return (
    <ComingSoonSection
      eyebrow="Teacher's Life"
      title="💼 忙しい先生のためのページ"
      description="「先生の仕事」だけでなく「先生自身の生活」を支える情報をまとめる予定です。制度は自治体により異なるため、公的機関へのリンクを中心に整備していきます。"
      topics={topics}
    />
  );
}
