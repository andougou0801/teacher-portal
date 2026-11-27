/* ============================================================
   かずのまち ／ 2年 さんすう 1学期の もやもや 8体
   ------------------------------------------------------------
   ・決まりは さんすう1年（moya-art.js）・こくご1学期（moya-art-jp.js）・
     さんすう2学期（moya-art-m2.js）・さんすう3学期（moya-art-m3.js）・
     こくご2学期（moya-art-jp2.js）・こくご3学期（moya-art-jp3.js）と
     まったく 同じ。
     100×100、<path> <circle> <ellipse> <rect> だけ、輪郭 #2B2A28 の 2.5〜3、
     filter / mask / gradient / <g> は つかわない。ぜんぶ 自分で 考えた かたち。
     実在の キャラクターや 有名ゲームの てきには 似せていない。
     こわい顔には しない（目は まるく、口は まっすぐか にっこり。
     やられる役なので、かわいそうに 見える 顔にも しない）。

   ・【既存45体は こういう形】
       さんすう1学期12 … まんまる(r28)＋ぼんぼり／ひらたい楕円が たてに3つ／
         ふたこぶ／上がデコボコ4つ／右が まるく 欠けた丸＋目1つ／ドーナツ／
         よこ長カプセル(rx15)＋上べりに 目もり4本／高さちがいの ぼう3本が 体／
         かどの まるい さんかく／角丸四角＋ベル耳＋とけい／
         下が ほそまる コップ＋とって＋波線／よこ広たまご(rx29)＋リボン
       こくご1学期8 … たて長たまご＋はねの尾／ふだ3枚＋ひも／大きい楕円＋
         小さい子分／つぶ3つの三つ葉／丸(r26)＋てんの尾＋かぎかっこ／
         3つの玉が よこに よりそう／ふきだし／かいだん3だん
       さんすう2学期5 … 玉3つを ぼうに 通した たて／しずく＋上むき矢＋右上の白玉／
         右へ かたむいた板＋下むき矢／つぶ12こ そのものが 体／右が とがった 矢じるし
       さんすう3学期6 … たて長角丸(44×70)＋中に つぶ12こ／たて2本の はしら＋帯／
         よこ長の帯(84×42)＋くぎり線＋テープ図／ちいさい体4つが 手つなぎ／
         ひしがた4まいの いろいた／いちばん 大きい まる(r33)＋輪＋＋−○△＋よこ手2つ
       こくご2学期8 … かどが とがった10かくけい／たて長の ふで／ふねの どう＋ほ／
         四角い はんこ(60×58・かど四角)／2だんの もみの木／ななめの たまご＋
         かさねた手／ドーム＋レンズ／ひらいた 本
       こくご3学期6 … まちの スカイライン／まるい体2つが ななめに かさなる／
         よこに 角丸ブロック2つ＋ぼう／てんびん＋ぶら下がる玉2つ／
         よこに ひらいた まきもの／まる(r30)＋もじの しるし

   ・【自分は こう変えた（かぶらせない ための めも）】
       hyoumoya      … かど四角の 四角い体（68×46）。下はんぶんが ます目
                       （よこ1本＋たて2本の くぎり線＋ます目の ○ が3つ）。
                       上べりから たての ぼうが 3本 のびて はみ出す。
                       ★しらべもや（ぼう3本 そのものが 体・ぼうは 下の 地面に
                       そろって 立つ）とは ちがって、こちらは「四角い ます目の
                       体から ぼうが 上へ はみ出す」。かんじもや（60×58の
                       はんこ・中は もじの せん）とは ぼうの はみ出しで ちがう。
       hissanmoya    … たてに 2だんの 角丸ブロック。あいだに よこ線が 1本だけ
                       あって、体より 左右に ずっと はみ出す（＝ひっ算の線）。
                       左うえに ＋ の ふだ、下の だんに こたえの つぶ3つ。
                       ★くりあがりもや（1年・たての しずく＋上むき矢＋右上に
                       うかぶ 白玉）とは かたちが ぜんぜん ちがう。
                       ならびもや（ひらたい楕円 3つ・くぎり線なし）とは
                       「だんが 2つ」「よこ線が 外へ はみ出す」で ひと目で ちがう。
                       けたもや（はしらが よこに 2本）とは たて・よこで ちがう。
       kurisagemoya  … 上の だんが ひろく、まん中が ほそく くびれ、下の だんが
                       また ひろい ひとつづきの体（I がたの くびれ）。
                       くびれの ところに 白い つぶが 1つ あって、そのまま
                       下の だんへ おりていく（下むきの 白い やじるし）。
                       下の だんの 左に − の ふだ。
                       ★くりさがりもや（1年・右へ かたむいた 板＋下むき矢＋
                       右へ こぼれる玉3つ）とは ちがい、こちらは まっすぐ 立って
                       いて、玉は 体の まん中を たてに 通って いく。
                       ひっさんもや（v02・だんが 2つに はなれて よこ線が
                       はみ出す）とも、くびれが あるかで 見分けられる。
       monosashimoya … たてに ほそ長い 体（28×74・かど四角）。右べりから 中へ、
                       長い めもりと 短い めもりが かわりばんこに 8本。
                       左べりから さんかくの はりが 1つ 外へ とび出す。
                       ★ながさもや（1年・よこ長の カプセル・かどが まるい・
                       目もりは 上べりに 4本だけ・顔は 左）とは たて／よこで
                       ぜんぜん ちがう。ひつもや（ふで・上が まるく 下が
                       とがる）とは かど四角と はりで ちがう。
       senmoya       … いちばん よこに 大きい 体（よこ長の 楕円 rx40・ry29）。
                       たての うすい くぎり線 2本で 百・十・一の 3つの へやに
                       わかれ、つぶが 9こ・3こ・1こ の 3かたまりに なっている。
                       ★ひゃくもや（たて長の 角丸・青・つぶは 12こ ぜんぶ 同じ
                       大きさの ます目ならび・上に はみ出した つぶ1つ）とは
                       たて／よこ、つぶが 3かたまりに わかれて いるか、
                       そして 色（もも色／青）で ちがう。おおかずもや（つぶ12こ そのものが 体・へりが
                       ぷつぷつ）とは、つぶが 中か 外かで ちがう。
                       おさらいもや（rx29の たまご＋リボン）より ずっと 大きい。
       masumoya      … まっすぐな 四角い ます（かど四角 66×47）＋上に よこに
                       ひろい ふちの 板。中の 下はんぶんに 水が たまり、
                       水面は まっすぐな よこ線（あわの つぶが 2つ）。
                       左べりに dLの めもりが 2本。
                       ★かさもや（1年・下が ほそまる コップ・とっ手が つく・
                       水は ぐにゃぐにゃの 波線）とは ちがい、こちらは
                       かどが 四角で とっ手が なく、水面は まっすぐ。
                       がいもや（ふねの どう）とは 上の ふちの 板で ちがう。
       sakamoya      … よこ長の 角丸（60×42）。右うえから 右へ むかう 白い
                       やじるしが 1つ、左したから 左へ むかう 白い やじるしが
                       1つ、どちらも 体から 外へ はみ出す（いきと かえり）。
                       ＋は 右うえ、− は 左した。
                       ★ずもや（よこ長の 帯・たての くぎり線＋テープ図の ます
                       3つ・やじるし なし）とは ちがい、こちらは 左右に
                       やじるしの 頭が とび出す。いちもや（体ぜんたいが
                       右むき 1つの 矢じるし）とは、やじるしが 2つで むきが
                       はんたいな ところで ちがう。
       kufumoya      … ちいさめの まる（r24）が 少し 左下に よっていて、
                       右うえに ちいさな はぐるまが 1つ だけ ついている
                       （はの ある 白い 丸＋まん中の あな）。
                       ★まとめもや（r33・中に うすい 輪・＋−○△・よこ手2つ）、
                       そつもや（r30・もじの しるし）、かずもや（r28・真上に
                       ぼんぼり・白い点5つ）、てんまるもや（r26・てんの尾＋
                       かぎかっこ）とは、まるが いちばん 小さく、まん中から
                       ずれて いて、頭の 右うえに はぐるまが はみ出す ところで
                       見分けられる。

   ・なかまの姿（friendSvg）の 見分けかたも これまでと 同じ4点：
       ①もやのつぶで浮く → かげの上に あし2本で立つ
       ②白目＋黒目 → とじた にこにこ目
       ③口が まっすぐ → にっこり
       ④頭に はっぱの め ＋ ほお ＋ きらきら
   ============================================================ */

