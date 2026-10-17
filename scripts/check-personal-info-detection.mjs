// Q&A掲示板の「送信前の個人情報チェック」が、ちゃんと働くか確かめるテスト。
//
// 実行のしかた（teacher-portal フォルダで）:
//   node --experimental-strip-types scripts/check-personal-info-detection.mjs
//
// 「警告が出てはいけない文章」で警告が出ていないか（＝誤検知）を特に重視している。
// 誤検知が増えると、先生が警告を読み飛ばすようになり、仕組み全体が意味をなくすため。
// 判定を変えたときは、必ずこれを実行して 0件 になることを確かめること。

const mod = await import(
  new URL("../src/lib/personalInfoCheck.ts", import.meta.url).href
);
const { findPersonalInfoRisks } = mod;

// [文章, 警告が出るべきか]
const cases = [
  // --- 警告が出てはいけない（誤検知のテスト） ---
  ["来年度、小学校から中学校へ異動することになりました。", false],
  ["新しい小学校に赴任しました。", false],
  ["大きい小学校と規模の小さい小学校で違いますか。", false],
  ["ある小学校では、とある小学校の実践を参考にしています。", false],
  ["元小学校の教員です。毎年小学校の行事で困っています。", false],
  ["担任をしている小学校で、勤務する小学校の方針が変わりました。", false],
  ["子どもが通う小学校と、私が通った小学校は別です。", false],
  ["卒業した小学校に戻りました。", false],
  ["通級指導教室のある小学校です。", false],
  ["小学校から高校まで一貫しています。", false],
  ["子どもが通う保育園、預けている保育園の話です。", false],
  ["県立高校、市立小学校、区立小学校、夜間中学校の違い。", false],
  ["うちの小学校では全国の小学校と同じようにしています。", false],
  ["公立小学校での工夫を教えてください。", false],
  ["いじめ相談の0120-0-78310を子どもに伝えました。", false],
  ["運動会は05-10-2025の予定です。", false],
  ["6年生を送る会の準備をしています。", false],
  ["3年生の算数でつまずく子が多いです。", false],

  // --- 警告が出るべき（見逃しのテスト） ---
  ["桜ヶ丘小学校の者です。", true],
  ["佐々木小学校に勤めています。", true],
  ["山本小学校の研究発表を見ました。", true],
  ["橋本小学校ではどうしていますか。", true],
  ["緑小学校の取り組みについて。", true],
  ["3年2組の子のことで相談です。", true],
  ["3年A組の保護者対応で悩んでいます。", true],
  ["3年生2組を担任しています。", true],
  ["第3学年2組の件です。", true],
  ["連絡先は090-1234-5678です。", true],
  ["電話は090 1234 5678にください。", true],
  ["０９０-１２３４-５６７８までお願いします。", true],
  ["メールはtaro@example.comです。", true],
  ["メールはtaro＠example.comです。", true],
];

let ng = 0;
for (const [text, shouldWarn] of cases) {
  const risks = findPersonalInfoRisks(text);
  const warned = risks.length > 0;
  const ok = warned === shouldWarn;
  if (!ok) ng++;
  const mark = ok ? "  OK " : "**NG**";
  const detail = risks.map((r) => `${r.label}:「${r.found}」`).join(" / ");
  console.log(`${mark} [期待:${shouldWarn ? "警告" : "警告なし"}] ${text}`);
  if (detail) console.log(`        → ${detail}`);
}
console.log(`\n=== ${cases.length}件中 ${ng}件 期待と違う ===`);
