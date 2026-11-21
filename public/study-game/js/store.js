// 保存と読み込み。端末の中（localStorage）だけ。どこにも送らない。
// ★キーの名前は変えない。形を変えるときは新しいキーを作り、古いキーから読んで移す。
import { dayKey, toast } from "./util.js";
import { MAT_ORDER, DEFAULT_MINUTES } from "./content.js";

const K_META = "sg:meta";
const K_SETTINGS = "sg:settings";
const K_TEACHER = "sg:teacher";
export const MAX_SLOTS = 6;
const SCHEMA = 1;

let warnedWrite = false;

function readRaw(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    if (!warnedWrite) {
      warnedWrite = true;
      toast("きろくを ほぞんできません。せんせいを よんでね", 4000);
    }
    return false;
  }
}

/** 読み込みは必ず try/catch と形の検査を通す。おかしければ退避して初期値で起動する。 */
function readJSON(key, fallback, check) {
  const raw = readRaw(key);
  if (raw == null) return structuredClone(fallback);
  try {
    const value = JSON.parse(raw);
    if (check && !check(value)) throw new Error("形が ちがう");
    return value;
  } catch {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    writeRaw(`sg:broken:${stamp}:${key}`, raw);
    return structuredClone(fallback);
  }
}

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

/* ================= 既定の形 ================= */
const DEF_META = { schemaVersion: SCHEMA, slots: [] };
// autoSpeak（じどう読み上げ）は はじめ オフ。教室で30台が いっせいに鳴るのを さけるため。
const DEF_SETTINGS = { sound: true, speech: true, autoSpeak: false, textSize: 1 };
const DEF_TEACHER = { pin: "", minutes: DEFAULT_MINUTES, classTimer: 0, unlockLevel: 0 };

function defProfile(no, faceIndex) {
  return { no, face: faceIndex, created: dayKey(), titles: [] };
}

function defProgress() {
  return {
    materials: { ki: 0, ishi: 0, glass: 0, nendo: 0 },
    buildings: {},
    friends: [],
    wears: [],
    wearing: "",
    unlockedUnits: ["u01"],
    teacherUnlock: 0,
  };
}

function defToday() {
  return {
    day: dayKey(),
    sec: 0,
    items: 0,
    ok: 0,
    mats: 0,
    stages: {},
    breakDone: false,
    newSkills: [],
    hardest: null,
    finished: false,
    built: [],
  };
}

/* ================= いま開いている子のデータ ================= */
export const state = {
  slot: 0,
  profile: null,
  progress: null,
  srs: null,
  days: null,
  today: null,
  settings: readJSON(K_SETTINGS, DEF_SETTINGS, isObj),
  teacher: readJSON(K_TEACHER, DEF_TEACHER, isObj),
};

export function meta() {
  return readJSON(K_META, DEF_META, (v) => isObj(v) && Array.isArray(v.slots));
}

export function listSlots() {
  return meta().slots.filter((s) => s && typeof s.slot === "number");
}

function saveMeta(m) {
  writeRaw(K_META, JSON.stringify(m));
}

const pk = (slot, name) => `sg:p${slot}:${name}`;

export function createSlot(no, faceIndex) {
  const m = meta();
  if (m.slots.length >= MAX_SLOTS) return 0;
  const used = new Set(m.slots.map((s) => s.slot));
  let slot = 1;
  while (used.has(slot)) slot++;
  m.schemaVersion = SCHEMA;
  m.slots.push({ slot, no, face: faceIndex, updated: dayKey() });
  saveMeta(m);
  writeRaw(pk(slot, "profile"), JSON.stringify(defProfile(no, faceIndex)));
  writeRaw(pk(slot, "progress"), JSON.stringify(defProgress()));
  writeRaw(pk(slot, "srs"), JSON.stringify({}));
  writeRaw(pk(slot, "days"), JSON.stringify([]));
  writeRaw(pk(slot, "today"), JSON.stringify(defToday()));
  return slot;
}

