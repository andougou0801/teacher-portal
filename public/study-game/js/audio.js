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

export const sfx = {
  tap() {
    tone(880, 0, 0.04, "sine", 0.5);
  },
  /** 連続正解で音階が1つずつ上がる（自分の積み上げの音） */
  correct() {
    const i = Math.min(streak, SCALE.length - 1);
    tone(SCALE[i], 0, 0.09, "triangle", 0.8);
    tone(SCALE[i] * 1.5, 0.07, 0.1, "sine", 0.4);
    streak = Math.min(streak + 1, SCALE.length - 1);
  },
  /** まちがいは下げない。小さく短い音だけ */
  again() {
    tone(330, 0, 0.12, "sine", 0.35);
    streak = 0;
  },
  item() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.055, 0.1, "triangle", 0.6));
  },
  levelup() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.07, 0.16, "triangle", 0.7));
    tone(130.81, 0, 0.3, "sine", 0.5);
  },
  henshin() {
    noise(0, 0.12, 1200);
    tone(220, 0.04, 0.14, "sawtooth", 0.3);
  },
  build() {
    [392, 523.25, 659.25].forEach((f, i) => tone(f, i * 0.12, 0.26, "triangle", 0.6));
  },
  close() {
    tone(440, 0, 0.07, "sine", 0.4);
    tone(330, 0.06, 0.09, "sine", 0.3);
  },
};

export function resetStreak() {
  streak = 0;
}
