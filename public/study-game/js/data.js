// 問題データの読み込み。単元のJSONは「入る直前」に読む（初回の読み込みを軽くするため）。
// 問題を足すときは data/units/ にJSONを置き、manifest.json に1行足すだけでよい。

const V = "7";
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

/**
 * ある教科・ある学年の単元（順番どおり）。
 * ★manifest は 学期ごとに かたまりが 分かれている。
 *   前は さいしょの かたまり（1学期の8単元）しか 見ていなかったので、
 *   ふつうに あそぶと **u09 から さきが 永久に ひらかなかった**。
 *   学期を またいで ひとつながりに する。
 */
export function units(subject = "math", grade = null) {
  const out = [];
  for (const c of courses()) {
    if (c.subject !== subject) continue;
    if (grade != null && c.grade !== grade) continue;
    for (const u of c.units || []) out.push({ ...u, grade: c.grade, term: c.term });
  }
  return out.sort((a, b) => a.grade - b.grade || a.order - b.order);
}

/** この ゲームに 入っている 学年（小さい順） */
export function grades() {
  return [...new Set(courses().map((c) => c.grade))].sort((a, b) => a - b);
}

/** ぜんぶの教科の単元（さんすう → こくご の順。セーブコードの順番にも つかう） */
export function allUnits() {
  const out = [];
  for (const c of courses()) {
    for (const u of [...(c.units || [])].sort((x, y) => x.order - y.order)) {
      out.push({ ...u, subject: c.subject, grade: c.grade, term: c.term });
    }
  }
  return out;
}

/** その教科に 単元が あるか（学年を わたすと その学年だけ 見る） */
export function availableSubjects(grade = null) {
  const out = [];
  for (const c of courses()) {
    if (!(c.units || []).length) continue;
    if (grade != null && c.grade !== grade) continue;
    if (!out.includes(c.subject)) out.push(c.subject);
  }
  return out;
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
