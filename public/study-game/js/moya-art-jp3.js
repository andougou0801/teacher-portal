/* ============================================================
   ことばのまち ／ こくご 3学期の もやもや 6体
   ------------------------------------------------------------
   ・決まりは さんすう（moya-art.js）・こくご1学期（moya-art-jp.js）・
     さんすう2学期（moya-art-m2.js）・さんすう3学期（moya-art-m3.js）・
     こくご2学期（moya-art-jp2.js）と まったく 同じ。
     100×100、<path> <circle> <ellipse> <rect> だけ、輪郭 #2B2A28 の 2.5〜3、
     filter / mask / gradient / <g> は つかわない。ぜんぶ 自分で 考えた かたち。
     実在の キャラクターや 有名ゲームの てきには 似せていない。
     こわい顔には しない（目は まるく、口は まっすぐか にっこり。
     やられる役なので、かわいそうに 見える 顔にも しない）。

   ・【既存39体は こういう形】
       さんすう1学期12 … まんまる＋ぼんぼり／ひらたい楕円が たてに3つ／ふたこぶ／
         上がデコボコ4つ／右が まるく 欠けた丸＋目1つ／ドーナツ／よこ長カプセル／
         高さちがいの ぼう3本／かどの まるい さんかく／角丸四角＋ベル耳／
         コップ＋とって／よこ広たまご＋リボン
       こくご1学期8 … たて長たまご＋はねの尾／ふだ3枚＋ひも／大きい楕円＋小さい子分／
         つぶ3つの三つ葉／丸＋てんの尾＋かぎかっこ／3つの玉が よこに よりそう／
         ふきだし／かいだん3だん
       さんすう2学期5 … 玉3つを ぼうに 通した たて／しずく＋上むき矢／
         右へ かたむいた板／つぶ12この あつまり／右が とがった 矢じるし
       さんすう3学期6 … たて長角丸＋つぶ12こ／たて2本の はしら＋帯／よこ長の帯＋
         くぎり線／ちいさい体4つが 手つなぎ／ひしがた4まいの いろいた／
         いちばん 大きい まる（r=33）＋輪＋＋−○△＋よこ手2つ
       こくご2学期8 … かどが とがった10かくけい／たて長の ふで／ふねの どう＋ほ／
         四角い はんこ／2だんの もみの木／ななめの たまご＋かさねた手／
         ドーム＋レンズ／ひらいた 本

   ・【自分は こう変えた（かぶらせない ための めも）】
       machimoya    … 上の へりが まちの スカイライン（高さ ちがいの たてもの 5つ）に
                      なった 一枚の 体。いちばん 高い ところに とんがり屋根、
                      たてものの 上のほうに 十字の まどが 5つ。
                      じゅんばんもや（かいだん3だん・だんだん 上がる だけ）とは
                      ちがって 高さが 上下に いったり きたりし、まん中に ふかい
                      すきまが ある。たすもや（上が まるい デコボコ4つ）とは
                      「かどが 四角い」「まどが ある」で ひと目で ちがう。
       asobimoya    … まるい 体が 2つ、ななめに ずれて かさなる（ひょうたん形）。
                      かさなった ところに 白い 輪、右の はしにも 白い 輪＝
                      しりとりの くさりが つながって いく しるし。
                      のばしもや（大きい楕円＋はなれた 小さい丸）とは ちがい、
                      2つが くっついて いる。じょしもや・なかまもや（丸3つ）とは
                      かずが ちがう。
       tsunagimoya  … よこに 2つ、おなじ 大きさの 角丸ブロック。あいだを ふとい
                      ぼうで つなぎ、まん中に ふとい むすびめ（丸）が 出ている。
                      けたもや（たて長の はしら2本・帯は ほそい たて・目が
                      1つずつ）とは ちがい、こちらは ブロックが よこ長で
                      目は ぜんぶ 左に あり、つなぎめが まるく ふくらむ。
       kurabemoya   … 上に よこ長の てんびんの ぼう、まん中に さんかくの しちゅう、
                      ぼうの 両はしから 大きさ ちがいの 玉が 2つ ぶら下がる。
                      tsunagimoya が「よこに ならんで 線で つながる」のに対して、
                      こちらは「上から ぶら下がって つりあう」ので、
                      小さく しても 見分けられる。玉には 長い ふだと 短い ふだ。
       mukashimoya  … よこに ひらいた まきもの（四角い かみ）。左下と 右上の
                      はしが くるんと まいて、まん中が 白い 丸の うずに なる。
                      おなかに たてがきの 白い 行が 2本。
                      ずもや（よこ長の 帯＋くぎり線＋テープ図）とは ちがい、
                      はしに 丸い まきが 2つ 出て いる。
       sotsumoya    … まるくて 大きい（r=30）。★まとめもや（さんすう3学期・
                      r=33・きいろ・うすい輪・＋ − ○ △ が 四すみ・よこに 手2つ）と
                      ねらいが 同じなので、つぎの 4つで 見分けられるように した：
                        ①色が みず色（まとめもやは きいろ）
                        ②しるしが もじ（あ・ア・一・「」）で、
                          下に 一れつに ならぶ（まとめもやは 四すみに ちらばる）
                        ③うすい 輪を 入れない（まとめもやは 中に 輪が1つ）
                        ④よこの 手を つけない（まとめもやは 左右に 丸い 手）

   ・なかまの姿（friendSvg）の 見分けかたも 1学期・2学期と 同じ4点：
       ①もやのつぶで浮く → かげの上に あし2本で立つ
       ②白目＋黒目 → とじた にこにこ目
       ③口が まっすぐ → にっこり
       ④頭に はっぱの め ＋ ほお ＋ きらきら
   ============================================================ */

