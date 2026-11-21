// 読み上げ。端末にもともと入っている声を使う（音声ファイルは置かない）。
// 声が無い端末もあるので、無ければボタンを隠す。読み上げが無くても解ける問題文にしている。

let voice = null;
let ready = false;
let enabled = true;

export function setEnabled(on) {
  enabled = !!on;
  if (!enabled) stop();
}

export function isEnabled() {
  return enabled;
}

export function available() {
  return ready && !!window.speechSynthesis;
}

export function init() {
  if (!window.speechSynthesis) return false;
  const pick = () => {
    const voices = window.speechSynthesis.getVoices() || [];
    voice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("ja")) || null;
    ready = !!voice;
    document.dispatchEvent(new CustomEvent("speech-ready", { detail: ready }));
  };
  pick();
  window.speechSynthesis.addEventListener?.("voiceschanged", pick);
  return ready;
}

export function stop() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* 失敗しても困らない */
  }
}

export function say(text) {
  if (!enabled || !available()) return;
  try {
    stop();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = "ja-JP";
    u.rate = 0.9;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  } catch {
    /* 読み上げが失敗してもゲームは続ける */
  }
}
