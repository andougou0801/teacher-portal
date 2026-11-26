// 町・ざいりょう・みにつけるもの・称号の決まり。
// ★ここの数（コストや上限）は1年間かえない。かえると「あとから急に遠くなった」になるため。

export const MATERIALS = {
  ki: { name: "き", color: "#C98A4B" },
  ishi: { name: "いし", color: "#9AA3AD" },
  glass: { name: "ガラス", color: "#7FD4E8" },
  nendo: { name: "ねんど", color: "#E0A98C" },
};

export const MAT_ORDER = ["ki", "ishi", "glass", "nendo"];

/** 1回（15分）でもらえるざいりょうの上限。年間かえない。 */
export const DAILY_MATERIAL_CAP = 12;

/** 1日のめやすの時間（分）。せんせいモードでだけ差しかえられる。 */
export const DEFAULT_MINUTES = 15;

export const POWERS = {
  count: "かぞえるちから",
  compare: "くらべるちから",
  shape: "かたちのちから",
  read: "よみとくちから",
  word: "ことばのちから",
  write: "かくちから",
};

export const BUILDINGS = [
  { id: "kazunoie", name: "かずのいえ", unit: "u01", shape: "house", mat: "ki", cost: 12, x: 12, y: 50 },
  { id: "narabinomichi", name: "ならびのもん", unit: "u02", shape: "gate", mat: "ki", cost: 14, x: 34, y: 48 },
  { id: "wakekkohouse", name: "わけっこハウス", unit: "u03", shape: "twinhouse", mat: "ishi", cost: 16, x: 56, y: 50 },
  { id: "shirabeyagura", name: "しらべやぐら", unit: "u08", shape: "tower", mat: "glass", cost: 20, x: 80, y: 46 },
  // ことばのまち（こくご）。はたけ・たんぼ・おみせ が ひらいていく
  { id: "hatake", name: "はたけ", unit: "j01", shape: "field", mat: "ki", cost: 12, x: 12, y: 50 },
  { id: "tanbo", name: "たんぼ", unit: "j02", shape: "paddy", mat: "ki", cost: 14, x: 34, y: 48 },
  { id: "yaoya", name: "やおや", unit: "j03", shape: "shop", mat: "ki", cost: 16, x: 56, y: 50 },
  { id: "butai", name: "おはなしのぶたい", unit: "j08", shape: "stage", mat: "glass", cost: 20, x: 80, y: 46 },
  { id: "bungu", name: "ぶんぼうぐや", unit: "j04", shape: "pencilshop", mat: "ishi", cost: 18, x: 12, y: 76 },
  { id: "yubin", name: "ゆうびんきょく", unit: "j05", shape: "post", mat: "ishi", cost: 20, x: 35, y: 78 },
  { id: "toshoshitsu", name: "としょしつ", unit: "j06", shape: "library", mat: "nendo", cost: 16, x: 58, y: 78 },
  { id: "ishibumi", name: "いしぶみ", unit: "j07", shape: "monument", mat: "nendo", cost: 18, x: 80, y: 74 },
  // ことばのまちの おくの だん（国語2学期の8棟）
  { id: "katanoie", name: "かたかなのいえ", unit: "j09", shape: "house", mat: "ki", cost: 14, x: 7, y: 33 },
  { id: "fudenoyakata", name: "ふでのやかた", unit: "j10", shape: "pencilshop", mat: "ki", cost: 16, x: 19, y: 33 },
  { id: "minatonokura", name: "みなとのくら", unit: "j11", shape: "granary", mat: "glass", cost: 18, x: 31, y: 33 },
  { id: "kanjinomon", name: "かんじのもん", unit: "j12", shape: "gate", mat: "ishi", cost: 20, x: 43, y: 33 },
  { id: "morinoyakata", name: "もりのやかた", unit: "j13", shape: "waterhouse", mat: "nendo", cost: 18, x: 55, y: 33 },
  { id: "aisatsunomichi", name: "あいさつのみち", unit: "j14", shape: "bridge", mat: "ishi", cost: 16, x: 67, y: 33 },
  { id: "shiorinoie", name: "しおりのいえ", unit: "j15", shape: "library", mat: "nendo", cost: 18, x: 79, y: 33 },
  { id: "monogatarinoniwa", name: "ものがたりのにわ", unit: "j16", shape: "plaza", mat: "glass", cost: 20, x: 91, y: 33 },
  // ことばのまちの まんなかの だん（国語3学期の6棟）
  { id: "kanjinohiroba", name: "かんじのひろば", unit: "j17", shape: "spire", mat: "ishi", cost: 20, x: 10, y: 60 },
  { id: "asobinohiroba", name: "あそびのひろば", unit: "j18", shape: "easel", mat: "ki", cost: 14, x: 26, y: 60 },
  { id: "tsunaginohashi", name: "つなぎのはし", unit: "j19", shape: "pathway", mat: "ishi", cost: 16, x: 42, y: 60 },
  { id: "kurabenoyagura", name: "くらべのやぐら", unit: "j20", shape: "abacus", mat: "glass", cost: 18, x: 58, y: 60 },
  { id: "mukashinoyado", name: "むかしのやど", unit: "j21", shape: "workshop", mat: "nendo", cost: 16, x: 74, y: 60 },
  { id: "tabidachinomon", name: "たびだちのもん", unit: "j22", shape: "archgate", mat: "glass", cost: 22, x: 90, y: 60 },
  // ===== 2年の かずのまち（1学期の8棟）。学年ごとに 地区が かわる =====
  { id: "shirabenoyakata", name: "しらべのやかた", unit: "v01", shape: "library", mat: "nendo", cost: 16, x: 12, y: 50 },
  { id: "hissankoubou", name: "ひっさんこうぼう", unit: "v02", shape: "factory", mat: "ki", cost: 18, x: 34, y: 48 },
  { id: "hikizanyagura", name: "ひきざんやぐら", unit: "v03", shape: "tower", mat: "ishi", cost: 18, x: 56, y: 50 },
  { id: "monosashinotou", name: "ものさしのとう", unit: "v04", shape: "lighthouse", mat: "glass", cost: 20, x: 80, y: 46 },
  { id: "sennokura", name: "せんのくら", unit: "v05", shape: "granary", mat: "nendo", cost: 20, x: 12, y: 76 },
  { id: "masunoie", name: "ますのいえ", unit: "v06", shape: "waterhouse", mat: "glass", cost: 18, x: 35, y: 78 },
  { id: "ikikaerinohashi", name: "いきかえりのはし", unit: "v07", shape: "bridge", mat: "ishi", cost: 16, x: 58, y: 78 },
  { id: "kufunokoubou", name: "くふうのこうぼう", unit: "v08", shape: "workshop", mat: "ki", cost: 18, x: 80, y: 74 },
  { id: "tasizankoujou", name: "たしざんこうじょう", unit: "u04", shape: "factory", mat: "ki", cost: 20, x: 12, y: 76 },
  { id: "hikizansouko", name: "ひきざんそうこ", unit: "u05", shape: "barn", mat: "ishi", cost: 20, x: 35, y: 78 },
  { id: "zeronoizumi", name: "ゼロのいずみ", unit: "u06", shape: "well", mat: "nendo", cost: 14, x: 58, y: 78 },
  { id: "hakarinotou", name: "はかりのとう", unit: "u07", shape: "lighthouse", mat: "glass", cost: 18, x: 80, y: 74 },
  // ★2学期は まちの おくの だんだん（おかの 上）に たつ。
  //   手前の 列が うまってから おくが ふえるので、まちが そだって 見える。
  { id: "mitsubashi", name: "みっつばし", unit: "u09", shape: "bridge", mat: "ki", cost: 14, x: 7, y: 33 },
  { id: "mizunoie", name: "みずのいえ", unit: "u10", shape: "waterhouse", mat: "glass", cost: 16, x: 19, y: 33 },
  { id: "noborinotou", name: "のぼりのとう", unit: "u11", shape: "uptower", mat: "ishi", cost: 20, x: 31, y: 33 },
  { id: "katachihiroba", name: "かたちのひろば", unit: "u12", shape: "plaza", mat: "ki", cost: 16, x: 43, y: 33 },
  { id: "kudarinomon", name: "くだりのもん", unit: "u13", shape: "downgate", mat: "ishi", cost: 20, x: 55, y: 33 },
  { id: "tounokura", name: "とおのくら", unit: "u14", shape: "granary", mat: "nendo", cost: 18, x: 67, y: 33 },
  { id: "tokeidai", name: "とけいだい", unit: "u15", shape: "clocktower", mat: "glass", cost: 20, x: 79, y: 33 },
  { id: "michishirube", name: "みちしるべ", unit: "u16", shape: "signpost", mat: "ki", cost: 12, x: 91, y: 33 },
  // ★3学期は まちの まんなかの あき地（おくの だんと 手前の だんの あいだ）に たつ。
  //   3学期は みじかいので 6棟。
  { id: "hyakunotou", name: "ひゃくのとう", unit: "u17", shape: "spire", mat: "glass", cost: 20, x: 10, y: 60 },
  { id: "ketanokoya", name: "けたのこや", unit: "u18", shape: "abacus", mat: "ki", cost: 16, x: 26, y: 60 },
  { id: "zunohiroba", name: "ずのひろば", unit: "u19", shape: "easel", mat: "nendo", cost: 16, x: 42, y: 60 },
  { id: "narabinohiroba", name: "ならびのこみち", unit: "u20", shape: "pathway", mat: "ishi", cost: 18, x: 58, y: 60 },
  { id: "itanokoubou", name: "いたのこうぼう", unit: "u21", shape: "workshop", mat: "ki", cost: 16, x: 74, y: 60 },
  { id: "omoidenomon", name: "おもいでのもん", unit: "u22", shape: "archgate", mat: "glass", cost: 22, x: 90, y: 60 },
];

