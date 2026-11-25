/* ============================================================
   ことばのまち ／ こくご 2学期の もやもや 8体
   ------------------------------------------------------------
   ・決まりは さんすう（moya-art.js）・こくご1学期（moya-art-jp.js）・
     2学期（moya-art-m2.js）・3学期（moya-art-m3.js）と まったく 同じ。
     100×100、<path> <circle> <ellipse> <rect> だけ、輪郭 #2B2A28 の 2.5〜3、
     filter / mask / gradient / <g> は つかわない。ぜんぶ 自分で 考えた かたち。
     実在の キャラクターや 有名ゲームの てきには 似せていない。
     こわい顔には しない（目は まるく、口は まっすぐか にっこり。
     やられる役なので、かわいそうに 見える 顔にも しない）。

   ・【既存31体は こういう形】
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
         いちばん 大きい まる＋輪

   ・【自分は こう変えた（かぶらせない ための めも）】
       katamoya     … かどが とがった 10かくけい。でこぼこは 丸ではなく 直線の
                      かどで、左右に とがりが 出ている。かたちもや（かどの まるい
                      さんかく・1色）、いたもや（ひしがた・4色の いた）とは
                      「へりが ぎざぎざの 一枚もの」で 見分く。
       hitsumoya    … たてに 細長く、下が とがる ふで。ひゃくもや（たて長の
                      角丸四角・つぶ12こ）より ずっと ほそく（はば28）、
                      下が さんかくに とがって いるので 影だけで ちがう。
                      もじもや（たて長たまご）とも「とがった下」で 見分く。
       gaimoya      … ふねの どう＋右うえに とがった みさき＋ほばしら と 白い ほ。
                      体の 上に さんかくの ほが 立つのは この子だけ。
                      かさもや（コップ＋とって・上に ふちの 楕円）とは
                      「ほばしらと ほ」「右が とがる」で ひと目で ちがう。
       kanjimoya    … ほぼ 正方形（かど rx5）の はんこ。頭に 四角い つまみ、
                      中に 白い 二重わく、右下に よこ線3本、左下に「日」。
                      とけいもや（角丸四角＋まるい ベル耳2つ＋とけい）とは
                      つまみの かたち（四角か まるか）と 二重わくで 見分く。
       shizenmoya   … 2だんの もみの木。とがった みきの ある 木は 31体に ない。
                      katamoya と どちらも 直線だが、こちらは 上に とがる
                      「山の かたち」＋下に ほそい みき と 根もと が ある。
       teineimoya   … たまごを ななめに して、小さい ほうを 左下に むけた体。
                      おなかの 前で 手を 2本 かさねて おじぎ して いる。
                      かずもや・まとめもや（どちらも まんまるで まっすぐ）とは
                      「ななめ」「前で かさねた手」で 小さくても ちがう。
       sagashimoya  … 下が まっすぐ、上が まるい ドーム。ドームは 31体に ない。
                      右下に 大きな 二重の レンズ（中に ことばと 下線）が 1つ。
                      ぜろもや（ドーナツ・まん中が あな）とは ちがい、
                      レンズは 体の はしに あって 中が つまって いる。
       ohanashimoya … ひらいた 本。左の ページが 顔、右の ページに ちいさな
                      ばめん（おひさま・おか・ふたりの とうじょうじんぶつ）。
                      ならべことば（ふだ3枚＋ひも）とは ちがい、2まいが
                      せなかの ほそい 帯で つながり、上の へりが くぼんで いる。

   ・なかまの姿（friendSvg）の 見分けかたも 1学期と 同じ4点：
       ①もやのつぶで浮く → かげの上に あし2本で立つ
       ②白目＋黒目 → とじた にこにこ目
       ③口が まっすぐ → にっこり
       ④頭に はっぱの め ＋ ほお ＋ きらきら
   ============================================================ */

const INK = "#2B2A28";

/* ---------- 共通のパーツ（さんすう・こくご1学期と 同じもの） ---------- */

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

/* ---------- 8体のパーツ表 ---------- */
/* topBefore … 体より先に描く／body … 体／mark … しるし／topAfter … 体より後に描く */