const INK = "#2B2A28";

/* ---------- 共通のパーツ（1年の6ファイルと 同じもの） ---------- */

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

/* よこ×たて に ならぶ まるい つぶ（せんもやの 百・十の かたまり） */
function dotGrid(xs, ys, r, fill) {
  let out = "";
  for (const y of ys) {
    for (const x of xs) {
      out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="1.6"/>`;
    }
  }
  return out;
}

/* たての ぼう（ひょうもやの ぼうグラフ）
   － 上から のびて、体の 中（y=42）まで さしこむ */
function graphBar(x, top, color) {
  return `<rect x="${x}" y="${top}" width="9" height="${42 - top}" rx="2" fill="${color}" stroke="${INK}" stroke-width="2.5"/>`;
}

/* ちいさな はぐるま（くふうもや）
   － はが 8つの 白い 丸＋まん中の あな。transform は つかわず、
     ぜんぶ 計算した 点を つないだ 1本の path */
function gearPath(cx, cy, rOut, rIn, teeth, fill, holeFill) {
  const n = (v) => Number(v.toFixed(1));
  let d = "";
  for (let i = 0; i < teeth * 2; i += 1) {
    const a = (Math.PI * i) / teeth;
    const r = i % 2 === 0 ? rOut : rIn;
    d += `${i === 0 ? "M" : "L"}${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
  }
  return (
    `<path d="${d}Z" fill="${fill}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${(rIn * 0.42).toFixed(1)}" fill="${holeFill}" stroke="${INK}" stroke-width="2"/>`
  );
}

/* ---------- 8体のパーツ表 ---------- */
/* topBefore … 体より先に描く／body … 体／mark … しるし／topAfter … 体より後に描く */

const PARTS = {
  /* v01 ひょうと グラフ
     － かど四角の 四角い体。下はんぶんが ます目。
       上べりから たての ぼうが 3本 のびて はみ出す */
  hyoumoya: {
    color: "#3E9E8A",
    soft: "#AEDDD2",
    topBefore:
      graphBar(25, 18, "#3E9E8A") + graphBar(45, 26, "#3E9E8A") + graphBar(65, 12, "#3E9E8A"),
    body: `<rect x="16" y="38" width="68" height="46" rx="4" fill="#3E9E8A" stroke="${INK}" stroke-width="3"/>`,
    /* ★はじめは ぼうを 体の 中に 白く かいたが、それだと しらべもや（ぼうが
       そのまま 体）と 小さい ときに 見分けづらかったので、ぼうは 上へ
       はみ出させて、体の 中は「ます目と ○」だけに した。 */
    mark:
      `<path d="M18 70h64" fill="none" stroke="#FFF4E2" stroke-width="2.6"/>` +
      `<path d="M38 70v14M62 70v14" fill="none" stroke="#FFF4E2" stroke-width="2.6"/>` +
      `<circle cx="27" cy="77" r="3.2" fill="#FFF4E2" stroke="${INK}" stroke-width="1.8"/>` +
      `<circle cx="50" cy="77" r="3.2" fill="#FFF4E2" stroke="${INK}" stroke-width="1.8"/>` +
      `<circle cx="72" cy="77" r="3.2" fill="#FFF4E2" stroke="${INK}" stroke-width="1.8"/>`,
    eyes: [[40, 52, 5.2], [60, 52, 5.2]],
    mouth: [50, 62],
    cheek: [[28, 60], [72, 60]],
    sproutAt: [69, 12],
    feet: [40, 60],
    feetY: 90,
  },

  /* v02 たしざんの ひっ算
     － たてに 2だんの 角丸ブロック。あいだの よこ線が 体より 左右に はみ出す */
  hissanmoya: {
    color: "#D96A86",
    soft: "#F3C0CC",
    topBefore: "",
    body:
      `<rect x="26" y="20" width="48" height="34" rx="10" fill="#D96A86" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="26" y="60" width="48" height="24" rx="10" fill="#D96A86" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="13" y="54" width="74" height="6" rx="3" fill="#D96A86" stroke="${INK}" stroke-width="3"/>`,
    /* ★こたえの つぶを 口の すぐ下に 置くと「歯」に 見えたので、
       よこ線の 下の だんに はなして ならべた。
       ＋の ふだは よこ線の 左の はしの 上（体の 外）に うかばせて、
       よこ線が「ひっ算の線」だと わかるように した。 */
    mark:
      `<circle cx="18" cy="45" r="7" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M18 41v8M14 45h8" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>` +
      `<circle cx="38" cy="72" r="3.4" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="50" cy="72" r="3.4" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="62" cy="72" r="3.4" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[40, 34, 5.2], [60, 34, 5.2]],
    mouth: [50, 45],
    cheek: [[31, 43], [69, 43]],
    sproutAt: [50, 20],
    feet: [40, 60],
    feetY: 90,
    drop: 2,
  },

  /* v03 ひきざんの ひっ算
     － 上の だんと 下の だんが ひとつづきで、まん中が ほそく くびれる。
       くびれを 白い つぶが 1つ 通って 下の だんへ おりていく */
  kurisagemoya: {
    color: "#7E6BC4",
    soft: "#CCC3EC",
    topBefore: "",
    body: `<path d="M22 22H78q6 0 6 6V42q0 6-6 6H64q-6 0-6 6V58q0 6 6 6H80q6 0 6 6V78q0 6-6 6H20q-6 0-6-6V70q0-6 6-6H36q6 0 6-6V54q0-6-6-6H22q-6 0-6-6V28q0-6 6-6z" fill="#7E6BC4" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
    /* ★はじめは おりてくる つぶを 上の だんにも 置いて 2つに したが、
       口の すぐ下に 白い 丸が 2つ ならんで「は」に 見えたので、
       つぶは くびれの 1つだけに して、下の だんには やじるしだけを 置いた。 */
    mark:
      `<circle cx="50" cy="56" r="5" fill="#FFF4E2" stroke="${INK}" stroke-width="2.2"/>` +
      `<path d="M50 67v8" fill="none" stroke="#FFF4E2" stroke-width="3.2" stroke-linecap="round"/>` +
      `<path d="M45 71 50 77 55 71" fill="none" stroke="#FFF4E2" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<rect x="21" y="71" width="16" height="6" rx="3" fill="#FFF4E2" stroke="${INK}" stroke-width="2.2"/>`,
    eyes: [[40, 33, 5.2], [60, 33, 5.2]],
    mouth: [50, 43],
    cheek: [[27, 41], [73, 41]],
    sproutAt: [50, 22],
    feet: [40, 60],
    feetY: 90,
    drop: 2,
  },

  /* v04 ながさ
     － たてに ほそ長い体。右べりから 長い／短い めもりが かわりばんこに 8本。
       左べりから さんかくの はりが 外へ とび出す */
  monosashimoya: {
    color: "#C9A227",
    soft: "#EEDCA0",
    topBefore: `<path d="M36 55 26 61 36 67z" fill="#C9A227" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    body: `<rect x="36" y="10" width="28" height="74" rx="4" fill="#C9A227" stroke="${INK}" stroke-width="3"/>`,
    /* ★めもりを 左右 両方に 入れたら 体が こまかすぎて つぶれたので、
       右べりだけに して、左には はりを 1つ つけた。
       顔と めもりの あいだには 白い くぎり線を 入れて、
       「顔の下は ぜんぶ ものさし」だと わかるように した。 */
    mark:
      `<path d="M38 41h24" fill="none" stroke="#FFF4E2" stroke-width="2.4"/>` +
      `<path d="M64 46h-9M64 51h-5M64 56h-9M64 61h-5M64 66h-9M64 71h-5M64 76h-9M64 81h-5" fill="none" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[44, 24, 4.6], [57, 24, 4.6]],
    mouth: [50, 34],
    cheek: [[40, 32], [61, 32]],
    sproutAt: [50, 10],
    feet: [42, 58],
    feetY: 88,
  },

  /* v05 1000までの かず
     － いちばん よこに 大きい 楕円。たての くぎり線 2本で 百・十・一に わかれ、
       つぶが 9こ・3こ・1こ の 3かたまり */
  senmoya: {
    color: "#A8508F",
    soft: "#E2B4D6",
    topBefore: "",
    body: `<ellipse cx="50" cy="54" rx="40" ry="29" fill="#A8508F" stroke="${INK}" stroke-width="3"/>`,
    /* ★はじめは つぶを 白い ふだの 中に 入れたが、ふだが 大きすぎて
       「おなかに 四角が 3つ」に 見えたので、ふだは やめて うすい くぎり線に した。
       ★48pxで ひゃくもや（たて長・青・つぶ12こ）と ならべたら、青い体に
       白い つぶ という ところが そっくりに 見えたので、
         ①色を 青から こい もも色に かえ
         ②つぶの 大きさを 百＜十＜一 と はっきり かえ
         ③くぎり線を ふとく して 3つの へやに 見えるように した。
       つぶの 数が 9・3・1 で 大きさも ちがうので、小さく しても
       「3つの かたまり」に 見える。 */
    mark:
      `<path d="M46 55v24M63 55v24" fill="none" stroke="#FFF4E2" stroke-width="3"/>` +
      dotGrid([26, 33, 40], [58, 65, 72], 2.6, "#FFF4E2") +
      dotGrid([55], [58, 65, 72], 3.4, "#FFF4E2") +
      `<circle cx="73" cy="65" r="4.8" fill="#FFF4E2" stroke="${INK}" stroke-width="1.8"/>`,
    eyes: [[41, 39, 5.5], [59, 39, 5.5]],
    mouth: [50, 49],
    cheek: [[27, 46], [73, 46]],
    sproutAt: [50, 25],
    feet: [40, 60],
    feetY: 90,
  },

  /* v06 かさ
     － かど四角の まっすぐな ます＋上に よこに ひろい ふちの 板。
       中の 下はんぶんに 水、水面は まっすぐな よこ線 */
  masumoya: {
    color: "#4FC2D9",
    soft: "#BCE9F1",
    topBefore: `<rect x="11" y="28" width="78" height="9" rx="2.5" fill="#4FC2D9" stroke="${INK}" stroke-width="3"/>`,
    body: `<rect x="17" y="37" width="66" height="47" rx="2" fill="#4FC2D9" stroke="${INK}" stroke-width="3"/>`,
    /* ★水を ぐにゃぐにゃの 波線に すると かさもや（1年）と そっくりに
       なったので、水は「たまった 面」として ぬり、水面は まっすぐな 1本線に した。
       めもりは 右に 置くと ほおと かさなったので 左べりに した。 */
    mark:
      `<rect x="19" y="60" width="62" height="22" fill="#BCE9F1"/>` +
      `<path d="M19 60h62" fill="none" stroke="#FFF4E2" stroke-width="3"/>` +
      `<circle cx="34" cy="71" r="3" fill="#FFFFFF" stroke="${INK}" stroke-width="1.8"/>` +
      `<circle cx="62" cy="75" r="2.4" fill="#FFFFFF" stroke="${INK}" stroke-width="1.8"/>` +
      `<path d="M19 44h8M19 52h8" fill="none" stroke="#FFF4E2" stroke-width="2.4"/>`,
    eyes: [[40, 46, 5.2], [60, 46, 5.2]],
    mouth: [50, 55],
    cheek: [[30, 54], [70, 54]],
    sproutAt: [50, 28],
    feet: [40, 60],
    feetY: 90,
  },

  /* v07 たしざんと ひきざんの かんけい
     － よこ長の 角丸。右うえに 右むきの やじるし、左したに 左むきの やじるし */
  sakamoya: {
    color: "#E04E2E",
    soft: "#F7BDA8",
    topBefore: "",
    body: `<rect x="20" y="40" width="60" height="42" rx="16" fill="#E04E2E" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<path d="M55 46h10M60 41v10" fill="none" stroke="#FFF4E2" stroke-width="2.8" stroke-linecap="round"/>` +
      `<path d="M41 74h10" fill="none" stroke="#FFF4E2" stroke-width="2.8" stroke-linecap="round"/>`,
    /* ★やじるしを 体の 下（topBefore）に おくと 頭だけ 出て 三角に 見えたので、
       体の 上に 白く のせて、しっぽが 体の 中、頭が 外に はみ出すように した。
       2本を ななめ（右うえ・左した）に ずらしたので、顔と かさならない。
       ★48pxで ずもや（よこ長の 帯・おなじ オレンジ）と ならべたら 近かったので、
       体を よこに 短く（60）して かどを もっと まるくし、
       やじるしを 大きくして 外へ もっと はみ出させ、色も 赤よりに した。 */
    topAfter:
      `<path d="M66 46h14v-7l12 13-12 13v-7H66z" fill="#FFF4E2" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>` +
      `<path d="M34 64H20v-7L8 70l12 13v-7h14z" fill="#FFF4E2" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`,
    eyes: [[42, 54, 5.2], [58, 54, 5.2]],
    mouth: [50, 64],
    cheek: [[30, 60], [66, 61]],
    sproutAt: [50, 40],
    feet: [38, 62],
    feetY: 88,
  },

  /* v08 けいさんの くふう
     － ちいさめの まるが 少し 左下に より、右うえに はぐるまが 1つ */
  kufumoya: {
    color: "#A8743F",
    soft: "#DFC2A2",
    topBefore: "",
    body: `<circle cx="44" cy="58" r="24" fill="#A8743F" stroke="${INK}" stroke-width="3"/>`,
    /* ★はぐるまを おなかの まん中に 置いたら 2つめの 顔に 見えたので、
       頭の 右うえ（体から はみ出す ところ）に 1つだけ 置いた。
       はの 先は とがりすぎないように stroke-linejoin="round" で まるめて ある。 */
    mark: gearPath(68, 33, 12, 8.5, 8, "#FFF4E2", "#A8743F"),
    eyes: [[36, 52, 5.2], [52, 52, 5.2]],
    mouth: [44, 63],
    cheek: [[27, 61], [59, 60]],
    sproutAt: [32, 40],
    feet: [36, 58],
    feetY: 88,
  },
};

/* ---------- 組み立て（1年の6ファイルと 同じ） ---------- */

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
   2年 さんすう 1学期の もやもや 8体
   ============================================================ */
export const MOYA_ART_G2 = {
  hyoumoya: {
    name: "ひょうもや",
    unit: "v01",
    note: "ひょうと グラフ。ます目に くぎられた 四角い体から、たての ぼうが 3本 上へ のびて はみ出す",
    svg: normalArt(PARTS.hyoumoya),
    friendSvg: friendArt(PARTS.hyoumoya),
    color: PARTS.hyoumoya.color,
  },
  hissanmoya: {
    name: "ひっさんもや",
    unit: "v02",
    note: "たしざんの ひっ算。たてに 2だんの体で、あいだの よこ線が 左右に はみ出す。左うえに ＋ の ふだ",
    svg: normalArt(PARTS.hissanmoya),
    friendSvg: friendArt(PARTS.hissanmoya),
    color: PARTS.hissanmoya.color,
  },
  kurisagemoya: {
    name: "くりさげもや",
    unit: "v03",
    note: "ひきざんの ひっ算。まん中が くびれた体で、白い つぶが 1つ 上の だんから 下の だんへ おりてくる",
    svg: normalArt(PARTS.kurisagemoya),
    friendSvg: friendArt(PARTS.kurisagemoya),
    color: PARTS.kurisagemoya.color,
  },
  monosashimoya: {
    name: "ものさしもや",
    unit: "v04",
    note: "ながさ。たてに ほそ長い体に こまかい めもりが 8本 ならび、左に さんかくの はりが 1つ",
    svg: normalArt(PARTS.monosashimoya),
    friendSvg: friendArt(PARTS.monosashimoya),
    color: PARTS.monosashimoya.color,
  },
  senmoya: {
    name: "せんもや",
    unit: "v05",
    note: "1000までの かず。いちばん よこに 大きい体に、つぶが 9こ・3こ・1こ の 3かたまり（百・十・一）",
    svg: normalArt(PARTS.senmoya),
    friendSvg: friendArt(PARTS.senmoya),
    color: PARTS.senmoya.color,
  },
  masumoya: {
    name: "ますもや",
    unit: "v06",
    note: "かさ。かどが 四角い ますの体に 上の ふちが つき、中に 水が たまって 水面が まっすぐな 線に 見える",
    svg: normalArt(PARTS.masumoya),
    friendSvg: friendArt(PARTS.masumoya),
    color: PARTS.masumoya.color,
  },
  sakamoya: {
    name: "さかもや",
    unit: "v07",
    note: "たしざんと ひきざんの かんけい。右うえに 右むき、左したに 左むきの やじるしが 1つずつ（いきと かえり）",
    svg: normalArt(PARTS.sakamoya),
    friendSvg: friendArt(PARTS.sakamoya),
    color: PARTS.sakamoya.color,
  },
  kufumoya: {
    name: "くふうもや",
    unit: "v08",
    note: "けいさんの くふう。ちいさめの まるい体が 少し 左下に より、右うえに ちいさな はぐるまが 1つ",
    svg: normalArt(PARTS.kufumoya),
    friendSvg: friendArt(PARTS.kufumoya),
    color: PARTS.kufumoya.color,
  },
};

export const MOYA_ORDER_G2 = [
  "hyoumoya",
  "hissanmoya",
  "kurisagemoya",
  "monosashimoya",
  "senmoya",
  "masumoya",
  "sakamoya",
  "kufumoya",
];

export const MOYA_NAMES_G2 = Object.fromEntries(
  MOYA_ORDER_G2.map((id) => [id, MOYA_ART_G2[id].name]),
);

/* さんすうの moyaArt(id, mood, size) と 同じ使い方 */
export function moyaArtG2(id, mood = "normal", size = 100) {
  const a = MOYA_ART_G2[id] || MOYA_ART_G2.hyoumoya;
  const inner = mood === "friend" ? a.friendSvg : a.svg;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
}
