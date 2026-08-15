export type AiGuide = {
  slug: string;
  title: string;
  tool: string;
  summary: string;
  whatItDoes: string;
  howToUse: string[];
  samplePrompt: string;
  caution: string;
};

export const aiGuides: AiGuide[] = [
  {
    slug: "lesson-plan-drafting",
    title: "授業案づくりの「たたき台」をAIに手伝ってもらう",
    tool: "ChatGPT / Claude",
    summary:
      "ゼロから授業案を考える時間を減らすため、AIに構成案のたたき台を出してもらう使い方を紹介します。",
    whatItDoes:
      "学年・教科・単元を伝えると、授業の流れ（導入・展開・まとめ）の案をいくつか提示してくれます。あくまで「たたき台」なので、実際のクラスの実態に合わせて先生が調整することが前提です。",
    howToUse: [
      "学年・教科・単元名・授業時間（何分か）をまず伝える",
      "出てきた案の中から「導入だけ詳しく」「展開部分を3パターン出して」のように、部分的に深掘りして絞り込んでいく",
      "最終的にはクラスの実態（人数、理解度、時間配分）に合わせて自分で手直しする",
    ],
    samplePrompt:
      "小学4年生の算数、「わり算の筆算」の単元です。45分授業の指導案の骨子（導入・展開・まとめ）を3パターン考えてください。導入は5分程度で、子どもが興味を持てる導入にしてください。",
    caution:
      "AIが出す案はあくまで一般的な内容です。学習指導要領や学校独自のカリキュラムと照らし合わせ、最終判断は必ず先生自身が行ってください。",
  },
  {
    slug: "report-card-comment-drafting",
    title: "所見・通知表コメントの下書きにAIを使う",
    tool: "ChatGPT / Claude",
    summary:
      "毎学期時間がかかる所見の下書きを、キーワードから文章化する形でAIに手伝ってもらう使い方です。",
    whatItDoes:
      "「頑張っていたこと」「今後の課題」などのキーワードを箇条書きで伝えると、通知表・所見に使える文章の形に整えてくれます。文章を1から書く手間を減らせます。",
    howToUse: [
      "その子について伝えたいポイントを箇条書きでメモする（例：係活動に積極的、漢字の読みが苦手、友達に優しい）",
      "文字数の目安（例：150字程度）を指定して文章化してもらう",
      "出てきた文章をそのまま使わず、その子らしい表現に必ず手直しする",
    ],
    samplePrompt:
      "以下のキーワードを、小学校の通知表の所見欄に使える文章に整えてください。150字程度、前向きな表現でお願いします。キーワード：係活動に積極的、漢字の読みが苦手、友達に優しく声をかけられる",
    caution:
      "児童生徒の氏名や、特定できる詳しい個人情報は入力しないでください。キーワードだけを伝え、文章が完成したあとに手元で名前を当てはめる使い方が安全です。",
  },
];

export function getAiGuideBySlug(slug: string): AiGuide | undefined {
  return aiGuides.find((guide) => guide.slug === slug);
}
