/**
 * Q&A掲示板の投稿に、個人情報らしき記述が含まれていないかを調べる。
 *
 * 投稿をブロックするのではなく「確認を1回はさむ」ための仕組み。
 * 先生が急いで書いたときに、学校名や児童の学級が入ったまま送信されるのを防ぐ。
 * 判定はすべてブラウザの中だけで行い、入力内容はどこにも送信しない。
 *
 * 誤検知（本当は問題ない文章を警告してしまうこと）が多いと読み飛ばされるので、
 * 「見逃してもよいから、明らかなものだけを拾う」方針にしている。
 */

/** 「〇〇小学校」の〇〇が、固有名詞ではなく一般的な言い回しのときは警告しない。 */
const GENERIC_SCHOOL_PREFIXES = [
  "公立",
  "私立",
  "国立",
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
  "同じ",
  "別の",
  "他の",
  "各",
  "当該",
  "前任",
  "小中",
  "本",
];

/**
 * 「〇〇小学校」の〇〇が助詞で終わるときは、固有名詞ではなく
 * 「うちの小学校」「全国の小学校」のような一般的な言い回しなので警告しない。
 */
const PARTICLE_ENDINGS = ["の", "は", "が", "を", "に", "で", "と", "も", "や", "な"];

const SCHOOL_PATTERN =
  /([一-龥ァ-ヴーぁ-んa-zA-Z0-9]{1,12})(小学校|中学校|高等学校|高校|義務教育学校|中等教育学校|特別支援学校|学園|幼稚園|保育園|こども園)/g;

/** 「3年2組」「六年一組」のような学級の書き方。 */
const CLASS_PATTERN =
  /[1-6１-６一二三四五六]\s*年\s*[0-9０-９一二三四五六七八九十]{1,2}\s*組/;

/** 市外局番つきの電話番号、または10〜11桁の数字の並び。 */
const PHONE_PATTERN = /(0\d{1,4}[-ー－]\d{1,4}[-ー－]\d{3,4})|(\b0\d{9,10}\b)/;

const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/;

export type PersonalInfoRisk = {
  /** 画面に出す警告文。 */
  label: string;
  /** 見つかった文字列（利用者が直す場所を探せるように示す）。 */
  found: string;
};

/**
 * 投稿本文を調べて、個人情報らしき記述の一覧を返す。
 * 何も見つからなければ空の配列を返す。
 */
export function findPersonalInfoRisks(text: string): PersonalInfoRisk[] {
  const risks: PersonalInfoRisk[] = [];

  for (const match of text.matchAll(SCHOOL_PATTERN)) {
    const prefix = match[1];
    if (PARTICLE_ENDINGS.some((particle) => prefix.endsWith(particle))) {
      continue;
    }
    if (GENERIC_SCHOOL_PREFIXES.some((generic) => prefix.endsWith(generic))) {
      continue;
    }
    risks.push({
      label: "学校名らしき記述があります",
      found: match[0],
    });
    break;
  }

  const classMatch = text.match(CLASS_PATTERN);
  if (classMatch) {
    risks.push({
      label: "学年・学級の記述があります",
      found: classMatch[0],
    });
  }

  const phoneMatch = text.match(PHONE_PATTERN);
  if (phoneMatch) {
    risks.push({
      label: "電話番号らしき数字があります",
      found: phoneMatch[0],
    });
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
