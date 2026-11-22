// ひらがなの「なぞり書き」（指で なぞる）
//
// ★考え方
//   手書きの字を 読みとって ○×を つけるのは、この作りでは できない
//   （外へ 通信しない・オフラインで動く、という きまりのため）。
//   まちがって ×に されるのは、1年生に いちばん よくない。
//   そこで「お手本の上を、筆順どおりに なぞれたか」だけを 見る。
//   通る点（チェックポイント）を 順に 通れば できあがり。これなら まちがえない。
//
// ★見た目
//   うすい お手本の字（端末のフォント）＋ 通る点 ＋ なぞった線。
//   100×100 の ます目で 考え、画面の 大きさに あわせて のびちぢみする。

/** 点を どれだけ はずれても よいか（100のうち） */
const HIT = 15;

/**
 * 筆順のデータ。
 * strokes[i] = その画の「通る点」。①から じゅんに 通る。
 * 座標は 100×100（左上が 0,0）。
 */
// 筆順のデータは hiragana-strokes.js（ひらがな46字）に ある。
// strokes[i] = その画の「通る点」。①から じゅんに 通る。座標は 100×100。
export const TRACE_CHARS = HIRAGANA_STROKES;

import { HIRAGANA_STROKES } from "./hiragana-strokes.js";

const SVG_NS = "http://www.w3.org/2000/svg";

/** 点を なめらかに つないだ線（お手本に つかう） */
function smoothPath(points) {
  if (!points.length) return "";
  if (points.length === 1) return `M${points[0].x} ${points[0].y}`;
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const p = points[i];
    const mx = (prev.x + p.x) / 2;
    const my = (prev.y + p.y) / 2;
    d += `Q${prev.x} ${prev.y} ${mx} ${my}`;
  }
  const last = points[points.length - 1];
  d += `L${last.x} ${last.y}`;
  return d;
}

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

/**
 * なぞり書きを 1文字ぶん 動かす。
 * @param {HTMLElement} mount ここに 入れる
 * @param {string} char 「あ」など
 * @param {(ok:boolean)=>void} onDone ぜんぶ なぞれたら よばれる
 * @returns {() => void} かたづける関数
 */
export function runTrace(mount, char, onDone) {
  const data = TRACE_CHARS[char];
  mount.innerHTML = "";
  if (!data) {
    onDone(false);
    return () => {};
  }

  const wrap = document.createElement("div");
  wrap.className = "trace-pad";
  const svg = svgEl("svg", { viewBox: "0 0 100 100", class: "trace-svg" });

  // ます目（じゅうじせん）
  svg.appendChild(
    svgEl("rect", { x: 2, y: 2, width: 96, height: 96, rx: 6, fill: "#FFFDF6", stroke: "#D9CDB6", "stroke-width": 1.2 }),
  );
  for (const d of ["M50 4V96", "M4 50H96"]) {
    svg.appendChild(svgEl("path", { d, stroke: "#E4D9C4", "stroke-width": 1, "stroke-dasharray": "4 4" }));
  }

  // お手本は「通る点」から 描く。
  // ★端末の フォントで 字を 出すと、iPadと パソコンで かたちが ちがい、
  //   点の ばしょと ずれてしまう。だから お手本も 同じ データから 作る。
  for (const stroke of data.strokes) {
    svg.appendChild(
      svgEl("path", {
        d: smoothPath(stroke),
        fill: "none",
        stroke: "#E5DAC6",
        "stroke-width": 9,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
    );
  }

  // なぞった線（画ごと）
  const inkLayer = svgEl("g", {});
  svg.appendChild(inkLayer);
  // 通る点
  const dotLayer = svgEl("g", {});
  svg.appendChild(dotLayer);

  let strokeIndex = 0;
  let hitIndex = 0;
  let drawing = false;
  let current = null;
  let points = [];

  const paintDots = () => {
    dotLayer.innerHTML = "";
    const stroke = data.strokes[strokeIndex];
    if (!stroke) return;
    stroke.forEach((p, i) => {
      const done = i < hitIndex;
      dotLayer.appendChild(
        svgEl("circle", {
          cx: p.x,
          cy: p.y,
          r: i === hitIndex ? 5.2 : 3.4,
          fill: done ? "#5BBF6A" : i === hitIndex ? "#FF7A45" : "#FFFFFF",
          stroke: "#2B2A28",
          "stroke-width": 1.4,
        }),
      );
    });
    // はじめの点に ①
    if (hitIndex === 0) {
      const p = stroke[0];
      const label = svgEl("text", {
        x: p.x,
        y: p.y - 8,
        "font-size": 9,
        "text-anchor": "middle",
        fill: "#2B2A28",
        "font-weight": "700",
      });
      label.textContent = String(strokeIndex + 1);
      dotLayer.appendChild(label);
    }
  };

  const toSvg = (ev) => {
    const r = svg.getBoundingClientRect();
    return {
      x: ((ev.clientX - r.left) / r.width) * 100,
      y: ((ev.clientY - r.top) / r.height) * 100,
    };
  };

  const startStroke = (p) => {
    drawing = true;
    points = [p];
    current = svgEl("polyline", {
      fill: "none",
      stroke: "#4FA3E3",
      "stroke-width": 6,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      points: `${p.x},${p.y}`,
    });
    inkLayer.appendChild(current);
  };

  const resetStroke = () => {
    drawing = false;
    hitIndex = 0;
    if (current) current.remove();
    current = null;
    points = [];
    paintDots();
  };

  const onDown = (ev) => {
    if (strokeIndex >= data.strokes.length) return;
    const p = toSvg(ev);
    const first = data.strokes[strokeIndex][0];
    // はじめの点の ちかくから 始めること（どこから でも 始められると 筆順にならない）
    if (Math.hypot(p.x - first.x, p.y - first.y) > HIT + 4) return;
    svg.setPointerCapture?.(ev.pointerId);
    hitIndex = 1;
    startStroke(p);
    paintDots();
  };

  const onMove = (ev) => {
    if (!drawing) return;
    const p = toSvg(ev);
    points.push(p);
    current.setAttribute("points", points.map((q) => `${q.x},${q.y}`).join(" "));
    const stroke = data.strokes[strokeIndex];
    const next = stroke[hitIndex];
    if (next && Math.hypot(p.x - next.x, p.y - next.y) <= HIT) {
      hitIndex++;
      paintDots();
      if (hitIndex >= stroke.length) {
        // この画は おわり
        drawing = false;
        current.setAttribute("stroke", "#2B2A28");
        current = null;
        strokeIndex++;
        hitIndex = 0;
        paintDots();
        if (strokeIndex >= data.strokes.length) {
          setTimeout(() => onDone(true), 120);
        }
      }
    }
  };

  const onUp = () => {
    if (!drawing) return;
    // とちゅうで 指を はなしたら、その画だけ やり直し（しかられない）
    resetStroke();
  };

  svg.addEventListener("pointerdown", onDown);
  svg.addEventListener("pointermove", onMove);
  svg.addEventListener("pointerup", onUp);
  svg.addEventListener("pointercancel", onUp);
  svg.addEventListener("pointerleave", onUp);

  wrap.appendChild(svg);
  mount.appendChild(wrap);
  paintDots();

  return () => {
    svg.removeEventListener("pointerdown", onDown);
    svg.removeEventListener("pointermove", onMove);
    svg.removeEventListener("pointerup", onUp);
    svg.removeEventListener("pointercancel", onUp);
    svg.removeEventListener("pointerleave", onUp);
  };
}
