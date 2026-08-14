export type Tool = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  file: string;
};

export const tools: Tool[] = [
  {
    slug: "timetable-maker",
    name: "時間割自動作成ツール",
    description:
      "条件を入れるだけで学級・教科の時間割案を作成できます。担任の時間割づくりの負担を軽減します。",
    icon: "🗓",
    tags: ["時間割", "無料"],
    file: "/tools/timetable-maker.html",
  },
  {
    slug: "written-calc-master",
    name: "筆算マスター",
    description:
      "筆算（たし算・ひき算・かけ算・わり算）の練習プリントをその場で生成し、繰り返し練習できます。",
    icon: "✏️",
    tags: ["算数", "無料"],
    file: "/tools/written-calc-master.html",
  },
  {
    slug: "math-worksheet-maker",
    name: "算数プリントメーカー",
    description:
      "単元や難易度を選ぶだけで、算数の練習プリントを自動生成。授業準備の時間を大幅に短縮します。",
    icon: "🖨",
    tags: ["授業支援", "無料"],
    file: "/tools/math-worksheet-maker.html",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
