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
  { id: "tasizankoujou", name: "たしざんこうじょう", unit: "u04", shape: "factory", mat: "ki", cost: 20, x: 12, y: 76 },
  { id: "hikizansouko", name: "ひきざんそうこ", unit: "u05", shape: "barn", mat: "ishi", cost: 20, x: 35, y: 78 },
  { id: "zeronoizumi", name: "ゼロのいずみ", unit: "u06", shape: "well", mat: "nendo", cost: 14, x: 58, y: 78 },
  { id: "hakarinotou", name: "はかりのとう", unit: "u07", shape: "lighthouse", mat: "glass", cost: 18, x: 80, y: 74 },
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
];

export const buildingByUnit = (unitId) => BUILDINGS.find((b) => b.unit === unitId);
export const buildingById = (id) => BUILDINGS.find((b) => b.id === id);

/** 「ばっちりおぼえた」の数から星の数を出す（2つで1つ星、5つまで） */
export function starsFor(masteredCount, total) {
  if (!total) return Math.max(0, Math.min(5, Math.floor(masteredCount / 2)));
  return Math.max(0, Math.min(5, Math.round((5 * masteredCount) / total)));
}