const INK = "#2B2A28";

/* ---------- 共通のパーツ（さんすう・こくご1学期・2学期と 同じもの） ---------- */

function eyesOpen(eyes) {
  return eyes
    .map(
      ([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" stroke="${INK}" stroke-width="2.5"/>` +
        `<circle cx="${x}" cy="${y}" r="${(r * 0.44).toFixed(1)}" fill="${INK}"/>`,
    )
    .join("");
}

function eyesClosed(eyes) {
  return eyes
    .map(
      ([x, y, r]) =>
        `<path d="M${x - r} ${y + 1}q${r} ${(-r * 1.7).toFixed(1)} ${r * 2} 0" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
    )
    .join("");
}

function mouthFlat([x, y]) {
  return `<path d="M${x - 8} ${y}h16" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
}

function mouthSmile([x, y]) {
  return `<path d="M${x - 8} ${y - 2}q8 9 16 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
}

function puffs(soft, drop = 0) {
  return (
    `<circle cx="27" cy="${86 + drop}" r="5" fill="${soft}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="50" cy="${92 + drop}" r="4" fill="${soft}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="73" cy="${85 + drop}" r="5.5" fill="${soft}" stroke="${INK}" stroke-width="2.5"/>`
  );
}

function ground(color, feet, y) {
  return (
    `<ellipse cx="50" cy="${y + 7}" rx="22" ry="4.5" fill="#E7DCC4"/>` +
    feet
      .map(
        (fx) =>
          `<ellipse cx="${fx}" cy="${y}" rx="9" ry="6" fill="${color}" stroke="${INK}" stroke-width="2.5"/>`,
      )
      .join("")
  );
}

function sprout(x, y) {
  return (
    `<path d="M${x} ${y}v-9" fill="none" stroke="#4E9B52" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M${x} ${y - 9}q10-8 15-2-6 8-15 2z" fill="#5BBF6A" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M${x} ${y - 4}q-9-6-13-1 5 6 13 1z" fill="#7ED18A" stroke="${INK}" stroke-width="2.5"/>`
  );
}

function cheeks(list) {
  return list
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.2" fill="#F0A6A0" opacity=".75"/>`)
    .join("");
}

function sparkle(x, y, s = 8) {
  const q = s * 0.28;
  const n = (v) => Number(v.toFixed(1));
  return (
    `<path d="M${n(x)} ${n(y - s)}L${n(x + q)} ${n(y - q)}L${n(x + s)} ${n(y)}` +
    `L${n(x + q)} ${n(y + q)}L${n(x)} ${n(y + s)}L${n(x - q)} ${n(y + q)}` +
    `L${n(x - s)} ${n(y)}L${n(x - q)} ${n(y - q)}Z" fill="#F2B23C" stroke="${INK}" stroke-width="1.8"/>`
  );
}

function sparkles() {
  return sparkle(14, 24, 8) + sparkle(87, 26, 6.5) + sparkle(84, 70, 5.5);
}

/* ---------- 小さい しるしを 作る てつだい ---------- */

/* 十字の さんが 入った 四角い まど（まちもやの たてもの） */
function windowMark(x, y, s) {
  const h = s / 2;
  return (
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="1.5" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M${x + h} ${y}v${s}M${x} ${y + h}h${s}" fill="none" stroke="${INK}" stroke-width="1.6"/>`
  );
}

/* くるんと まいた まきもの の はし（むかしもや） */
function scrollRoll(x, y, r, color) {
  return (
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="${x}" cy="${y}" r="${(r * 0.4).toFixed(1)}" fill="#FFF4E2" stroke="${INK}" stroke-width="2.2"/>` +
    `<path d="M${x} ${y - r + 2}q${r - 2} 1 ${r - 2} ${r - 3}" fill="none" stroke="${INK}" stroke-width="1.8"/>`
  );
}

/* ---------- 6体のパーツ表 ---------- */
/* topBefore … 体より先に描く／body … 体／mark … しるし／topAfter … 体より後に描く */

const PARTS = {
  /* j17 かんじを よむ（がっこうと まち）
     － 上の へりが まちの スカイライン。高さの ちがう たてものが 5つ ならび、
       いちばん 高い ところに とんがり屋根。まどは 十字の さんが 入った 四角 */
  machimoya: {
    color: "#6B8396",
    soft: "#C4D0D9",
    topBefore: `<path d="M57 21 67 10 77 21z" fill="#6B8396" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    body: `<path d="M10 84V44h18V30h18v22h12V20h18v20h14v44z" fill="#6B8396" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
    /* ★まどを まるくすると「目が いくつも ある」ように 見えたので、
       十字の さんが 入った 四角い まどに して、顔より ずっと 上に 置いた。 */
    mark:
      windowMark(14, 49, 10) +
      windowMark(32, 35, 11) +
      windowMark(62, 25, 11) +
      windowMark(62, 41, 11) +
      windowMark(79, 45, 9),
    eyes: [[40, 66, 5.5], [58, 66, 5.5]],
    mouth: [49, 77],
    cheek: [[27, 75], [71, 75]],
    sproutAt: [67, 10],
    feet: [34, 66],
    feetY: 90,
  },

  /* j18 ことばあそび
     － まるい 体が 2つ、ななめに ずれて かさなる。かさなった ところと
       右の はしに 白い 輪＝しりとりの くさりが つながって いく */
  asobimoya: {
    color: "#E8679B",
    soft: "#F7C0D5",
    topBefore: "",
    body:
      `<circle cx="34" cy="48" r="23" fill="#E8679B" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="68" cy="62" r="19" fill="#E8679B" stroke="${INK}" stroke-width="3"/>`,
    /* ★右の まるに 白い 点を 2つ 置いたら「もう1ぴき 顔が ある」ように
       見えたので、点は やめて 白い 輪に かえた。
       ★はじめは 矢じるしも 入れたが、口・輪・矢が 1本の ぐにゃぐにゃの
       線に 見えたので 矢は やめて、おなじ 大きさの 輪を ななめに 2つだけに
       した（くさりが 右へ つづいて いく＝しりとり）。顔も 上へ 上げた。 */
    mark:
      `<circle cx="50" cy="62" r="6" fill="none" stroke="#FFF4E2" stroke-width="3"/>` +
      `<circle cx="76" cy="70" r="5" fill="none" stroke="#FFF4E2" stroke-width="2.8"/>`,
    eyes: [[27, 40, 5.2], [41, 40, 5.2]],
    mouth: [34, 52],
    cheek: [[18, 49], [47, 47]],
    sproutAt: [34, 25],
    feet: [36, 62],
    feetY: 88,
  },

  /* j19 しゅごと じゅつご
     － よこに おなじ 大きさの 角丸ブロックが 2つ。あいだを ふとい ぼうで
       つなぎ、まん中に まるい むすびめ。左が「なにが」、右が「どうする」 */
  tsunagimoya: {
    color: "#4F5BA6",
    soft: "#BDC3E6",
    topBefore: `<rect x="34" y="42" width="32" height="13" rx="6.5" fill="#4F5BA6" stroke="${INK}" stroke-width="3"/>`,
    body:
      `<rect x="6" y="26" width="34" height="46" rx="10" fill="#4F5BA6" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="60" y="26" width="34" height="46" rx="10" fill="#4F5BA6" stroke="${INK}" stroke-width="3"/>`,
    /* ★はじめは つなぎめを ふとい 丸（r9）に したが、その 丸が ぼうを
       ぜんぶ かくして「丸で つないで いる」ように 見えたので、ぼうを
       見せて、むすびめは ぼうの上の 白い 輪に かえた。
       ★左の 白い ふだを 口の まん下に 置くと「歯」に 見えたので、
       左へ ずらした。 */
    mark:
      `<circle cx="50" cy="48.5" r="4.5" fill="none" stroke="#FFF4E2" stroke-width="2.6"/>` +
      `<rect x="9" y="60" width="18" height="8" rx="3" fill="#FFF4E2" stroke="${INK}" stroke-width="2.2"/>` +
      `<path d="M13 64h10" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<path d="M68 44h14" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round"/>` +
      `<path d="M78 39 83 44 78 49" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M69 55h11" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>`,
    eyes: [[18, 42, 5.2], [32, 42, 5.2]],
    mouth: [25, 53],
    cheek: [[10, 51], [37, 51]],
    sproutAt: [23, 26],
    feet: [30, 70],
    feetY: 80,
    drop: -8,
  },

  /* j20 くらべて よむ
     － 上に てんびんの ぼう、まん中に さんかくの しちゅう。ぼうの 両はしから
       大きさ ちがいの 玉が 2つ ぶら下がり、ぼうは まっすぐ つりあう */
  kurabemoya: {
    color: "#9AA83F",
    soft: "#DCE4A8",
    topBefore:
      `<path d="M50 30 62 70H38z" fill="#9AA83F" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M20 31v10M80 31v10" fill="none" stroke="${INK}" stroke-width="2.5"/>` +
      `<rect x="13" y="24" width="74" height="7" rx="3.5" fill="#9AA83F" stroke="${INK}" stroke-width="3"/>`,
    body:
      `<circle cx="20" cy="56" r="18" fill="#9AA83F" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="80" cy="52" r="12" fill="#9AA83F" stroke="${INK}" stroke-width="3"/>`,
    /* 長い ふだと 短い ふだ＝くらべる 2つの おはなし。
       しちゅうの 白い たて線が「つりあって いる」はりの かわり。
       ★右の ふだを 玉の まん中に 置くと 左の ふだと 高さが そろわず
       「くらべて いる」ように 見えなかったので、左右 おなじ 高さに した。 */
    mark:
      `<path d="M50 36v12" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>` +
      `<rect x="10" y="44" width="21" height="5" rx="2.5" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<rect x="74" y="45" width="13" height="4.5" rx="2.2" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[14, 58, 5], [27, 58, 5]],
    mouth: [20, 69],
    cheek: [[7, 64], [33, 63]],
    sproutAt: [50, 24],
    feet: [34, 66],
    feetY: 84,
    drop: -4,
  },

  /* j21 むかしばなしを よむ
     － よこに ひらいた まきもの。左下と 右上の はしが くるんと まいて、
       まん中が 白い うずに なる。おなかに たてがきの 行が 2本 */
  mukashimoya: {
    color: "#8E5E86",
    soft: "#D6BBD2",
    topBefore: "",
    body: `<rect x="22" y="30" width="56" height="44" rx="3" fill="#8E5E86" stroke="${INK}" stroke-width="3"/>`,
    mark: `<path d="M66 52v18M72 52v13" fill="none" stroke="#FFF4E2" stroke-width="3" stroke-linecap="round"/>`,
    topAfter: scrollRoll(22, 62, 11, "#8E5E86") + scrollRoll(78, 42, 11, "#8E5E86"),
    eyes: [[41, 46, 5.5], [59, 46, 5.5]],
    mouth: [50, 60],
    cheek: [[32, 56], [68, 58]],
    sproutAt: [50, 30],
    feet: [38, 62],
    feetY: 88,
    drop: -2,
  },

  /* j22 1ねんの まとめ
     － まるくて 大きい（r=30）。おなかの 下のほうに、1年で ならった しるしが
       一れつに ならぶ（あ・ア・「一」）。うすい輪や よこの手は つけない */
  sotsumoya: {
    color: "#4FB3D9",
    soft: "#BCE4F2",
    topBefore: "",
    body: `<circle cx="50" cy="51" r="30" fill="#4FB3D9" stroke="${INK}" stroke-width="3"/>`,
    /* ★まとめもや（さんすう3学期）と 見分けるため、しるしは ＋−○△ では なく
       もじ（あ・ア・一・「」）に して、四すみでは なく 下に 一れつに ならべた。
       中の うすい 輪も つけていない。 */
    mark:
      `<path d="M30 63h11M36 60v7" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>` +
      `<circle cx="35.5" cy="70" r="3.6" fill="none" stroke="#FFF4E2" stroke-width="2.4"/>` +
      `<path d="M45 62h11" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M54 62q0 7-7 10" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M62 62h-4v9" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M61 67h7" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M71 62v9h-4" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>`,
    eyes: [[41, 43, 5.5], [59, 43, 5.5]],
    mouth: [50, 54],
    cheek: [[32, 50], [68, 50]],
    sproutAt: [50, 21],
    feet: [40, 60],
    feetY: 90,
  },
};

/* ---------- 組み立て（さんすう・こくご1学期・2学期と 同じ） ---------- */

function normalArt(p) {
  return (
    (p.topBefore || "") +
    p.body +
    (p.mark || "") +
    (p.topAfter || "") +
    eyesOpen(p.eyes) +
    (p.mouthNormal || mouthFlat(p.mouth)) +
    puffs(p.soft, p.drop || 0)
  );
}

function friendArt(p) {
  return (
    ground(p.color, p.feet, p.feetY) +
    (p.topBefore || "") +
    p.body +
    (p.mark || "") +
    (p.topAfter || "") +
    sprout(p.sproutAt[0], p.sproutAt[1]) +
    eyesClosed(p.eyes) +
    (p.mouthFriend || mouthSmile(p.mouth)) +
    cheeks(p.cheek) +
    sparkles()
  );
}

/* ============================================================
   こくご 3学期の もやもや 6体
   ============================================================ */
export const MOYA_ART_JP3 = {
  machimoya: {
    name: "まちもや",
    unit: "j17",
    note: "かんじを よむ（がっこうと まち）。上の へりが まちの スカイラインの体、とんがり屋根と 十字の まどが5つ",
    svg: normalArt(PARTS.machimoya),
    friendSvg: friendArt(PARTS.machimoya),
    color: PARTS.machimoya.color,
  },
  asobimoya: {
    name: "あそびもや",
    unit: "j18",
    note: "ことばあそび。まるい体が 2つ ななめに かさなり、白い 輪が つながって しりとりに 見える",
    svg: normalArt(PARTS.asobimoya),
    friendSvg: friendArt(PARTS.asobimoya),
    color: PARTS.asobimoya.color,
  },
  tsunagimoya: {
    name: "つなぎもや",
    unit: "j19",
    note: "しゅごと じゅつご。よこに 2つの 角丸ブロック、あいだを ふとい ぼうと まるい むすびめで つなぐ",
    svg: normalArt(PARTS.tsunagimoya),
    friendSvg: friendArt(PARTS.tsunagimoya),
    color: PARTS.tsunagimoya.color,
  },
  kurabemoya: {
    name: "くらべもや",
    unit: "j20",
    note: "くらべて よむ。てんびんの ぼうから 大きさ ちがいの 玉が 2つ ぶら下がり、まっすぐ つりあう",
    svg: normalArt(PARTS.kurabemoya),
    friendSvg: friendArt(PARTS.kurabemoya),
    color: PARTS.kurabemoya.color,
  },
  mukashimoya: {
    name: "むかしもや",
    unit: "j21",
    note: "むかしばなしを よむ。よこに ひらいた まきものの体、左下と 右上の はしが くるんと まいて いる",
    svg: normalArt(PARTS.mukashimoya),
    friendSvg: friendArt(PARTS.mukashimoya),
    color: PARTS.mukashimoya.color,
  },
  sotsumoya: {
    name: "そつもや",
    unit: "j22",
    note: "1ねんの まとめ。まるくて 大きい みず色の体、下に あ・ア・「一」の もじの しるしが 一れつ",
    svg: normalArt(PARTS.sotsumoya),
    friendSvg: friendArt(PARTS.sotsumoya),
    color: PARTS.sotsumoya.color,
  },
};

export const MOYA_ORDER_JP3 = [
  "machimoya",
  "asobimoya",
  "tsunagimoya",
  "kurabemoya",
  "mukashimoya",
  "sotsumoya",
];

export const MOYA_NAMES_JP3 = Object.fromEntries(
  MOYA_ORDER_JP3.map((id) => [id, MOYA_ART_JP3[id].name]),
);

/* さんすうの moyaArt(id, mood, size) と 同じ使い方 */
export function moyaArtJp3(id, mood = "normal", size = 100) {
  const a = MOYA_ART_JP3[id] || MOYA_ART_JP3.machimoya;
  const inner = mood === "friend" ? a.friendSvg : a.svg;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
}
