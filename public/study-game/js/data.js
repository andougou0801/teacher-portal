// 問題データの読み込み。単元のJSONは「入る直前」に読む（初回の読み込みを軽くするため）。
// 問題を足すときは data/units/ にJSONを置き、manifest.json に1行足すだけでよい。

const V = "1";
let manifest = null;
const unitCache = new Map();

export async function loadManifest() {
  if (manifest) return manifest;
  const res = await fetch(`data/manifest.json?v=${V}`, { cache: "no-cache" });
  if (!res.ok) throw new Error("manifest が よめません");
  manifest = await res.json();
  return manifest;
}

/** いま作っている範囲（小1・算数・1学期） */
export function course() {
  const list = manifest?.grades || [];
  return list.find((g) => g.grade === 1 && g.subject === "math" && g.term === 1) || list[0] || { units: [] };
}

export function units() {
  return [...(course().units || [])].sort((a, b) => a.order - b.order);
}

export function unitMeta(unitId) {
  return units().find((u) => u.unitId === unitId) || null;
}

/** スキルの順番は固定（セーブコードでこの順に詰めるため、順番を変えない） */
export function allSkills() {
  const out = [];
  for (const u of units()) {
    for (const s of u.skills || []) out.push({ ...s, unitId: u.unitId });
  }
  return out;
}

export function skillMeta(skillId) {
  return allSkills().find((s) => s.id === skillId) || null;
}

export async function loadUnit(unitId) {
  if (unitCache.has(unitId)) return unitCache.get(unitId);
  const meta = unitMeta(unitId);
  if (!meta) throw new Error(`しらない単元: ${unitId}`);
  const res = await fetch(`data/${meta.file}?v=${V}`, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${unitId} が よめません`);
  const data = await res.json();
  // 知らない type の問題は、その1問だけ外す（残りは遊べる）
  const known = new Set(["choice", "input", "order"]);
  data.items = (data.items || []).filter((it) => known.has(it.type) && Array.isArray(it.prompt));
  unitCache.set(unitId, data);
  return data;
}

/** その単元・そのスキル・そのレベルに近い問題を集める */
export function pickItems(unit, { skill, level, count, exclude = new Set() }) {
  const pool = unit.items.filter(
    (it) => (!skill || it.skill === skill) && !exclude.has(it.id),
  );
  if (!pool.length) return [];
  const score = (it) => Math.abs((it.level || 1) - level);
  const sorted = [...pool].sort((a, b) => score(a) - score(b));
  // 同じ近さの中では順番をまぜる（毎回同じ並びにしない）
  const groups = new Map();
  for (const it of sorted) {
    const key = score(it);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(it);
  }
  const out = [];
  for (const key of [...groups.keys()].sort((a, b) => a - b)) {
    const g = groups.get(key);
    for (let i = g.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [g[i], g[j]] = [g[j], g[i]];
    }
    out.push(...g);
    if (out.length >= count) break;
  }
  return out.slice(0, count);
}
