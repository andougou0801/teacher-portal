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

/** 教科ごとの かたまり（いまは さんすう と こくご） */
export function courses() {
  return manifest?.grades || [];
}

export function course(subject = "math") {
  const list = courses();
  return list.find((g) => g.subject === subject) || list[0] || { units: [] };
}

/** ある教科の単元（順番どおり）。教科を はぶくと さんすう */
export function units(subject = "math") {
  return [...(course(subject).units || [])].sort((a, b) => a.order - b.order);
}

/** ぜんぶの教科の単元（さんすう → こくご の順。セーブコードの順番にも つかう） */
export function allUnits() {
  const out = [];
  for (const c of courses()) {
    for (const u of [...(c.units || [])].sort((x, y) => x.order - y.order)) out.push({ ...u, subject: c.subject });
  }
  return out;
}

/** その教科に 単元が あるか */
export function availableSubjects() {
  return courses()
    .filter((c) => (c.units || []).length)
    .map((c) => c.subject);
}

export function unitMeta(unitId) {
  return allUnits().find((u) => u.unitId === unitId) || null;
}

/** スキルの順番は固定（セーブコードでこの順に詰めるため、順番を変えない） */
export function allSkills() {
  const out = [];
  for (const u of allUnits()) {
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
  const known = new Set(["choice", "input", "order", "trace"]);
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