export function openSlot(slot) {
  state.slot = slot;
  state.profile = readJSON(pk(slot, "profile"), defProfile(1, 0), isObj);
  state.progress = readJSON(pk(slot, "progress"), defProgress(), isObj);
  state.srs = readJSON(pk(slot, "srs"), {}, isObj);
  state.days = readJSON(pk(slot, "days"), [], Array.isArray);
  state.today = readJSON(pk(slot, "today"), defToday(), isObj);

  // 形のたしかめ（足りないものは足す。既にあるものは消さない）
  const p = state.progress;
  if (!isObj(p.materials)) p.materials = { ki: 0, ishi: 0, glass: 0, nendo: 0 };
  for (const m of MAT_ORDER) if (typeof p.materials[m] !== "number") p.materials[m] = 0;
  if (!isObj(p.buildings)) p.buildings = {};
  if (!Array.isArray(p.friends)) p.friends = [];
  if (!Array.isArray(p.wears)) p.wears = [];
  if (!Array.isArray(p.unlockedUnits) || !p.unlockedUnits.length) p.unlockedUnits = ["u01"];
  if (!Array.isArray(state.profile.titles)) state.profile.titles = [];

  // 日がかわっていたら、きのうの分をまとめて days に入れる
  const today = dayKey();
  if (state.today.day !== today) {
    if (state.today.items > 0) {
      state.days.push({
        d: state.today.day,
        items: state.today.items,
        ok: state.today.ok,
        newSkills: state.today.newSkills || [],
      });
      if (state.days.length > 60) state.days = state.days.slice(-60);
    }
    state.today = defToday();
  }
  saveNow();
}

/* ================= 書き込み（1秒まとめ） ================= */
let timer = 0;
const dirty = new Set();

export function save(...what) {
  (what.length ? what : ["profile", "progress", "srs", "days", "today"]).forEach((w) => dirty.add(w));
  clearTimeout(timer);
  timer = setTimeout(saveNow, 1000);
}

export function saveNow() {
  clearTimeout(timer);
  if (!state.slot) {
    writeRaw(K_SETTINGS, JSON.stringify(state.settings));
    writeRaw(K_TEACHER, JSON.stringify(state.teacher));
    dirty.clear();
    return;
  }
  const all = dirty.size ? [...dirty] : ["profile", "progress", "srs", "days", "today"];
  for (const name of all) {
    const value = state[name];
    if (value == null) continue;
    writeRaw(pk(state.slot, name), JSON.stringify(value));
  }
  writeRaw(K_SETTINGS, JSON.stringify(state.settings));
  writeRaw(K_TEACHER, JSON.stringify(state.teacher));
  const m = meta();
  const row = m.slots.find((s) => s.slot === state.slot);
  if (row) {
    row.updated = dayKey();
    row.no = state.profile.no;
    row.face = state.profile.face;
    saveMeta(m);
  }
  dirty.clear();
}

export function saveSettings() {
  writeRaw(K_SETTINGS, JSON.stringify(state.settings));
}

export function saveTeacher() {
  writeRaw(K_TEACHER, JSON.stringify(state.teacher));
}

/** せんせいモードだけ：この枠の記録を消す */
export function deleteSlot(slot) {
  const m = meta();
  m.slots = m.slots.filter((s) => s.slot !== slot);
  saveMeta(m);
  for (const name of ["profile", "progress", "srs", "days", "today"]) {
    try {
      localStorage.removeItem(pk(slot, name));
    } catch {
      /* 消せなくても進む */
    }
  }
  if (state.slot === slot) state.slot = 0;
}

/** 書き出し用（先生・保護者が紙に残すため） */
export function exportJSON() {
  return JSON.stringify(
    {
      app: "kazunomachi",
      schemaVersion: SCHEMA,
      exported: new Date().toISOString().slice(0, 10),
      profile: { no: state.profile?.no, face: state.profile?.face, titles: state.profile?.titles },
      progress: state.progress,
      srs: state.srs,
      days: state.days,
    },
    null,
    1,
  );
}

export function importJSON(text) {
  const data = JSON.parse(text);
  if (!data || data.app !== "kazunomachi" || !isObj(data.progress)) {
    throw new Error("この ファイルは つかえません");
  }
  state.progress = data.progress;
  state.srs = isObj(data.srs) ? data.srs : {};
  state.days = Array.isArray(data.days) ? data.days : [];
  if (isObj(data.profile)) {
    state.profile.titles = Array.isArray(data.profile.titles) ? data.profile.titles : [];
  }
  saveNow();
}