export const WEARS = [
  { id: "hat", name: "ぼうし", need: 2 },
  { id: "ribbon", name: "リボン", need: 4 },
  { id: "glasses", name: "めがね", need: 6 },
  { id: "scarf", name: "マフラー", need: 8 },
  { id: "badge", name: "バッジ", need: 11 },
  { id: "mantle", name: "マント", need: 14 },
  { id: "crown", name: "かんむり", need: 17 },
  { id: "stick", name: "つえ", need: 20 },
];

/** 称号は「できるようになったこと」の名前にする（速さや順位では出さない） */
export const TITLES = [
  { id: "t-count", name: "かぞえの たつじん", unit: "u01" },
  { id: "t-order", name: "ならびの めいじん", unit: "u02" },
  { id: "t-split", name: "わけっこ はかせ", unit: "u03" },
  { id: "t-add", name: "たしざん たいしょう", unit: "u04" },
  { id: "t-sub", name: "ひきざん たいしょう", unit: "u05" },
  { id: "t-zero", name: "ゼロの ものがたり", unit: "u06" },
  { id: "t-length", name: "ながさ みつけびと", unit: "u07" },
  { id: "t-graph", name: "しらべの たんていと", unit: "u08" },
  { id: "t-three", name: "みっつの たつじん", unit: "u09" },
  { id: "t-kasa", name: "かさくらべ めいじん", unit: "u10" },
  { id: "t-up", name: "くりあがり たいしょう", unit: "u11" },
  { id: "t-shape", name: "かたち みつけびと", unit: "u12" },
  { id: "t-down", name: "くりさがり たいしょう", unit: "u13" },
  { id: "t-big", name: "おおきいかず はかせ", unit: "u14" },
  { id: "t-clock", name: "とけい めいじん", unit: "u15" },
  { id: "t-place", name: "みちしるべ づくり", unit: "u16" },
  { id: "t-hyaku", name: "ひゃくの たつじん", unit: "u17" },
  { id: "t-keta", name: "けたの めいじん", unit: "u18" },
  { id: "t-zu", name: "ずの かんがえびと", unit: "u19" },
  { id: "t-retsu", name: "ならびの はかせ", unit: "u20" },
  { id: "t-ita", name: "かたちづくり めいじん", unit: "u21" },
  { id: "t-ichinen", name: "1ねんせいの そつぎょう", unit: "u22" },
  { id: "t-kata", name: "かたかな めいじん", unit: "j09" },
  { id: "t-fude", name: "ふでじゅんの たつじん", unit: "j10" },
  { id: "t-gai", name: "ことばの たびびと", unit: "j11" },
  { id: "t-kanji1", name: "かんじ みならい", unit: "j12" },
  { id: "t-kanji2", name: "かんじ はかせ", unit: "j13" },
  { id: "t-teinei", name: "ていねいな はなしびと", unit: "j14" },
  { id: "t-sagasi", name: "だいじな ことば さがし", unit: "j15" },
  { id: "t-monogatari", name: "おはなしの ともだち", unit: "j16" },
  { id: "t-kanji3", name: "かんじ めいじん", unit: "j17" },
  { id: "t-asobi", name: "ことばあそび たつじん", unit: "j18" },
  { id: "t-tsunagi", name: "ぶんの しくみびと", unit: "j19" },
  { id: "t-kurabe", name: "くらべる よみて", unit: "j20" },
  { id: "t-mukashi", name: "むかしばなしの かたりべ", unit: "j21" },
  { id: "t-sotsu", name: "ことばの たびだち", unit: "j22" },
  { id: "t-hyou", name: "しらべの めいじん", unit: "v01" },
  { id: "t-hissan", name: "ひっさん たつじん", unit: "v02" },
  { id: "t-hiki2", name: "くりさがり はかせ", unit: "v03" },
  { id: "t-nagasa2", name: "ものさしの つかいて", unit: "v04" },
  { id: "t-sen", name: "せんまでの かぞえびと", unit: "v05" },
  { id: "t-masu", name: "かさの めいじん", unit: "v06" },
  { id: "t-saka", name: "いきかえりの かんがえびと", unit: "v07" },
  { id: "t-kufu", name: "くふうの たつじん", unit: "v08" },
];

export const buildingByUnit = (unitId) => BUILDINGS.find((b) => b.unit === unitId);
export const buildingById = (id) => BUILDINGS.find((b) => b.id === id);

/** 「ばっちりおぼえた」の数から星の数を出す（2つで1つ星、5つまで） */
export function starsFor(masteredCount, total) {
  if (!total) return Math.max(0, Math.min(5, Math.floor(masteredCount / 2)));
  return Math.max(0, Math.min(5, Math.round((5 * masteredCount) / total)));
}
