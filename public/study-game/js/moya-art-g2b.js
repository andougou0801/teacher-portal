/* ============================================================
   かずのまち ／ 2年 さんすう 2学期の もやもや 8体
   ------------------------------------------------------------
   ・決まりは これまでの 7ファイル（moya-art.js／moya-art-jp.js／
     moya-art-m2.js／moya-art-m3.js／moya-art-jp2.js／moya-art-jp3.js／
     moya-art-g2.js）と まったく 同じ。
     100×100、<path> <circle> <ellipse> <rect> だけ、輪郭 #2B2A28 の 2.5〜3、
     filter / mask / gradient / <g> は つかわない。ぜんぶ 自分で 考えた かたち。
     実在の キャラクターや 有名ゲームの てきには 似せていない。
     こわい顔には しない（目は まるく、口は まっすぐか にっこり。
     やられる役なので、かわいそうに 見える 顔にも しない）。

   ・【既存53体は こういう形】
       さんすう1学期12 … まんまる(r28)＋ぼんぼり／ひらたい楕円が たてに3つ／
         ふたこぶ／上がデコボコ4つ／右が まるく 欠けた丸＋目1つ／ドーナツ／
         よこ長カプセル(rx15)＋上べりに 目もり4本／高さちがいの ぼう3本が 体／
         かどの まるい さんかく／角丸四角(56×52)＋ベル耳2つ＋おなかに 小さい とけい／
         下が ほそまる コップ＋とって＋波線／よこ広たまご(rx29)＋リボン
       こくご1学期8 … たて長たまご＋はねの尾／ふだ3枚＋ひも／大きい楕円＋
         小さい子分／つぶ3つの三つ葉／丸(r26)＋てんの尾＋かぎかっこ／
         3つの玉が よこに よりそう／ふきだし／かいだん3だん
       さんすう2学期5 … 玉3つを ぼうに 通した たて／しずく＋上むき矢＋右上の白玉／
         右へ かたむいた板＋下むき矢／つぶ12こ そのものが 体／右が とがった 矢じるし
       さんすう3学期6 … たて長角丸(44×70)＋中に つぶ12こ(よこ4×たて3)／
         たて2本の はしら＋帯／よこ長の帯(84×42)＋くぎり線＋テープ図／
         ちいさい体4つが 手つなぎ／ひしがた4まいの いろいた／
         いちばん 大きい まる(r33)＋輪＋＋−○△＋よこ手2つ
       こくご2学期8 … かどが とがった10かくけい／たて長の ふで／ふねの どう＋ほ／
         四角い はんこ(60×58・rx5・上に つまみ・白い 二重わく)／2だんの もみの木／
         ななめの たまご＋かさねた手／ドーム＋レンズ／ひらいた 本
       こくご3学期6 … まちの スカイライン／まるい体2つが ななめに かさなる／
         よこに 角丸ブロック2つ＋ぼう／てんびん＋ぶら下がる玉2つ／
         よこに ひらいた まきもの／まる(r30)＋もじの しるし
       2年1学期8 … ます目の四角(68×46)＋上へ ぼう3本／たて2だん＋はみ出す よこ線1本／
         まん中が くびれた I がた／たて長の ものさし(28×74)＋はり／
         よこ長の 楕円(rx40・もも色)＋たて くぎり線2本＋つぶ 9こ3こ1この 3かたまり／
         かど四角の ます＋上の ふち＋まっすぐな 水面／よこ長角丸＋左右へ はみ出す
         やじるし2本／ちいさい まる(r24)が 左下より＋右うえに はぐるま

   ・【自分は こう変えた（かぶらせない ための めも）】
       jikanmoya     … まるい体（r30）そのものが とけいの 文字ばん。おなかの 下に
                       まん中の ピンが あって、そこから はりが 2本。
                       みじかい はりは ふとい さんかくで 左下（体の 中）に、
                       長い はりは ほそい さんかくで 右へ のびて、体から
                       11pxほど 外に とび出す。ふちに 白い めもりが 3本。
                       ★とけいもや（1年・角丸四角 56×52・ベル耳が 2つ・うす黄緑・
                       とけいは おなかに ついた 小さい まるの しるし）とは
                       ちがって、こちらは「体ぜんたいが とけい」で、形は まる、
                       色は こい青。はりが 外へ とび出すので 48pxでも
                       シルエットで わかる。
                       ★まとめもや（r33・うすい 輪＋＋−○△＋よこ手2つ）とは、
                       輪を 入れず はりと ピンだけに して 見分けられるように した。
                       かずもや（r28・真上に ぼんぼり）とも 頭の 出っぱりで ちがう。
       katachi2moya  … さんかくと しかくが くっついた体。左下に かど四角の
                       四角（46×44）、右うえに さんかく（はば48・たかさ46）。
                       さんかくは わざと soft色で ぬって 2色に した。
                       さんかくの かど3つに ちいさな ● が ついている（ちょう点）。
                       顔は 四角の ほうに ある（左より）。
                       ★かたちもや（1年・かどの まるい さんかく 1つだけ・
                       うす黄・おなかに ○と□の しるし）とは ちがって、こちらは
                       さんかくと しかくが 2つ くっついた ひとつの体で、
                       左右 非対しょう。いたもや（3学期・ひしがた＋さんかくの
                       いろいた4まい・左右対しょう・青緑）とも、かたちの 数が
                       2つだけ・顔が 左より という ところで ちがう。
       chokkakumoya  … きっちりした 正方形（58×58）。rx を つけず かどを
                       とがらせた（ほかの 四角い子は みんな rx が ついている）。
                       4つの かどの 内がわに ちょっかくの しるし（┐の 形）が
                       1つずつ。下はんぶんに 白い 長方形の わくが 1つ。
                       ★かんじもや（はんこ・60×58・rx5・頭に つまみ・白い
                       二重わく・赤）とは、頭の つまみが なく、かどが とがり、
                       しるしが「かどの ちょっかく4つ＋長方形1つ」な ところで
                       ちがう。色も 赤 → むらさき。
                       ★ひょうもや（v01・68×46 の よこ長・上へ ぼうが 3本
                       はみ出す・青緑）とは、たてよこが 同じ 正方形で、
                       上に 何も はみ出さない ところで ひと目で ちがう。
       kakemoya      … ちいさい 頭（34×26）＋よこに 広い おなか（74×44）の
                       2段がまえ。おなかに おなじ 大きさの 白い つぶ（r5）が
                       たて3 よこ4 で 12こ ならぶ。
                       ★ひゃくもや（3学期・たて長 44×70・青・つぶ r3.4 が
                       よこ4×たて3・頭の 上に つぶ1つ）と ならびが 同じなので、
                         ①体を たて長 → よこ長に かえ（74×44）
                         ②つぶを ずっと 大きく して（r3.4→r5）おなか いっぱいに し
                         ③顔を 体の 上では なく べつの ちいさい 頭に うつした
                       （＝頭と どうが はっきり わかれた シルエット）。
                       ★ひっさんもや（v02・たて2だん・はば48と48・はみ出す
                       よこ線）とは、下が ずっと 広く（74）て よこ線が ない
                       ところで ちがう。
                       ★くくもや（v13）とは「まるい つぶ12こ」対「四角い
                       ます目の こうし」で 分けた。
       kukumoya      … 九九の ひょうが そのまま 体。四角い体（64×62・rx3）の
                       下 3分の2が ます目で、ふとい 見出し線（よこ1本・たて1本）
                       ＋ほそい こうし（よこ3本・たて3本）＝4×4の ます。
                       ます 1つだけ 白く ぬってある（こたえの ます）。
                       体の 右べりから ます 1つぶんが はみ出して いて（13×13）、
                       「ひょうが まだ つづく」ように 見える。
                       ★ひょうもや（v01）とは、ます目が 下はんぶんだけでは なく
                       こうし じょうたいで こまかく、上に ぼうが なく、
                       かわりに 右べりに ます1つが はみ出す ところで ちがう。
                       色も 青緑 → 空色。
                       ★かけもや（v12）とは つぶ（まるい）／ます目（四角い）で ちがう。
       kimarimoya    … 左右 対しょうの よこ長 六かくけい（左右が とがり、
                       上と 下は まっすぐ）。まん中に 白い たての 点線（鏡の線）。
                       左の へやは つぶが たて2×よこ3、右の へやは たて3×よこ2。
                       ＝ひっくりかえしても 同じ かず、という きまりを
                       体の 形（対しょう）と つぶの ならびで 見せている。
                       ★かたもや（こくご2学期・かどが とがった 10かくけい・
                       上が とがる・青緑）とは、かどが 6つで 上と 下が
                       まっすぐ、色が きみどり という ところで ちがう。
                       ★ずもや（よこ長の 帯 84×42・rx6）とは、左右が とがった
                       六かくけいで、まん中に 点線が ある ところで ちがう。
       manmoya       … いちばん 大きい体（82×68 の 角丸四角 rx12）。
                       白い ＋ の くぎり線（たて1本・よこ1本）で へやが 4つに
                       わかれ、つぶが 千・百・十・一 の 4かたまりに なっている。
                       千＝ちいさい つぶ6こ、百＝すこし大きい 4こ、
                       十＝もっと大きい 3こ、一＝いちばん大きい 1こ。
                       ★せんもや（v05）が いちばん あぶないので、はっきり 変えた：
                         ①形 … せんもや＝よこ長の 楕円（rx40 ry29・まるい）／
                           まんもや＝大きい 角丸四角（82×68・かくばっている）
                         ②くぎり … せんもや＝たての 線 2本だけ（へやが よこ3つ）／
                           まんもや＝たて1本＋よこ1本の ＋（へやが 2×2の 4つ）
                         ③色 … せんもや＝もも色 #A8508F（あかるい）／
                           まんもや＝こい もり色 #2E6B4F（くらい 緑）
                       48pxに しても「もも色の まるい よこ長」と
                       「こい緑の 大きい 四角に ＋」で すぐ 分かれる。
                       ★ひゃくもや（たて長 44×70・青・つぶ12こが ぜんぶ 同じ
                       大きさ）とは たてよこ・くぎり線・色で ちがう。
                       ★おおかずもや（つぶ12こ そのものが 体・へりが ぷつぷつ・
                       うすい 緑）とは、へりが まっすぐな 四角で、つぶが
                       体の 中に ある ところで ちがう。
       oomoya        … たてに 3だんの 体（40×28／40×17／40×18）で、
                       あいだに よこ線が 2本（はば64）、体より 左右に 12pxずつ
                       はみ出す。2だんめに 白い つぶが 3こ、3だんめに 4こ。
                       ★ひっさんもや（v02）は 2だんで よこ線が 1本、はばが 48の
                       ずんぐり、左うえに ＋の ふだ、色は もも色。
                       こちらは だんが 3つ・線が 2本・はばが 40の のっぽ・
                       ふだは なし・色は れんがいろ。だんと 線の 数が
                       そのまま ちがうので、48pxでも 数えられる。
                       ★かいだんもや（こくご1学期・かいだん3だん）は 右へ
                       ずれて 上がる 形。こちらは たてに まっすぐ つみ上がる
                       左右対しょうで、よこ線が 外へ はみ出す。
                       ★けたもや（はしらが よこに 2本）とは たて／よこで ちがう。

   ・なかまの姿（friendSvg）の 見分けかたも これまでと 同じ4点：
       ①もやのつぶで浮く → かげの上に あし2本で立つ
       ②白目＋黒目 → とじた にこにこ目
       ③口が まっすぐ → にっこり
       ④頭に はっぱの め ＋ ほお ＋ きらきら
   ============================================================ */

