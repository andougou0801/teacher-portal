/**
 * Q&A掲示板の投稿に、個人情報らしき記述が含まれていないかを調べる。
 *
 * 投稿をブロックするのではなく「確認を1回はさむ」ための仕組み。
 * 先生が急いで書いたときに、学校名や児童の学級が入ったまま送信されるのを防ぐ。
 * 判定はすべてブラウザの中だけで行い、入力内容はどこにも送信しない。
 *
 * ## 設計の方針：誤検知（問題ない文章を警告すること）を何より避ける
 *
 * 警告が頻繁に出ると読み飛ばされ、本当に危ないときにも効かなくなる。
 * そのため「見逃してもよいから、明らかなものだけを拾う」方針にしている。
 * 見逃す分は、投稿欄に常に出している「投稿するときのお願い」で補う。
 *
 * 具体的には、学校名は**漢字・カタカナだけで書かれた2〜6字の名前**が
 * 「小学校」などの直前に来ているときだけ拾う。
 * 「ある小学校」「通う小学校」「新しい小学校」のように、ひらがなを含む言葉が
 * 前に来るものは、普通の文章なので拾わない。
 * 代わりに「あけぼの小学校」のようなひらがなの校名は見逃すが、
 * 誤検知を減らすほうを優先している。
 */

/** 「〇〇小学校」の〇〇が固有名詞ではなく、一般的な言い回しのときは警告しない。 */
const GENERIC_SCHOOL_PREFIXES = [
  "公立",
  "私立",
  "国立",
  "県立",
  "市立",
  "区立",
  "町立",
  "村立",
  "都立",
  "府立",
  "全国",
  "地域",
  "近隣",
  "近所",
  "市内",
  "町内",
  "村内",
  "県内",
  "都内",
  "府内",
  "管内",
  "複数",
  "一般",
  "普通",
  "当該",
  "前任",
  "現任",
  "小中",
  "中高",
  "夜間",
  "毎年",
  "今年",
  "来年",
  "昨年",
  "本年",
  "来年度",
  "今年度",
  "昨年度",
  "次年度",
  "各種",
  "一部",
  "多数",
  "最近",
  "以前",
  "出身",
  "母校",
  "担当",
  "勤務",
  "異動",
  "附属",
  "付属",
];

/**
 * 学校名らしき書き方。
 * 直前が漢字・カタカナでないこと（(?<![一-龥ァ-ヴ])）を条件にして、
 * 長い熟語の途中を切り取ってしまわないようにしている。
 */
const SCHOOL_PATTERN =
  /(?<![一-龥ァ-ヴヶ々])([一-龥ァ-ヴーヶ々]{1,6})(小学校|中学校|高等学校|義務教育学校|中等教育学校|特別支援学校|学園|幼稚園|保育園|こども園)/g;

/**
 * 「緑小学校」「南小学校」のように1文字の校名もあるため1字から拾うが、
 * 「元小学校」「旧幼稚園」のような言い回しまで拾ってしまうので、
 * 1文字のときだけ別に除外する。
 */
const GENERIC_SINGLE_CHAR_PREFIXES = [
  "元",
  "旧",
  "新",
  "現",
  "各",
  "全",
  "同",
  "他",
  "当",
  "本",
  "両",
  "某",
  "小",
  "中",
  "高",
  "私",
  "公",
  "市",
  "区",
  "町",
  "村",
  "県",
  "都",
  "府",
];

/** 「3年2組」「3年生2組」「第3学年2組」「3年A組」のような学級の書き方。 */
const CLASS_PATTERN =
  /(?:第\s*)?[1-6１-６一二三四五六]\s*(?:学年|年生|年)\s*(?:[0-9０-９一二三四五六七八九十]{1,2}|[A-ZＡ-Ｚ])\s*組/;

/** 電話番号らしき数字の候補。桁数などは下の isPhoneNumber で確かめる。 */
const PHONE_CANDIDATE_PATTERN =
  /[0０][\d０-９]{1,4}[-ー－\s][\d０-９]{1,4}[-ー－\s][\d０-９]{3,4}|[0０][\d０-９]{9,10}/g;

/** フリーダイヤル・相談窓口は、個人の電話番号ではないので警告しない。 */
const PUBLIC_PHONE_PREFIXES = ["0120", "0570", "0800", "0990"];

const EMAIL_PATTERN = /[\w.+-]+[@＠][\w-]+\.[\w.-]+/;

/** 全角の数字を半角に直す。 */
function toHalfWidthDigits(value: string): string {
  return value.replace(/[０-９]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0),
  );
}

/** 候補の文字列が、本当に電話番号らしい桁数かどうかを確かめる。 */
function isPhoneNumber(candidate: string): boolean {
  const digits = toHalfWidthDigits(candidate).replace(/\D/g, "");
  // 日本の電話番号は10桁か11桁。日付（05-10-2025 など）をはじくためにここで絞る。
  if (digits.length !== 10 && digits.length !== 11) return false;
  if (PUBLIC_PHONE_PREFIXES.some((prefix) => digits.startsWith(prefix))) {
    return false;
  }
  return true;
}

export type PersonalInfoRisk = {
  /** 画面に出す警告文。 */
  label: string;
  /** 見つかった文字列（利用者が直す場所を探せるように示す）。 */
  found: string;
};

/**
 * 投稿される文章を調べて、個人情報らしき記述の一覧を返す。
 * 何も見つからなければ空の配列を返す。
 *
 * 本文だけでなくニックネーム欄も調べたいので、呼び出し側で
 * 両方をつなげて渡してよい（findPersonalInfoRisksInPost を使うと楽）。
 */
export function findPersonalInfoRisks(text: string): PersonalInfoRisk[] {
  const risks: PersonalInfoRisk[] = [];

  for (const match of text.matchAll(SCHOOL_PATTERN)) {
    const prefix = match[1];
    if (prefix.length === 1 && GENERIC_SINGLE_CHAR_PREFIXES.includes(prefix)) {
      continue;
    }
    if (GENERIC_SCHOOL_PREFIXES.some((generic) => prefix.endsWith(generic))) {
      continue;
    }
    risks.push({ label: "学校名らしき記述があります", found: match[0] });
    break;
  }

  const classMatch = text.match(CLASS_PATTERN);
  if (classMatch) {
    risks.push({ label: "学年・学級の記述があります", found: classMatch[0] });
  }

  for (const match of text.matchAll(PHONE_CANDIDATE_PATTERN)) {
    if (!isPhoneNumber(match[0])) continue;
    risks.push({ label: "電話番号らしき数字があります", found: match[0] });
    break;
  }

  const emailMatch = text.match(EMAIL_PATTERN);
  if (emailMatch) {
    risks.push({
      label: "メールアドレスらしき記述があります",
      found: emailMatch[0],
    });
  }

  return risks;
}

/** 本文とニックネームの両方をまとめて調べる。 */
export function findPersonalInfoRisksInPost(
  body: string,
  nickname: string,
): PersonalInfoRisk[] {
  return findPersonalInfoRisks(`${nickname}\n${body}`);
}