const PARTS = {
  /* j09 かたかなを よむ
     － かどが とがった 10かくけい。左右に とがりが 出て、おなかに
       まっすぐな せんが 3本（かたかなは 直線で できて いる） */
  katamoya: {
    color: "#4FA6B8",
    soft: "#B3DCE4",
    topBefore: "",
    body: `<path d="M50 12 72 20 84 40 74 48 86 62 66 80H34L14 62 26 48 16 40 28 20z" fill="#4FA6B8" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<path d="M40 62 32 74" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round"/>` +
      `<path d="M58 60v12" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round"/>` +
      `<path d="M46 71h20" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round"/>`,
    eyes: [[41, 40, 5.5], [59, 40, 5.5]],
    mouth: [50, 53],
    cheek: [[30, 51], [70, 51]],
    sproutAt: [50, 12],
    feet: [40, 60],
    feetY: 88,
  },

  /* j10 かたかなを ゆびで かく
     － たてに 細長い ふで。下が さんかくに とがり、まん中に 白い わく。
       右に すみの しずくが 1つぶ */
  hitsumoya: {
    color: "#A9825E",
    soft: "#DCC6AE",
    topBefore: "",
    body: `<path d="M36 24q0-12 14-12t14 12v30q0 10-4 16L50 84 40 70q-4-6-4-16z" fill="#A9825E" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<path d="M40 70q10 4 20 0L50 84z" fill="#7E5E46" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<rect x="34" y="52" width="32" height="9" rx="3" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M41 52v9M59 52v9" fill="none" stroke="${INK}" stroke-width="1.8"/>` +
      `<circle cx="75" cy="70" r="4.5" fill="#8A93B8" stroke="${INK}" stroke-width="2.2"/>` +
      `<path d="M63 62q6 2 9 4" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="3 4"/>`,
    eyes: [[44, 28, 4.8], [56, 28, 4.8]],
    mouth: [50, 39],
    cheek: [[41, 36], [59, 36]],
    sproutAt: [50, 12],
    feet: [40, 60],
    feetY: 90,
    drop: 2,
  },

  /* j11 かたかなで かく ことば
     － ふねの どう。右うえが とがった みさき、上に ほばしらと 白い ほ。
       右下に ふねの 名まえの ふだ（遠くの 海から 来た 子） */
  gaimoya: {
    color: "#5B86C9",
    soft: "#BBCDE8",
    topBefore:
      `<path d="M74 52 92 32q4 12 0 20z" fill="#5B86C9" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<rect x="47" y="16" width="5" height="38" rx="2" fill="#C49A6C" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M53 20q20 12 16 26H53z" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M47 17 35 21l12 4z" fill="#F2B23C" stroke="${INK}" stroke-width="2"/>`,
    body: `<path d="M12 52h76q-2 24-16 28H28q-14-4-16-28z" fill="#5B86C9" stroke="${INK}" stroke-width="3"/>`,
    /* ★まるい まどを 目の よこに ならべたら「目が4つ」に 見えたので、
       右下に ずらした 白い ふだ（ふねの 名まえ）に かえた。
       中は まっすぐな せん だけ＝かたかなで 書いた 名まえ。 */
    mark:
      `<rect x="56" y="65" width="21" height="11" rx="3" fill="#FFF4E2" stroke="${INK}" stroke-width="2.2"/>` +
      `<path d="M62 68 59 74M65 69h8M71 69v5" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
    eyes: [[36, 62, 5], [52, 62, 5]],
    mouth: [44, 73],
    cheek: [[27, 70], [61, 71]],
    sproutAt: [26, 52],
    feet: [38, 62],
    feetY: 88,
  },

  /* j12 かんじを よむ（かずと ひ）
     － 四角い はんこ。頭に 四角い つまみ、中に 白い 二重わく。
       右下に よこ線が 3本（一・二・三）、左下に「日」 */
  kanjimoya: {
    color: "#CF5F57",
    soft: "#EFB4AE",
    topBefore: `<rect x="41" y="12" width="18" height="14" rx="5" fill="#CF5F57" stroke="${INK}" stroke-width="3"/>`,
    body: `<rect x="20" y="24" width="60" height="58" rx="5" fill="#CF5F57" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<rect x="27" y="31" width="46" height="46" rx="2" fill="none" stroke="#FFF4E2" stroke-width="2.8"/>` +
      `<path d="M52 60h18M52 67h18M52 74h18" fill="none" stroke="#FFF4E2" stroke-width="3.2" stroke-linecap="round"/>` +
      `<rect x="30" y="57" width="15" height="17" rx="2" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M30 65.5h15" fill="none" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[38, 42, 5.5], [62, 42, 5.5]],
    mouth: [50, 52],
    cheek: [[29, 51], [71, 51]],
    sproutAt: [66, 24],
    feet: [40, 60],
    feetY: 90,
    drop: 2,
  },

  /* j13 かんじを よむ（ひとと しぜん）
     － 2だんの もみの木。上の だんに「川」、ほそい みきに「人」、
       下は 根もとが ひろがる */
  shizenmoya: {
    color: "#6FA85A",
    soft: "#C3DFB4",
    topBefore: `<rect x="43" y="60" width="14" height="18" rx="3" fill="#6FA85A" stroke="${INK}" stroke-width="3"/>`,
    body: `<path d="M50 10 66 36H56L78 62H22L44 36H34z" fill="#6FA85A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
    topAfter: `<path d="M36 78h28q2 5-6 5H42q-8 0-6-5z" fill="#6FA85A" stroke="${INK}" stroke-width="2.5"/>`,
    /* ★上の だんは まるい しるしだと「かざり玉」に 見えたので、
       「川」の 3本に かえた（みきの「人」と あわせて ひとと しぜん）。 */
    mark:
      `<path d="M44 24v8M50 22v11M56 24v8" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M50 64 45 75M50 64l5 11" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>`,
    eyes: [[41, 48, 5], [59, 48, 5]],
    mouth: [50, 56],
    cheek: [[34, 54], [66, 54]],
    sproutAt: [50, 10],
    feet: [40, 62],
    feetY: 88,
  },

  /* j14 ていねいな ことば
     － たまごを ななめに して、小さい ほうを 左下に むけた やわらかい体。
       おなかの 前で 手を 2本 かさねて、ちょこんと おじぎ して いる */
  teineimoya: {
    color: "#F2A8C4",
    soft: "#FAD7E4",
    topBefore: "",
    body: `<path d="M28 66Q40 81 61 64 82 47 70 32 58 17 37 34 16 51 28 66z" fill="#F2A8C4" stroke="${INK}" stroke-width="3"/>`,
    mark: `<path d="M52 31q13 3 19 13" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round"/>`,
    /* ★手は 下に 大きく 置くと「あし」に 見えたので、小さくして
       おなかの 前へ 上げた。ななめに かさねて「手を かさねた おじぎ」。 */
    topAfter:
      `<rect x="30" y="59" width="19" height="8" rx="4" fill="#F2A8C4" stroke="${INK}" stroke-width="2.5"/>` +
      `<rect x="39" y="65" width="17" height="8" rx="4" fill="#F2A8C4" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M17 42q-5-3-5-9" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>` +
      `<path d="M26 30q-3-5-1-10" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
    eyes: [[32, 46, 4.8], [44, 41, 4.8]],
    mouth: [38, 53],
    cheek: [[25, 52], [48, 38]],
    sproutAt: [37, 33],
    feet: [36, 58],
    feetY: 88,
    drop: 2,
  },

  /* j15 だいじな ことばを さがす
     － 下が まっすぐ、上が まるい ドームの体。右下に 大きな 二重の レンズが
       1つ。レンズの 中に ことばが 2つと 下線（だいじな ことばに せん） */
  sagashimoya: {
    color: "#D9A94E",
    soft: "#F0DCAE",
    topBefore: "",
    body: `<path d="M12 84q0-48 38-48t38 48z" fill="#D9A94E" stroke="${INK}" stroke-width="3"/>`,
    /* ★レンズの中に 黒い 四角2つ＋下線を 入れたら「にやりと 笑う 口」に
       見えたので、よこ線 3本（本の 文）に かえた。まん中の 太い 線が
       「だいじな ことば」。 */
    mark:
      `<circle cx="64" cy="66" r="13" fill="#FFF4E2" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="64" cy="66" r="9.5" fill="none" stroke="${INK}" stroke-width="1.6"/>` +
      `<path d="M58 61h12" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<path d="M57 66h14" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>` +
      `<path d="M59 71h10" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`,
    eyes: [[36, 48, 5.2], [58, 48, 5.2]],
    mouth: [40, 60],
    cheek: [[24, 58], [47, 63]],
    sproutAt: [50, 36],
    feet: [40, 62],
    feetY: 90,
    drop: 2,
  },

  /* j16 ばめんと とうじょうじんぶつ
     － ひらいた 本。左の ページが 顔、右の ページに ちいさな ばめん
       （おひさま・おか・ふたりの とうじょうじんぶつ）が 見える */
  ohanashimoya: {
    color: "#A892D8",
    soft: "#D7CBEE",
    topBefore: `<rect x="45" y="26" width="10" height="48" rx="4" fill="#A892D8" stroke="${INK}" stroke-width="2.5"/>`,
    body:
      `<path d="M50 30q-18-8-34-4v40q16-4 34 4z" fill="#A892D8" stroke="${INK}" stroke-width="3"/>` +
      `<path d="M50 30q18-8 34-4v40q-16-4-34 4z" fill="#A892D8" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<rect x="56" y="34" width="24" height="26" rx="4" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="62" cy="40" r="3.2" fill="#F2B23C" stroke="${INK}" stroke-width="1.6"/>` +
      `<path d="M56 60q6-11 12-5t12 5z" fill="#BFE08A" stroke="${INK}" stroke-width="1.6"/>` +
      `<circle cx="67" cy="50" r="2.8" fill="#9CC9F0" stroke="${INK}" stroke-width="1.6"/>` +
      `<circle cx="75" cy="52" r="2.8" fill="#F4A9A9" stroke="${INK}" stroke-width="1.6"/>`,
    eyes: [[26, 42, 4.6], [39, 42, 4.6]],
    mouth: [32, 54],
    cheek: [[21, 51], [44, 51]],
    sproutAt: [50, 26],
    feet: [38, 60],
    feetY: 80,
    drop: -4,
  },
};

/* ---------- 組み立て（さんすう・こくご1学期と 同じ） ---------- */

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
   こくご 2学期の もやもや 8体
   ============================================================ */
export const MOYA_ART_JP2 = {
  katamoya: {
    name: "かたもや",
    unit: "j09",
    note: "かたかなを よむ。かどが とがった 10かくけいの体、おなかに まっすぐな せんが3本",
    svg: normalArt(PARTS.katamoya),
    friendSvg: friendArt(PARTS.katamoya),
    color: PARTS.katamoya.color,
  },
  hitsumoya: {
    name: "ひつもや",
    unit: "j10",
    note: "かたかなを ゆびで かく。たてに 細長い ふでの体、下が さんかくに とがる、よこに すみの しずく",
    svg: normalArt(PARTS.hitsumoya),
    friendSvg: friendArt(PARTS.hitsumoya),
    color: PARTS.hitsumoya.color,
  },
  gaimoya: {
    name: "がいもや",
    unit: "j11",
    note: "かたかなで かく ことば。ふねの どうの体、右うえが とがり、上に ほばしらと 白い ほが立つ",
    svg: normalArt(PARTS.gaimoya),
    friendSvg: friendArt(PARTS.gaimoya),
    color: PARTS.gaimoya.color,
  },
  kanjimoya: {
    name: "かんじもや",
    unit: "j12",
    note: "かんじを よむ（かずと ひ）。四角い はんこの体、頭に 四角い つまみ、右下に よこ線3本、左下に 日",
    svg: normalArt(PARTS.kanjimoya),
    friendSvg: friendArt(PARTS.kanjimoya),
    color: PARTS.kanjimoya.color,
  },
  shizenmoya: {
    name: "しぜんもや",
    unit: "j13",
    note: "かんじを よむ（ひとと しぜん）。2だんの もみの木の体、上の だんに 川、ほそい みきに 人",
    svg: normalArt(PARTS.shizenmoya),
    friendSvg: friendArt(PARTS.shizenmoya),
    color: PARTS.shizenmoya.color,
  },
  teineimoya: {
    name: "ていねいもや",
    unit: "j14",
    note: "ていねいな ことば。ななめの やわらかい体、おなかの前で 手を かさねて ちょこんと おじぎ",
    svg: normalArt(PARTS.teineimoya),
    friendSvg: friendArt(PARTS.teineimoya),
    color: PARTS.teineimoya.color,
  },
  sagashimoya: {
    name: "さがしもや",
    unit: "j15",
    note: "だいじな ことばを さがす。下が まっすぐな ドームの体、右下に 大きな 二重の レンズが1つ",
    svg: normalArt(PARTS.sagashimoya),
    friendSvg: friendArt(PARTS.sagashimoya),
    color: PARTS.sagashimoya.color,
  },
  ohanashimoya: {
    name: "おはなしもや",
    unit: "j16",
    note: "ばめんと とうじょうじんぶつ。ひらいた 本の体、左の ページが 顔、右の ページに ちいさな ばめん",
    svg: normalArt(PARTS.ohanashimoya),
    friendSvg: friendArt(PARTS.ohanashimoya),
    color: PARTS.ohanashimoya.color,
  },
};

export const MOYA_ORDER_JP2 = [
  "katamoya",
  "hitsumoya",
  "gaimoya",
  "kanjimoya",
  "shizenmoya",
  "teineimoya",
  "sagashimoya",
  "ohanashimoya",
];

export const MOYA_NAMES_JP2 = Object.fromEntries(
  MOYA_ORDER_JP2.map((id) => [id, MOYA_ART_JP2[id].name]),
);

/* さんすうの moyaArt(id, mood, size) と 同じ使い方 */
export function moyaArtJp2(id, mood = "normal", size = 100) {
  const a = MOYA_ART_JP2[id] || MOYA_ART_JP2.katamoya;
  const inner = mood === "friend" ? a.friendSvg : a.svg;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
}
