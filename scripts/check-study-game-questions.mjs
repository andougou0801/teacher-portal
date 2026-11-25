// 問題データの「中身」を機械で検査する。
//   形（漢字・行の長さ・答えの型）だけでなく、**計算が合っているか**も見る。
//
//   使い方： node scripts/check-study-game-questions.mjs [検査するJSON...]
//   引数なしのときは docs/study-game/questions/units/*.json を全部見る。
//   引数に { "u01": [ …items… ] } の形のファイルを渡すと、その中身だけ見る（追加分の下検査用）。
//
// ※ 人の目の代わりではありません。機械で確かめられるものだけを見ます。
//   確かめられなかった問題は「みのこし」として一覧に出すので、そこは人が読んでください。
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const unitDir = join(root, "docs", "study-game", "questions", "units");

const KANJI = /[一-鿿]/;
const TYPES = new Set(["choice", "input", "order", "trace"]);
// なぞり書きで つかえる字（筆順データに ある字だけ）
const TRACEABLE = new Set(
  readFileSync(join(root, "public", "study-game", "js", "hiragana-strokes.js"), "utf8")
    .split("\n")
    .map((line) => /^ {2}(\S): \{$/.exec(line))
    .filter(Boolean)
    .map((mm) => mm[1]),
);
const FIGS = new Set([
  "dots",
  "row",
  "tenframe",
  "two-groups",
  "take-away",
  "two-rows",
  "sticks",
  "clips",
  "graph",
  "numline",
  "clock",
  "cups",
  "vessels",
  "area",
  "solids",
  "place",
  "blocks10",
]);
const ICONS = new Set([
  "apple",
  "candy",
  "balloon",
  "star",
  "flower",
  "cat",
  "dog",
  "rabbit",
  "fish",
  "car",
  "clip",
]);
const ICON_NAME = {
  apple: "りんご",
  candy: "あめ",
  balloon: "ふうせん",
  star: "ほし",
  flower: "はな",
  cat: "ねこ",
  dog: "いぬ",
  rabbit: "うさぎ",
  fish: "さかな",
  car: "くるま",
};

const errors = [];
const warns = [];
const unchecked = [];

/** 問題文から「正しい答え」を計算できるか試す。できなければ null */
function expectedAnswer(item) {
  const text = item.prompt.join(" ");
  const f = item.figure || {};

  // 「9 + 1 + 3 は いくつ？」「10 - 9 + 3 は いくつ？」
  // 数が3つ以上ならんだ式は、左から順に計算する。
  // くりあがり・くりさがりの「まず10をつくる／10からひく」の2段の形がこれ。
  // ※ = のある式は、いちばん後ろの = より後ろだけを答えとして見る。
  const expr = text.includes("=") ? text.slice(text.lastIndexOf("=") + 1) : text;
  const chain = expr.match(/\d+(?:\s*[+\-−ー]\s*\d+){2,}/);
  if (chain) {
    const parts = chain[0].match(/\d+|[+\-−ー]/g);
    let v = Number(parts[0]);
    for (let i = 1; i < parts.length; i += 2) {
      v = parts[i] === "+" ? v + Number(parts[i + 1]) : v - Number(parts[i + 1]);
    }
    return v;
  }

  // 「3 + 4 は いくつ？」
  let m = text.match(/(\d+)\s*\+\s*(\d+)/);
  if (m) return Number(m[1]) + Number(m[2]);

  // 「8 - 3 は いくつ？」（全角マイナス・ハイフンの両方）
  m = text.match(/(\d+)\s*[-−ー]\s*(\d+)/);
  if (m) return Number(m[1]) - Number(m[2]);

  // 「10は 6と いくつ？」
  m = text.match(/(\d+)は\s*(\d+)と\s*いくつ/);
  if (m) return Number(m[1]) - Number(m[2]);

  // くらべる問題（「7と 4では どっちが おおい？」）は たし算ではない
  const isCompare = /どっち|どれ|おおい|すくない|ながい|みじかい|ちがい|より/.test(text);

  // 「3と 4で いくつ？」「3と 4を あわせると いくつ」
  if (!isCompare) {
    m = text.match(/(\d+)と\s*(\d+)(?:で\s*いくつ|で\s*なん|を\s*あわせ)/);
    if (m) return Number(m[1]) + Number(m[2]);
  }

  // 絵から数える（ものを数えるだけの問題）
  if (f.kind === "dots" && /いくつ|なんこ|なんびき|なんぼん|なんだい|なんまい/.test(text)) {
    return f.count;
  }
  if (f.kind === "tenframe" && /いくつ/.test(text) && /は/.test(text)) {
    return f.total - f.filled;
  }
  if (f.kind === "take-away" && /のこり/.test(text)) {
    return f.total - f.gone;
  }
  if (f.kind === "two-groups" && /あわせ|ぜんぶ|いくつ/.test(text)) {
    return f.a + f.b;
  }
  if (f.kind === "two-rows" && /ちがい/.test(text)) {
    return Math.abs(f.a - f.b);
  }
  // かさ（コップ なんばいぶん）と ひろさ（ます なんこぶん）。
  // どちらも 左が a（あか）、右が b（あお）。
  if ((f.kind === "cups" || f.kind === "area") && typeof f.a === "number" && typeof f.b === "number") {
    // 「あかは あおより ます なんこぶん ひろい？」のように、
    // 「より」と きいていたら どちらの ばあいも ちがいを きいている。
    if (/ちがい|より/.test(text)) return Math.abs(f.a - f.b);
    if (/あわせ|ぜんぶ/.test(text)) return f.a + f.b;
    // 「あかは なんばいぶん？」のように、どちらを きいているかが はっきりしているとき
    const asksA = /あかは|ひだりは/.test(text);
    const asksB = /あおは|みぎは/.test(text);
    if (asksA && !asksB) return f.a;
    if (asksB && !asksA) return f.b;
  }

  if (f.kind === "clips" && /なんこぶん|いくつぶん/.test(text)) {
    return f.count;
  }
  // えグラフは「○は いくつ」だけ検算できる。
  // 「ちがい」「○より いくつ おおい」は 2つの行を くらべるので ここでは見ない
  if (f.kind === "graph" && Array.isArray(f.rows) && !isCompare) {
    for (const r of f.rows) {
      const name = ICON_NAME[r.icon];
      if (name && text.includes(name) && /いくつ|なんびき|なんこ|なんぼん/.test(text)) {
        return r.count;
      }
    }
  }
  return null;
}

/**
 * その単元が 何学期か。
 * ★学期で 出してよい 数の 大きさが ちがう。
 *   1学期：和は10まで・数は20まで
 *   2学期：くりあがり/くりさがり（和は18まで）・数は100まで
 *   ここを 学期で 分けないと、2学期の 正しい問題まで エラーに なる。
 */
function termOf(unitId) {
  const n = Number(String(unitId).replace(/\D/g, "")) || 1;
  return n <= 8 ? 1 : 2;
}

function checkItem(unitId, item, skillIds, seenIds) {
  const where = `${unitId} ${item.id || "(idなし)"}`;
  const add = (msg) => errors.push(`${where}: ${msg}`);

  if (!item.id) add("id がない");
  else if (seenIds.has(item.id)) add(`id が重複している（${item.id}）`);
  else seenIds.add(item.id);

  if (!TYPES.has(item.type)) add(`しらない type「${item.type}」`);
  if (!(item.level >= 1 && item.level <= 5)) add(`level が 1〜5 でない（${item.level}）`);
  if (skillIds && item.skill && !skillIds.has(item.skill)) add(`しらない skill「${item.skill}」`);
  if (!item.skill) add("skill がない");

  if (!Array.isArray(item.prompt) || !item.prompt.length) {
    add("prompt が配列でない");
    return;
  }
  if (item.prompt.length > 2) add(`prompt が ${item.prompt.length}行（2行まで）`);
  for (const line of item.prompt) {
    if (KANJI.test(line)) add(`漢字が入っている「${line}」`);
    if ([...line].length > 24) warns.push(`${where}: 1行が長い(${[...line].length}字)「${line}」`);
  }
  if (/[×÷＜＞<>()（）]/.test(item.prompt.join(""))) add("つかえない記号が入っている");

  // 絵の形
  if (item.figure) {
    if (!FIGS.has(item.figure.kind)) add(`しらない figure.kind「${item.figure.kind}」`);
    const icons = [item.figure.icon, item.figure.iconA, item.figure.iconB]
      .concat((item.figure.icons || []), (item.figure.rows || []).map((r) => r.icon))
      .filter(Boolean);
    for (const ic of icons) if (!ICONS.has(ic)) add(`しらない icon「${ic}」`);
    if (item.figure.kind === "dots" && !(item.figure.count >= 0 && item.figure.count <= 20)) {
      add("dots の count が 0〜20 でない");
    }
  }

  // 答えの形
  if (item.type === "choice") {
    if (!Array.isArray(item.choices) || item.choices.length < 2) add("choices がない");
    else if (!(item.answer >= 0 && item.answer < item.choices.length)) add("answer が choices の外");
    const vals = item.choices.map((c) => (typeof c === "string" ? c : JSON.stringify(c)));
    if (new Set(vals).size !== vals.length) add("choices に同じものが2つある");
  } else if (item.type === "input") {
    if (!/^\d+$/.test(String(item.answer))) add("input の answer が数字でない");
  } else if (item.type === "trace") {
    // なぞり書きは 答えあわせを しない（筆順どおり なぞれたかだけ）。
    // そのかわり「筆順データの ない字」が 出ていないかを 見る。
    if (!item.char || [...item.char].length !== 1) add("trace の char が 1文字でない");
    else if (!TRACEABLE.has(item.char)) add(`筆順データに ない字「${item.char}」`);
  } else if (item.type === "order") {
    if (!Array.isArray(item.tokens) || !Array.isArray(item.answer)) add("tokens / answer がない");
    else {
      if (item.tokens.length !== item.answer.length) add("tokens と answer の数が合わない");
      const sorted = [...item.answer].sort((a, b) => a - b).join(",");
      if (sorted !== item.tokens.map((_, i) => i).join(",")) add("answer が並べ替えになっていない");
      // 「ちいさい じゅんに」は、ならべた結果が小さい順かを確かめる
      if (/ちいさい\s*じゅん/.test(item.prompt.join(""))) {
        const nums = item.answer.map((i) => Number(item.tokens[i]));
        if (nums.some(Number.isNaN)) add("並べ替えの札が数字でない");
        else if (nums.some((v, i) => i > 0 && v < nums[i - 1])) add("ちいさい じゅんに なっていない");
      }
      if (/おおきい\s*じゅん/.test(item.prompt.join(""))) {
        const nums = item.answer.map((i) => Number(item.tokens[i]));
        if (nums.some((v, i) => i > 0 && v > nums[i - 1])) add("おおきい じゅんに なっていない");
      }
    }
  }

  // ★計算の検算（なぞり書きは 計算ではないので とばす）
  if (item.type === "trace") return;
  const want = expectedAnswer(item);
  if (want == null) {
    unchecked.push(`${where}「${item.prompt.join(" ")}」`);
  } else {
    let got = null;
    if (item.type === "input") got = Number(item.answer);
    else if (item.type === "choice") {
      const c = item.choices?.[item.answer];
      const label = typeof c === "string" ? c : c?.label;
      if (label != null && /^\d+$/.test(String(label))) got = Number(label);
    }
    if (got == null) unchecked.push(`${where}（答えが数字でないので検算できず）`);
    else if (got !== want) add(`計算が合わない：答えは ${got} だが ${want} のはず`);
  }

  // 小1の範囲（学期で ちがう）
  const term = termOf(unitId);
  const maxNum = term === 1 ? 20 : 100;
  // ★学期で 上限が ちがう（termOf のコメントを見てください）。
  //   1学期：和は10まで・数は20まで。
  //   2学期：くりあがりが あるので 和は18まで・数は100まで。
  const maxSum = term === 1 ? 10 : 18;
  const line = item.prompt.join(" ");
  const nums = (line.match(/\d+/g) || []).map(Number);
  if (nums.some((n) => n > maxNum)) warns.push(`${where}: ${maxNum}より大きい数が出ている`);

  // ★「4 + 1 - 2」のような 3つの数の式は、左から じゅんに 計算して 見る。
  //   さいしょの 2つだけを 見ると「1 - 2」で マイナスだと かんちがいする。
  const chain = line.match(/\d+(?:\s*[+\-−ー]\s*\d+){2,}/);
  if (chain) {
    const parts = chain[0].match(/\d+|[+\-−ー]/g);
    let v = Number(parts[0]);
    for (let i = 1; i < parts.length; i += 2) {
      v = parts[i] === "+" ? v + Number(parts[i + 1]) : v - Number(parts[i + 1]);
      if (v < 0) {
        add("とちゅうの こたえが マイナスに なる");
        break;
      }
      if (v > maxSum) {
        add(`とちゅうの こたえが ${maxSum}を こえる（${term}学期の範囲外）`);
        break;
      }
    }
  } else {
    const sum = line.match(/(\d+)\s*\+\s*(\d+)/);
    if (sum && Number(sum[1]) + Number(sum[2]) > maxSum) {
      add(`たし算の答えが${maxSum}をこえている（${term}学期の範囲外）`);
    }
    const sub = line.match(/(\d+)\s*[-−ー]\s*(\d+)/);
    if (sub && Number(sub[1]) - Number(sub[2]) < 0) add("ひき算の答えがマイナスになる");
  }
}

/**
 * ★国語でいちばん大事な検査。
 * 単元に allowedChars（その時点までに 習った字）が あるときは、
 * 問題文・選択肢・札・ヒントに **それ以外の字を つかっていないか** を見る。
 * これが ないと「まだ 習っていない字」が 出てきて、子どもが 読めずに 止まる。
 */
function checkAllowedChars(unit, item) {
  const allowed = unit.allowedChars;
  if (!allowed) return;
  const ok = new Set([...allowed, " ", "　"]);
  const texts = [
    ...(item.prompt || []),
    ...(item.choices || []).map((c) => (typeof c === "string" ? c : c?.label || "")),
    ...(item.tokens || []),
    item.hint || "",
  ];
  const bad = new Set();
  for (const t of texts) {
    for (const ch of String(t)) if (!ok.has(ch)) bad.add(ch);
  }
  if (bad.size) {
    errors.push(`${unit.unitId} ${item.id}: まだ習っていない字をつかっている「${[...bad].join("")}」`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const seenIds = new Set();
  let total = 0;

  if (args.length) {
    for (const path of args) {
      const data = JSON.parse(readFileSync(path, "utf8"));
      // { "u01": [items] } の形にも、単元ファイルの形にも対応する
      const groups = Array.isArray(data.items) ? { [data.unitId]: data.items } : data;
      for (const [unitId, items] of Object.entries(groups)) {
        if (!Array.isArray(items)) continue;
        // ★下検査でも「まだ習っていない字」を見る。
        //   国語でいちばん多いまちがいなので、ここを飛ばすと意味がない。
        const unitFile = readdirSync(unitDir).find((n) => n.endsWith(`-${unitId}.json`));
        const unit = unitFile ? JSON.parse(readFileSync(join(unitDir, unitFile), "utf8")) : null;
        const skillIds = unit ? new Set((unit.skills || []).map((x) => x.id)) : null;
        for (const it of items) {
          checkItem(unitId, it, skillIds, seenIds);
          if (unit) checkAllowedChars(unit, it);
          total++;
        }
      }
    }
  } else {
    if (!existsSync(unitDir)) {
      console.error("問題のフォルダがありません:", unitDir);
      process.exit(1);
    }
    for (const name of readdirSync(unitDir).filter((n) => n.endsWith(".json"))) {
      const data = JSON.parse(readFileSync(join(unitDir, name), "utf8"));
      const skillIds = new Set((data.skills || []).map((s) => s.id));
      for (const it of data.items || []) {
        checkItem(data.unitId, it, skillIds, seenIds);
        checkAllowedChars(data, it);
        total++;
      }
    }
  }

  console.log(`検査した問題：${total}問`);
  if (unchecked.length) {
    console.log(`\n■ 機械では検算できなかった問題（人が読んでください）：${unchecked.length}件`);
    for (const u of unchecked.slice(0, 40)) console.log("  ・" + u);
    if (unchecked.length > 40) console.log(`  …ほか ${unchecked.length - 40}件`);
  }
  if (warns.length) {
    console.log(`\n■ 注意：${warns.length}件`);
    for (const w of warns.slice(0, 30)) console.log("  ・" + w);
  }
  if (errors.length) {
    console.log(`\n■ エラー：${errors.length}件`);
    for (const e of errors) console.log("  ×" + e);
    process.exit(1);
  }
  console.log("\nエラーなし");
}

main();