const INK = "#2B2A28";

/* ---------- 共通のパーツ（これまでの7ファイルと 同じもの） ---------- */

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

/* よこ×たて に ならぶ まるい つぶ。
   つぶが 大きい ときは 輪郭も ふとくしたいので sw を 足した */
function dotGrid(xs, ys, r, fill, sw = 1.6) {
  let out = "";
  for (const y of ys) {
    for (const x of xs) {
      out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="${sw}"/>`;
    }
  }
  return out;
}

/* ---------- 8体のパーツ表 ---------- */
/* topBefore … 体より先に描く／body … 体／mark … しるし／topAfter … 体より後に描く */

const PARTS = {
  /* v09 時こくと 時間
     － まるい体が そのまま とけいの 文字ばん。おなかの 下の ピンから
       みじかい ふとい はりと、長い ほそい はりが 2本 のびる */
  jikanmoya: {
    color: "#3A5FA8",
    soft: "#B0C4E6",
    topBefore: "",
    body: `<circle cx="50" cy="52" r="30" fill="#3A5FA8" stroke="${INK}" stroke-width="3"/>`,
    /* ★はじめは はりを 白い ふとい 線（stroke）で かいたが、長い はりが
       体の 外に 出た ところで ページの 地色と 同じに なって 消えたので、
       さかもや（v07）の やじるしと 同じように
       「fill は 白・輪郭は INK の 三角」に した。これで 外に 出ても 見える。
       ★ピンを おなかの まん中（y=56くらい）に 置いたら、口の すぐ下から
       はりが 出て「した」に 見えたので、ピンを y=64 まで 下げ、
       顔を 上に 上げて 18pxの あきを 作った。 */
    mark:
      `<path d="M22 52h6M72 52h6M50 75v5" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M45 58 36 76 57 66z" fill="#FFF4E2" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="M48 60 88 68 50 69z" fill="#FFF4E2" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
      `<circle cx="50" cy="64" r="3.2" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[40, 36, 5.2], [60, 36, 5.2]],
    mouth: [50, 46],
    cheek: [[28, 45], [72, 45]],
    sproutAt: [50, 22],
    feet: [40, 60],
    feetY: 88,
  },

  /* v10 三角形と 四角形
     － 左下に かど四角の しかく、右うえに さんかく。2つが くっついた体。
       さんかくは soft色、しかくは 本体色の 2色づかい */
  katachi2moya: {
    color: "#D97A2B",
    soft: "#F2C79E",
    topBefore: "",
    body:
      `<rect x="10" y="40" width="46" height="44" rx="3" fill="#D97A2B" stroke="${INK}" stroke-width="3"/>` +
      `<path d="M69 16 92 62H46z" fill="#F2C79E" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
    /* ★はじめは さんかくも 本体色に して、しかくの 中に ○ と □ の しるしを
       入れたが、それだと かたちもや（1年・さんかく＋○□の しるし）に
       そっくりに なったので、
         ①さんかくを soft色に して 2色の「くっついた 2つの かたち」に 見せ
         ②しるしは やめて、さんかくの ちょう点に ● を 3つ だけ 置いた。
       ★さんかくの 下べりを x=46 まで のばして、しかくの 右うえに 10pxほど
       かさねた。はじめは 2pxしか かさねておらず、くっついて 見えなかった。 */
    mark:
      `<circle cx="69" cy="25" r="2.6" fill="${INK}"/>` +
      `<circle cx="86" cy="57" r="2.6" fill="${INK}"/>` +
      `<circle cx="52" cy="57" r="2.6" fill="${INK}"/>`,
    eyes: [[24, 56, 5], [41, 56, 5]],
    mouth: [32, 68],
    cheek: [[17, 66], [47, 67]],
    sproutAt: [69, 16],
    feet: [24, 46],
    feetY: 90,
  },

  /* v11 正方形と 長方形
     － きっちりした 正方形（58×58）。rx を つけないので かどが とがる。
       4つの かどに ちょっかくの しるし、下に 長方形の わく 1つ */
  chokkakumoya: {
    color: "#8C5EA8",
    soft: "#D4BCE6",
    topBefore: "",
    /* ★rx を わざと 書いていない。ほかの 四角い子（ひょうもや rx4／
       かんじもや rx5／ますもや rx2／くくもや rx3）は みんな かどが
       すこし まるいので、かどが とがって いる ことが この子の しるしに なる。 */
    body: `<rect x="21" y="22" width="58" height="58" fill="#8C5EA8" stroke="${INK}" stroke-width="3"/>`,
    /* ★長方形の わくを はば44で 書いたら、下の かどの ちょっかくの しるしと
       くっついて 1つの かたまりに 見えたので はば36に ちぢめた。 */
    mark:
      `<path d="M29 22V30H21M71 22V30H79M29 80V72H21M71 80V72H79" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linejoin="round"/>` +
      `<rect x="32" y="62" width="36" height="12" fill="none" stroke="#FFF4E2" stroke-width="2.6"/>`,
    eyes: [[38, 40, 5.2], [62, 40, 5.2]],
    mouth: [50, 51],
    cheek: [[29, 50], [71, 50]],
    sproutAt: [50, 22],
    feet: [40, 60],
    feetY: 88,
  },

  /* v12 かけ算（1）
     － ちいさい 頭＋よこに 広い おなか。おなかに おなじ 大きさの
       つぶが たて3 よこ4 で 12こ */
  kakemoya: {
    color: "#D9485E",
    soft: "#F4B4BE",
    topBefore: "",
    body:
      `<rect x="13" y="40" width="74" height="44" rx="10" fill="#D9485E" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="33" y="16" width="34" height="26" rx="11" fill="#D9485E" stroke="${INK}" stroke-width="3"/>`,
    /* ★ひゃくもや（たて長・つぶ よこ4×たて3）と ならびが まったく 同じなので、
       つぶを r3.4 → r5 に 大きく して おなか いっぱいに ならべ、
       体を よこ長に して、顔は べつの ちいさい 頭に うつした。
       これで 48pxでも「頭＋よこ長の どうに 大きい つぶ12こ」に 見える。 */
    mark: dotGrid([26, 42, 58, 74], [51, 63, 75], 5, "#FFF4E2", 2),
    eyes: [[42, 26, 4.4], [58, 26, 4.4]],
    mouth: [50, 35],
    cheek: [[36, 34], [64, 34]],
    sproutAt: [50, 16],
    feet: [38, 62],
    feetY: 90,
    drop: 3,
  },

  /* v13 かけ算（2）
     － 九九の ひょうが そのまま 体。ふとい 見出し線＋ほそい こうしで
       4×4の ます目。右べりから ます1つが はみ出す */
  kukumoya: {
    color: "#4F93C9",
    soft: "#B8D8EE",
    topBefore: "",
    body:
      `<rect x="18" y="20" width="64" height="62" rx="3" fill="#4F93C9" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="79" y="60" width="16" height="13" rx="2" fill="#4F93C9" stroke="${INK}" stroke-width="2.5"/>`,
    /* ★ます目を 体 ぜんたいに ひろげると 顔が ます目の 上に のって
       よめなく なったので、上 3分の1は 顔、下 3分の2を ひょうに した。
       見出し線（よこ1本・たて1本）だけ ふとく して、
       「ただの ます目」では なく「ひょう」に 見えるように した。
       ★右べりから ます1つを はみ出させた のは、ひょうもや（v01）と
       シルエットで 分けるため（ひょうもやは 上に ぼうが 3本 出る）。 */
    mark:
      `<path d="M20 48h60M34 48v34" fill="none" stroke="#FFF4E2" stroke-width="3.2"/>` +
      `<path d="M34 57h46M34 66h46M34 74h46" fill="none" stroke="#FFF4E2" stroke-width="2"/>` +
      `<path d="M46 48v34M58 48v34M70 48v34" fill="none" stroke="#FFF4E2" stroke-width="2"/>` +
      `<rect x="58" y="57" width="12" height="9" fill="#FFF4E2"/>` +
      `<circle cx="87" cy="66" r="3" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[38, 33, 5.2], [62, 33, 5.2]],
    mouth: [50, 43],
    cheek: [[28, 42], [72, 42]],
    sproutAt: [50, 20],
    feet: [40, 60],
    feetY: 88,
    drop: 2,
  },

  /* v14 かけ算の きまり
     － 左右 対しょうの よこ長 六かくけい。まん中に 鏡の 点線。
       左は つぶ たて2×よこ3、右は たて3×よこ2 */
  kimarimoya: {
    color: "#8FBF2F",
    soft: "#D6E8A8",
    topBefore: "",
    body: `<path d="M28 26H72L88 54 72 82H28L12 54z" fill="#8FBF2F" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
    /* ★「ひっくりかえしても おなじ」を 見せたいので、体の 形は きっちり
       左右 対しょうに した（左右が とがった 六かくけい）。
       つぶは 左が 2だん×3れつ、右が 3だん×2れつ。かずは どちらも 6こ。
       まん中の 点線は 鏡の 線。
       ★はじめは 左右で おなじ ならびに したが、それだと ただの
       「つぶが ある子」で、きまりの いみが 出なかったので、
       たてよこを 入れかえた ならびに した。 */
    mark:
      `<path d="M50 55v25" fill="none" stroke="#FFF4E2" stroke-width="2.8" stroke-dasharray="4 4"/>` +
      dotGrid([28, 37, 46], [63, 74], 3, "#FFF4E2", 2) +
      dotGrid([57, 66], [58, 68, 78], 3, "#FFF4E2", 2),
    eyes: [[41, 40, 5.2], [59, 40, 5.2]],
    mouth: [50, 50],
    cheek: [[30, 49], [70, 49]],
    sproutAt: [50, 26],
    feet: [38, 62],
    feetY: 88,
  },

  /* v15 10000までの かず
     － いちばん 大きい 角丸四角（82×68）。白い ＋ の くぎり線で へやが
       4つに わかれ、つぶが 千・百・十・一 の 4かたまり */
  manmoya: {
    color: "#2E6B4F",
    soft: "#A8CFB8",
    topBefore: "",
    body: `<rect x="9" y="16" width="82" height="68" rx="12" fill="#2E6B4F" stroke="${INK}" stroke-width="3"/>`,
    /* ★せんもや（v05・もも色の よこ長の 楕円・たての くぎり線 2本・
       つぶが 9こ3こ1この 3かたまり）が いちばん あぶない。
       48pxで ならべて 確かめたうえで、こう 分けた：
         ①形   … 楕円（まるい）→ 大きい 角丸四角（かくばっている）
         ②くぎり… たて2本（へや よこ3つ）→ たて1本＋よこ1本の ＋（へや 2×2）
         ③色   … もも色 #A8508F → こい もり色 #2E6B4F
       つぶの 大きさは 千＜百＜十＜一 と だんだん 大きく して、
       4つの かたまりが べつもの だと わかるように した。 */
    mark:
      `<path d="M50 50V81M14 66H86" fill="none" stroke="#FFF4E2" stroke-width="3"/>` +
      dotGrid([22, 31, 40], [55, 61], 2.4, "#FFF4E2") +
      dotGrid([61, 72], [55, 61], 3, "#FFF4E2", 1.8) +
      dotGrid([25, 34, 43], [74], 3.6, "#FFF4E2", 2) +
      `<circle cx="68" cy="74" r="5.2" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[39, 31, 5.5], [61, 31, 5.5]],
    mouth: [50, 42],
    cheek: [[24, 41], [76, 41]],
    sproutAt: [50, 16],
    feet: [38, 62],
    feetY: 90,
    drop: 2,
  },

  /* v16 大きい かずの けいさん
     － たてに 3だんの 体。あいだに よこ線が 2本、左右へ はみ出す */
  oomoya: {
    color: "#B8623F",
    soft: "#E8BCA8",
    topBefore: "",
    body:
      `<rect x="30" y="10" width="40" height="28" rx="9" fill="#B8623F" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="18" y="38" width="64" height="5" rx="2.5" fill="#B8623F" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="30" y="43" width="40" height="17" rx="8" fill="#B8623F" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="18" y="60" width="64" height="5" rx="2.5" fill="#B8623F" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="30" y="65" width="40" height="18" rx="8" fill="#B8623F" stroke="${INK}" stroke-width="3"/>`,
    /* ★ひっさんもや（v02）は 2だん＋よこ線1本。こちらは 3だん＋よこ線2本。
       だんの はばを 48 → 40 に ほそく して、ずんぐりでは なく のっぽに し、
       左うえの ＋の ふだは 付けなかった（あれは ひっさんもやの しるし）。
       つぶは 2だんめに 3こ、3だんめに 4こ。
       口の すぐ下に つぶを 置くと「は」に 見えるので、
       つぶは だんの まん中に おいて 口から はなした。 */
    mark:
      dotGrid([38, 50, 62], [51], 3.2, "#FFF4E2", 2) +
      dotGrid([36, 45, 54, 63], [74], 3.2, "#FFF4E2", 2),
    eyes: [[41, 22, 4.8], [59, 22, 4.8]],
    mouth: [50, 30],
    cheek: [[35, 30], [65, 30]],
    sproutAt: [50, 10],
    feet: [38, 62],
    feetY: 90,
    drop: 2,
  },
};

/* ---------- 組み立て（これまでの7ファイルと 同じ） ---------- */

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
   2年 さんすう 2学期の もやもや 8体
   ============================================================ */
export const MOYA_ART_G2B = {
  jikanmoya: {
    name: "じかんもや",
    unit: "v09",
    note: "時こくと 時間。まるい体ぜんたいが とけいの 文字ばんで、みじかい ふとい はりと 長い ほそい はりが 2本。長い はりは 右へ とび出す",
    svg: normalArt(PARTS.jikanmoya),
    friendSvg: friendArt(PARTS.jikanmoya),
    color: PARTS.jikanmoya.color,
  },
  katachi2moya: {
    name: "かたちもや2",
    unit: "v10",
    note: "三角形と 四角形。左下の しかくと 右うえの さんかくが くっついた体。さんかくは うすい色で、かど3つに 点が つく",
    svg: normalArt(PARTS.katachi2moya),
    friendSvg: friendArt(PARTS.katachi2moya),
    color: PARTS.katachi2moya.color,
  },
  chokkakumoya: {
    name: "ちょっかくもや",
    unit: "v11",
    note: "正方形と 長方形。かどが とがった きっちりした 正方形の体。4つの かどに ちょっかくの しるし、下に 長方形の わく",
    svg: normalArt(PARTS.chokkakumoya),
    friendSvg: friendArt(PARTS.chokkakumoya),
    color: PARTS.chokkakumoya.color,
  },
  kakemoya: {
    name: "かけもや",
    unit: "v12",
    note: "かけ算（1）。ちいさい 頭と よこに 広い おなか。おなじ 大きさの つぶが たて3 よこ4 で 12こ ならぶ",
    svg: normalArt(PARTS.kakemoya),
    friendSvg: friendArt(PARTS.kakemoya),
    color: PARTS.kakemoya.color,
  },
  kukumoya: {
    name: "くくもや",
    unit: "v13",
    note: "かけ算（2）。九九の ひょうが そのまま 体。見出し線と こうしの ます目で、右べりから ます1つが はみ出す",
    svg: normalArt(PARTS.kukumoya),
    friendSvg: friendArt(PARTS.kukumoya),
    color: PARTS.kukumoya.color,
  },
  kimarimoya: {
    name: "きまりもや",
    unit: "v14",
    note: "かけ算の きまり。左右 対しょうの 六かくけいの体。まん中の 点線の 左は つぶが たて2よこ3、右は たて3よこ2",
    svg: normalArt(PARTS.kimarimoya),
    friendSvg: friendArt(PARTS.kimarimoya),
    color: PARTS.kimarimoya.color,
  },
  manmoya: {
    name: "まんもや",
    unit: "v15",
    note: "10000までの かず。いちばん 大きい こい緑の 四角い体。白い ＋ の くぎり線で へやが 4つに わかれ、つぶが 千・百・十・一 の 4かたまり",
    svg: normalArt(PARTS.manmoya),
    friendSvg: friendArt(PARTS.manmoya),
    color: PARTS.manmoya.color,
  },
  oomoya: {
    name: "おおもや",
    unit: "v16",
    note: "大きい かずの けいさん。たてに 3だんの体で、あいだの よこ線が 2本 左右に はみ出す",
    svg: normalArt(PARTS.oomoya),
    friendSvg: friendArt(PARTS.oomoya),
    color: PARTS.oomoya.color,
  },
};

export const MOYA_ORDER_G2B = [
  "jikanmoya",
  "katachi2moya",
  "chokkakumoya",
  "kakemoya",
  "kukumoya",
  "kimarimoya",
  "manmoya",
  "oomoya",
];

export const MOYA_NAMES_G2B = Object.fromEntries(
  MOYA_ORDER_G2B.map((id) => [id, MOYA_ART_G2B[id].name]),
);

/* さんすうの moyaArt(id, mood, size) と 同じ使い方 */
export function moyaArtG2b(id, mood = "normal", size = 100) {
  const a = MOYA_ART_G2B[id] || MOYA_ART_G2B.jikanmoya;
  const inner = mood === "friend" ? a.friendSvg : a.svg;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
}
