// セーブコード（むかしのゲームの「ふっかつのじゅもん」のようなもの）。
// 端末がかわったとき、これだけで進みぐあいをもどせる。
// ・入れるのは進みぐあいだけ。なまえ・まちがいの記録は入れない
// ・読みまちがえにくい32文字（I L O U を使わない）
// ・さいごの1文字はチェック文字（打ちまちがいに気づけるように）
// ・小1には打てないので、使うのは先生か おうちの人
import { state, save } from "./store.js";
import { BUILDINGS, MAT_ORDER } from "./content.js";
import { allSkills } from "./data.js";
import { dayKey, addDays } from "./util.js";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // I L O U を入れない
const VERSION = 1;

class BitWriter {
  constructor() {
    this.bits = [];
  }
  put(value, width) {
    const v = Math.max(0, Math.min(value | 0, (1 << width) - 1));
    for (let i = width - 1; i >= 0; i--) this.bits.push((v >> i) & 1);
  }
  bytes() {
    const out = [];
    for (let i = 0; i < this.bits.length; i += 8) {
      let b = 0;
      for (let k = 0; k < 8; k++) b = (b << 1) | (this.bits[i + k] || 0);
      out.push(b);
    }
    return out;
  }
}

class BitReader {
  constructor(bytes) {
    this.bits = [];
    for (const b of bytes) for (let i = 7; i >= 0; i--) this.bits.push((b >> i) & 1);
    this.pos = 0;
  }
  get(width) {
    let v = 0;
    for (let i = 0; i < width; i++) v = (v << 1) | (this.bits[this.pos++] || 0);
    return v;
  }
}

function crc8(bytes) {
  let crc = 0;
  for (const b of bytes) {
    crc ^= b;
    for (let i = 0; i < 8; i++) crc = crc & 0x80 ? ((crc << 1) ^ 0x07) & 0xff : (crc << 1) & 0xff;
  }
  return crc;
}

function toBase32(bytes) {
  const w = new BitWriter();
  for (const b of bytes) w.put(b, 8);
  let out = "";
  for (let i = 0; i < w.bits.length; i += 5) {
    let v = 0;
    for (let k = 0; k < 5; k++) v = (v << 1) | (w.bits[i + k] || 0);
    out += ALPHABET[v];
  }
  return out;
}

function fromBase32(text) {
  const bits = [];
  for (const ch of text) {
    const v = ALPHABET.indexOf(ch);
    if (v < 0) continue;
    for (let i = 4; i >= 0; i--) bits.push((v >> i) & 1);
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let b = 0;
    for (let k = 0; k < 8; k++) b = (b << 1) | bits[i + k];
    bytes.push(b);
  }
  return bytes;
}

/** 打ちまちがえやすい文字を直す（小文字・O→0 など） */
function normalize(text) {
  return String(text)
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1")
    .replace(/U/g, "V");
}

export function makeCode() {
  const w = new BitWriter();
  const p = state.progress;
  w.put(VERSION, 4);
  w.put(state.profile?.face || 0, 3);
  w.put(state.profile?.no || 1, 6);
  for (const b of BUILDINGS) w.put(p.buildings?.[b.id]?.built ? 1 : 0, 1);
  for (const b of BUILDINGS) w.put((p.friends || []).includes(b.unit) ? 1 : 0, 1);
  const wearsOrder = ["hat", "ribbon", "glasses", "scarf", "badge", "mantle", "crown", "stick"];
  for (const id of wearsOrder) w.put((p.wears || []).includes(id) ? 1 : 0, 1);
  for (const m of MAT_ORDER) w.put(Math.min(127, p.materials?.[m] || 0), 7);
  w.put(p.teacherUnlock || 0, 4);
  const skills = allSkills();
  w.put(Math.min(63, skills.length), 6);
  for (const s of skills) w.put(Math.min(5, state.srs?.[s.id]?.stage || 0), 3);
  const bytes = w.bytes();
  bytes.push(crc8(bytes));
  const code = toBase32(bytes);
  return code.match(/.{1,4}/g).join("-");
}

export function readCode(text) {
  const clean = normalize(text);
  if (clean.length < 8) throw new Error("コードが みじかすぎます");
  const bytes = fromBase32(clean);
  if (bytes.length < 2) throw new Error("コードが よめません");
  const check = bytes.pop();
  if (crc8(bytes) !== check) throw new Error("コードが ちがうようです。もう一度 たしかめてね");
  const r = new BitReader(bytes);
  const ver = r.get(4);
  if (ver !== VERSION) throw new Error("この コードは あたらしい ばんごうです");
  const face = r.get(3);
  const no = r.get(6);
  const p = state.progress;
  const built = BUILDINGS.map(() => r.get(1));
  const friends = BUILDINGS.map(() => r.get(1));
  const wearsOrder = ["hat", "ribbon", "glasses", "scarf", "badge", "mantle", "crown", "stick"];
  const wears = wearsOrder.map(() => r.get(1));
  const mats = MAT_ORDER.map(() => r.get(7));
  const teacherUnlock = r.get(4);
  const n = r.get(6);
  const skills = allSkills();
  const stages = [];
  for (let i = 0; i < n; i++) stages.push(r.get(3));

  state.profile.face = face;
  state.profile.no = no || state.profile.no;
  p.buildings = {};
  BUILDINGS.forEach((b, i) => {
    if (built[i]) p.buildings[b.id] = { built: true, color: 0, anim: true };
  });
  p.friends = BUILDINGS.filter((b, i) => friends[i]).map((b) => b.unit);
  p.wears = wearsOrder.filter((id, i) => wears[i]);
  p.wearing = p.wears[p.wears.length - 1] || "";
  MAT_ORDER.forEach((m, i) => {
    p.materials[m] = mats[i];
  });
  p.teacherUnlock = teacherUnlock;
  state.srs = state.srs || {};
  skills.forEach((s, i) => {
    if (i >= stages.length) return;
    const stage = stages[i];
    const cur = state.srs[s.id];
    state.srs[s.id] = {
      lv: cur?.lv || Math.max(1, Math.min(5, stage + 1)),
      stage,
      // ★「つぎに出す日」を 空のままに しない。空だと 復習に 一度も 出てこなくなる。
      due: cur?.due || (stage > 0 ? addDays(dayKey(), 1) : ""),
      seen: cur?.seen || stage * 2,
      ok: cur?.ok || stage * 2,
      last5: cur?.last5 || 0,
      first: cur?.first || "",
      upDay: "",
    };
  });
  save();
  return { no, face };
}
