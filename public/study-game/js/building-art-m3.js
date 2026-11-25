// 1年3学期（算数）の たてもの 6棟。
// 100×100 の ます目で 描く。色は わりあて先から わたされる。
// ★ぜんぶ ちがう かたちに する。おなじ形が ならぶと
//   「どれを 建てたのか」が 子どもに わからなくなる。
//
// ★既存の24棟と ここが ちがう（かぶらせない ための めも）
//   spire    … ほそい 1本の はしらに だんが10こ。
//              uptower（大きい3だん）/ lighthouse（すぼまる＋帯3本）/
//              clocktower（とけいの ばん）とは、だんの かず と 太さで 見分く。
//   abacus   … やねが かたむいた 1まいの いた（かたやね）。
//              granary / pencilshop の さんかくやねとも、shop / post の
//              よこ長の ひさしとも ちがう。かべに たまの さおが 2だん。
//   easel    … 3本あしの 台。たてものに あしの ある ものは ほかに ない。
//   pathway  … おくへ すぼまる いしだたみ。えんきんの みちは ほかに ない。
//   workshop … やねが 4まいの いろいたに わかれた 大きな さんかく。
//              factory の ぎざぎざやねとも house の 1色やねとも ちがう。
//   archgate … まるい アーチの もん。gate / downgate は まっすぐな
//              よこ木、こちらは 半円。
const INK = "#2B2A28";
const CREAM = "#F4EADA";

export const BUILDING_ART_M3 = {
  // u17 ひゃくのとう：120までのかず（10の だんが 10こ つみあがる）
  spire: (color) =>
    `<rect x="20" y="88" width="60" height="7" rx="3" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="28" y="82" width="44" height="6" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="29" y="76" width="42" height="6" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="30" y="70" width="40" height="6" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="31" y="64" width="38" height="6" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="32" y="58" width="36" height="6" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="33" y="52" width="34" height="6" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="34" y="46" width="32" height="6" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="35" y="40" width="30" height="6" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="36" y="34" width="28" height="6" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="37" y="28" width="26" height="6" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M37 28 50 13l13 15z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    `<circle cx="50" cy="8" r="5" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="45" y="74" width="10" height="14" rx="3" fill="${color}" stroke="${INK}" stroke-width="3"/>`,

  // u18 けたのこや：100までの たしざん ひきざん（たまの さおが 2だん）
  abacus: (color) =>
    `<rect x="18" y="46" width="64" height="44" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M10 46 22 32h68L78 46z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    `<rect x="24" y="57" width="52" height="3" rx="1.5" fill="${INK}"/>` +
    `<circle cx="30" cy="58.5" r="4.2" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="39" cy="58.5" r="4.2" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="48" cy="58.5" r="4.2" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="57" cy="58.5" r="4.2" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="71" cy="58.5" r="4.2" fill="#FFE08A" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="24" y="69" width="52" height="3" rx="1.5" fill="${INK}"/>` +
    `<circle cx="30" cy="70.5" r="4.2" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="39" cy="70.5" r="4.2" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="48" cy="70.5" r="4.2" fill="#FFE08A" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="71" cy="70.5" r="4.2" fill="#FFE08A" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="42" y="80" width="16" height="10" fill="${color}" stroke="${INK}" stroke-width="3"/>`,

  // u19 ずのひろば：ずをつかってかんがえよう（テープ図が かかった 台）
  easel: (color) =>
    `<path d="M28 90 36 44M72 90 64 44" fill="none" stroke="#C98A4B" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M50 90V60" fill="none" stroke="#A9743C" stroke-width="5" stroke-linecap="round"/>` +
    `<rect x="20" y="30" width="60" height="36" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="26" y="40" width="48" height="14" rx="2" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M42 40v14M58 40v14" fill="none" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M26 59h22M52 59h22" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>` +
    `<rect x="16" y="66" width="68" height="7" rx="3" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="22" cy="82" r="8" fill="#FFE08A" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="22" cy="82" r="2.6" fill="${CREAM}" stroke="${INK}" stroke-width="2"/>`,

  // u20 ならびのこみち：ものとひとのかず（門と おくへ つづく いしだたみ）
  pathway: (color) =>
    `<path d="M18 90h64L62 50H38z" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M22 82h56M26 74h48M30 66h40M34 58h32" fill="none" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M50 82v8M50 66v8" fill="none" stroke="${INK}" stroke-width="2"/>` +
    `<rect x="10" y="44" width="11" height="46" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="79" y="44" width="11" height="46" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="6" y="34" width="88" height="11" rx="4" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="15.5" cy="27" r="6" fill="#FFE08A" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="84.5" cy="27" r="6" fill="#FFE08A" stroke="${INK}" stroke-width="2.5"/>`,

  // u21 いたのこうぼう：かたちづくり（やねが 4まいの いろいた）
  workshop: (color) =>
    `<path d="M50 22 32 52h36z" fill="${color}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<path d="M32 52 14 82h36z" fill="#FFE08A" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<path d="M68 52 50 82h36z" fill="#7FD4E8" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<path d="M32 52h36L50 82z" fill="#9BD98C" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<path d="M50 22 14 82h72z" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    `<rect x="26" y="82" width="48" height="10" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="44" y="82" width="12" height="10" fill="${color}" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M6 92h14L13 80z" fill="#FFE08A" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,

  // u22 おもいでのもん：1ねんのまとめ（大きな アーチと かざり）
  archgate: (color) =>
    `<path d="M30 84V56a20 20 0 0 1 40 0v28z" fill="#BFE3FB" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M14 84V56a36 36 0 0 1 72 0v28H70V56a20 20 0 0 0-40 0v28z" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M14 68h16M70 68h16M22 56h8M70 56h8" fill="none" stroke="${INK}" stroke-width="2"/>` +
    `<rect x="8" y="84" width="84" height="8" rx="3" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="50" cy="11" r="6.5" fill="#FFE08A" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="34" cy="20" r="4.5" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="66" cy="20" r="4.5" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>`,
};
