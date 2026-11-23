// 1年2学期（算数）の たてもの 8棟。
// 100×100 の ます目で 描く。色は わりあて先から わたされる。
// ★ぜんぶ ちがう かたちに する。おなじ形が ならぶと
//   「どれを 建てたのか」が 子どもに わからなくなる。
const INK = "#2B2A28";
const CREAM = "#F4EADA";

export const BUILDING_ART_M2 = {
  // u09 みっつばし：3つの かずの けいさん（アーチが3つ）
  bridge: (color) =>
    `<path d="M6 76h88v10H6z" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M10 76V58h80v18" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M20 76a9 9 0 0 1 18 0z" fill="#BFE3FB" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M41 76a9 9 0 0 1 18 0z" fill="#BFE3FB" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M62 76a9 9 0 0 1 18 0z" fill="#BFE3FB" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M10 58h80" fill="none" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M16 58V44M50 58V38M84 58V44" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M14 44h72" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,

  // u10 みずのいえ：かさくらべ（水のタンクと ひしゃく）
  waterhouse: (color) =>
    `<rect x="18" y="46" width="64" height="44" rx="6" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M14 46 50 24l36 22z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    `<rect x="28" y="58" width="24" height="24" rx="3" fill="#7FD4E8" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M28 70h24" fill="none" stroke="#FFFFFF" stroke-width="3"/>` +
    `<rect x="60" y="62" width="14" height="20" rx="3" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M50 24V14" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="50" cy="11" r="5" fill="#7FD4E8" stroke="${INK}" stroke-width="2.5"/>`,

  // u11 のぼりのとう：くりあがり（上へ のぼる だんだん）
  uptower: (color) =>
    `<rect x="16" y="74" width="68" height="16" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="26" y="58" width="48" height="18" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="36" y="42" width="28" height="18" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M32 42 50 26l18 16z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    `<rect x="44" y="78" width="12" height="12" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="44" y="62" width="12" height="10" fill="#BFE3FB" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M50 26V16l12 4-12 5" fill="${color}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<path d="M74 70l8-8M64 54l8-8" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`,

  // u12 かたちの ひろば：はこ・つつ・ボールが ならぶ 広場
  plaza: (color) =>
    `<ellipse cx="50" cy="80" rx="42" ry="12" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="18" y="52" width="22" height="22" fill="#7FD4E8" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M18 52 25 45h22l-7 7z" fill="#B7E6F4" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<rect x="46" y="54" width="18" height="20" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<ellipse cx="55" cy="54" rx="9" ry="4" fill="#FFE08A" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="78" cy="64" r="11" fill="#E4564B" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M50 34v-8" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M38 34h24l-12-12z" fill="#5BBF6A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,

  // u13 くだりのもん：くりさがり（下へ おりる だんだんの もん）
  downgate: (color) =>
    `<rect x="12" y="34" width="14" height="56" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="74" y="34" width="14" height="56" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="8" y="26" width="84" height="12" rx="4" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M26 56h16v34H26z" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M42 68h16v22H42z" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M58 78h16v12H58z" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M50 14v10" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M50 24l-7-8h14z" fill="${color}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,

  // u14 とおのくら：10の まとまり（たばが ならぶ くら）
  granary: (color) =>
    `<rect x="14" y="48" width="72" height="42" rx="4" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M10 48 50 24l40 24z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    `<rect x="22" y="58" width="10" height="26" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="36" y="58" width="10" height="26" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="50" y="58" width="10" height="26" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="64" y="58" width="10" height="26" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M20 70h56" fill="none" stroke="${INK}" stroke-width="2"/>` +
    `<rect x="42" y="30" width="16" height="12" rx="3" fill="#BFE3FB" stroke="${INK}" stroke-width="2.5"/>`,

  // u15 とけいだい：なんじ なんじはん
  clocktower: (color) =>
    `<rect x="32" y="40" width="36" height="50" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M26 40 50 20l24 20z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    `<circle cx="50" cy="56" r="13" fill="#FFFDF6" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M50 56V48" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M50 56h7" fill="none" stroke="#E4564B" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="50" cy="56" r="2" fill="${INK}"/>` +
    `<rect x="43" y="74" width="14" height="16" rx="3" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="22" y="84" width="56" height="6" rx="3" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M50 20v-8" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,

  // u16 みちしるべ：まえ・うしろ／みぎ・ひだり
  signpost: (color) =>
    `<rect x="46" y="26" width="9" height="62" fill="#C98A4B" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M55 34h30l8 7-8 7H55z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    `<path d="M46 52H16l-8 7 8 7h30z" fill="#FFE08A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    `<path d="M55 68h22l7 6-7 6H55z" fill="#7FD4E8" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    `<ellipse cx="50" cy="90" rx="22" ry="7" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="50" cy="22" r="6" fill="${color}" stroke="${INK}" stroke-width="3"/>`,
};
