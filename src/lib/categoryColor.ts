const BORDER_COLORS = [
  "border-l-accent",
  "border-l-cta",
  "border-l-good",
  "border-l-navy",
  "border-l-warn",
] as const;

/**
 * カテゴリー文字列から決定論的に色を割り当てる。
 * カテゴリーの種類数が多い・変動する箇所でも、個別の色マッピング表を
 * 保守する必要がないようにするための簡易ハッシュ方式。
 */
export function getCategoryBorderColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  }
  return BORDER_COLORS[hash % BORDER_COLORS.length];
}
