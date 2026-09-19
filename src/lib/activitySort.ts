/** 一覧の並べ替えに必要な項目だけを持つ最小の型（アイスブレイク・学級レク共通）。 */
export type SortableActivity = {
  title: string;
  duration: string;
  materials: string;
};

/**
 * 「5〜10分」「5分程度」「30秒×数回」などの表記から、
 * 最短・最長のおおよその分数を取り出す（並べ替え用）。
 */
function parseDurationRange(duration: string): [number, number] {
  const values: number[] = [];
  // 「5〜10分」のように、範囲の場合は後ろの数字にだけ単位が付く点に注意。
  for (const [, start, end, unit] of duration.matchAll(
    /(\d+)(?:\s*[〜～\-–—]\s*(\d+))?\s*(秒|分|時間)/g,
  )) {
    const toMinutes = (value: string) => {
      const amount = Number(value);
      if (unit === "秒") return amount / 60;
      if (unit === "時間") return amount * 60;
      return amount;
    };
    values.push(toMinutes(start));
    if (end) values.push(toMinutes(end));
  }
  if (values.length === 0) return [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
  return [Math.min(...values), Math.max(...values)];
}

/** 「15〜20分」なら 20 のように、かかる時間の上限（分）を返す。絞り込み用。 */
export function getMaxMinutes(duration: string): number {
  return parseDurationRange(duration)[1];
}

/**
 * 準備物の欄が「なし」で始まる（「なし」「なし（あれば〜）」など）なら true。
 * 「先に出すかどうか」の並べ替えに使うだけの、ゆるい判定。
 */
function needsNoMaterials(materials: string): boolean {
  return materials.startsWith("なし");
}

/**
 * 一覧で見やすいように、短い時間でできるものから順に並べ替える。
 * 所要時間が同じ場合は、準備物が要らないものを先に出す。
 */
export function sortByPlayTime<T extends SortableActivity>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const [aMin, aMax] = parseDurationRange(a.duration);
    const [bMin, bMax] = parseDurationRange(b.duration);
    if (aMin !== bMin) return aMin - bMin;
    if (aMax !== bMax) return aMax - bMax;

    const aFree = needsNoMaterials(a.materials);
    const bFree = needsNoMaterials(b.materials);
    if (aFree !== bFree) return aFree ? -1 : 1;

    return a.title.localeCompare(b.title, "ja");
  });
}
