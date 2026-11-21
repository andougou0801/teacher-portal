// 音は Web Audio API で作る（音源ファイルは置かない）。
// iPadでは「最初のタップの中で」AudioContext を作らないと鳴らないので、
// unlock() を最初のタップから呼ぶ。

let ctx = null;
let master = null;
let enabled = true;
let streak = 0;

const SCALE = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];

export function setEnabled(on) {
  enabled = !!on;
  if (master) master.gain.value = enabled ? 0.25 : 0;
}

export function isEnabled() {
  return enabled;
}

export function unlock() {
  if (ctx) {
    if (ctx.state === "suspended") ctx.resume();
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  try {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = enabled ? 0.25 : 0;
    master.connect(ctx.destination);
  } catch {
    ctx = null;
  }
}

function tone(freq, start, dur, type = "sine", peak = 1) {
  if (!ctx || !enabled) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + start;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0005, t0 + dur);
  osc.connect(gain).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise(start, dur, cutoff = 800) {
  if (!ctx || !enabled) return;
  const len = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  const gain = ctx.createGain();
  gain.gain.value = 0.5;
  src.connect(filter).connect(gain).connect(master);
  src.start(ctx.currentTime + start);
}

// 音の決まり（サウンド担当）
// ・同時に鳴らすのは3音まで、1音は0.4秒以内（古い端末でも つまらないように）
// ・まちがいの音は 下げない（せめる音にしない）。低い大きな音も使わない
// ・連続正解の音は 上がりっぱなしに しない（耳が つかれるため、8回めからは 上の4音を まわす）
export const sfx = {
  tap() {
    tone(988, 0, 0.035, "sine", 0.4);
  },
  /** 連続正解で音階が1つずつ上がる（自分の積み上げの音） */
  correct() {
    const k = streak < 8 ? streak : 4 + ((streak - 8) % 4);
    const vol = streak < 12 ? 0.7 : 0.5;
    tone(SCALE[k], 0, 0.1, "triangle", vol);
    tone(SCALE[k] * 2, 0.02, 0.08, "sine", 0.15);
    if (streak > 0 && streak % 8 === 0) tone(2093, 0.05, 0.06, "sine", 0.12);
    streak++;
  },
  /** まちがいは下げない。やわらかく上がる2音だけ */
  again() {
    tone(392, 0, 0.14, "sine", 0.3);
    tone(494, 0.06, 0.14, "sine", 0.25);
    streak = 0;
  },
  item() {
    [659, 784, 988, 1319].forEach((f, i) => tone(f, i * 0.05, 0.09, "sine", 0.45));
  },
  levelup() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.07, 0.12, "triangle", 0.6));
    tone(1046.5, 0.21, 0.18, "sine", 0.4);
  },
  henshin() {
    noise(0, 0.1, 2000);
    [330, 494, 659].forEach((f, i) => tone(f, i * 0.07, 0.12, "triangle", 0.4));
  },
  build() {
    [392, 523.25, 659.25].forEach((f, i) => tone(f, i * 0.09, 0.13, "triangle", 0.6));
  },
  close() {
    tone(587, 0, 0.06, "sine", 0.3);
    tone(440, 0.05, 0.08, "sine", 0.25);
  },
  /** 町に入ったとき（1回だけ。ずっと鳴る環境音は 入れない） */
  start() {
    tone(523.25, 0, 0.08, "sine", 0.35);
    tone(784, 0.07, 0.1, "sine", 0.3);
    tone(2637, 0.18, 0.05, "sine", 0.1);
  },
  /** ヒントが出たとき */
  hint() {
    tone(587, 0, 0.08, "sine", 0.25);
    tone(740, 0.09, 0.1, "sine", 0.25);
  },
  /** きょうのぶんが おわったとき */
  goal() {
    [523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.08, 0.14, "triangle", 0.5));
    tone(1568, 0.2, 0.18, "sine", 0.2);
  },
};

export function resetStreak() {
  streak = 0;
}
