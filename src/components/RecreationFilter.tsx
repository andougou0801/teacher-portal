"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import RecreationScene from "@/components/RecreationScene";
import {
  recreationCategories,
  recreationGrades,
  recreationOccasions,
  recreationPlaces,
  sortRecreations,
  getRecreationBorderColor,
  type Recreation,
  type RecreationGrade,
  type RecreationOccasion,
  type RecreationPlace,
} from "@/lib/recreations";
import { getMaxMinutes } from "@/lib/activitySort";

/** 「あと何分ある？」で選べるようにするための時間の区切り。 */
const TIME_BUCKETS = [
  { label: "10分くらい", max: 10 },
  { label: "15分くらい", max: 15 },
  { label: "20分くらい", max: 20 },
  { label: "30分くらい", max: 30 },
] as const;

type TimeLabel = (typeof TIME_BUCKETS)[number]["label"];

/** そのレクがどの区切りに入るか（かかる時間の上限で決める）。 */
function timeLabelOf(item: Recreation): TimeLabel {
  const minutes = getMaxMinutes(item.duration);
  return (
    TIME_BUCKETS.find((bucket) => minutes <= bucket.max) ?? TIME_BUCKETS[3]
  ).label;
}

/** 準備物が実質不要（「なし」で始まる）かどうか。カードの「準備なし」バッジに使う。 */
function needsNoMaterials(materials: string): boolean {
  return materials.startsWith("なし");
}

const GRADE_YEARS: Record<RecreationGrade, [number, number]> = {
  低学年: [1, 2],
  中学年: [3, 4],
  高学年: [5, 6],
};

/** ["低学年","中学年"] → 「1〜4年むき」のように短くまとめる。 */
function gradeLabel(grades: RecreationGrade[]): string {
  const years = grades.flatMap((grade) => GRADE_YEARS[grade]);
  return `${Math.min(...years)}〜${Math.max(...years)}年むき`;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

type Conditions = {
  places: RecreationPlace[];
  grades: RecreationGrade[];
  times: TimeLabel[];
  occasion: RecreationOccasion | null;
  noMaterialsOnly: boolean;
};

function matches(item: Recreation, conditions: Conditions): boolean {
  const { places, grades, times, occasion, noMaterialsOnly } = conditions;
  if (places.length > 0 && !item.places.some((place) => places.includes(place)))
    return false;
  if (grades.length > 0 && !item.grades.some((grade) => grades.includes(grade)))
    return false;
  if (times.length > 0 && !times.includes(timeLabelOf(item))) return false;
  if (occasion && !item.occasions.includes(occasion)) return false;
  if (noMaterialsOnly && !needsNoMaterials(item.materials)) return false;
  return true;
}

const chipBase =
  "rounded-full border px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const chipOff = "border-line bg-white text-muted hover:border-accent";
const chipOn = "border-accent bg-accent text-white";

export default function RecreationFilter({ items }: { items: Recreation[] }) {
  const [places, setPlaces] = useState<RecreationPlace[]>([]);
  const [grades, setGrades] = useState<RecreationGrade[]>([]);
  const [times, setTimes] = useState<TimeLabel[]>([]);
  const [occasion, setOccasion] = useState<RecreationOccasion | null>(null);
  const [noMaterialsOnly, setNoMaterialsOnly] = useState(false);
  const [sortByTime, setSortByTime] = useState(false);

  const conditions: Conditions = {
    places,
    grades,
    times,
    occasion,
    noMaterialsOnly,
  };
  const filtered = useMemo(
    () => items.filter((item) => matches(item, conditions)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- conditions は毎回作り直す入れ物なので、中身を依存に並べる
    [items, places, grades, times, occasion, noMaterialsOnly],
  );

  /**
   * チップに出す件数。そのチップを押したときに何件になるかを先に見せたいので、
   * 「同じ列の条件だけを、そのチップ1つに置きかえた状態」で数える。
   */
  function countIfSelected(override: Partial<Conditions>): number {
    return items.filter((item) => matches(item, { ...conditions, ...override }))
      .length;
  }

  const isFiltered =
    places.length > 0 ||
    grades.length > 0 ||
    times.length > 0 ||
    occasion !== null ||
    noMaterialsOnly;

  function reset() {
    setPlaces([]);
    setGrades([]);
    setTimes([]);
    setOccasion(null);
    setNoMaterialsOnly(false);
  }

  const groups = sortByTime
    ? [
        {
          key: "すべて",
          label: `短い順（${filtered.length}件）`,
          list: sortRecreations(filtered),
        },
      ]
    : recreationCategories
        .map((category) => ({
          key: category,
          label: `${category}（${filtered.filter((item) => item.category === category).length}件）`,
          list: sortRecreations(
            filtered.filter((item) => item.category === category),
          ),
        }))
        .filter((group) => group.list.length > 0);

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-line bg-white p-5">
        <div className="mb-3">
          <div className="mb-1.5 text-sm font-bold text-navy">こんなときに</div>
          <div className="flex flex-wrap gap-2">
            {recreationOccasions.map((item) => {
              const on = occasion === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setOccasion(on ? null : item)}
                  className={`${chipBase} ${on ? chipOn : chipOff}`}
                >
                  {item}
                  <span className="ml-1 font-normal opacity-80">
                    {countIfSelected({ occasion: on ? null : item })}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[13px] text-muted">
            ※「雨の日」は教室だけでできるものです。数字は、押したときに表示される件数です。
          </p>
        </div>

        <div className="mb-3">
          <div className="mb-1.5 text-sm font-bold text-navy">かかる時間</div>
          <div className="flex flex-wrap gap-2">
            {TIME_BUCKETS.map((bucket) => {
              const on = times.includes(bucket.label);
              return (
                <button
                  key={bucket.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTimes(toggle(times, bucket.label))}
                  className={`${chipBase} ${on ? chipOn : chipOff}`}
                >
                  {bucket.label}
                  <span className="ml-1 font-normal opacity-80">
                    {countIfSelected({ times: toggle(times, bucket.label) })}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[13px] text-muted">
            ※遊ぶ時間の目安です。机を下げる・道具を出す時間は入っていません。
          </p>
        </div>

        <details className="mb-2 border-t border-line pt-2">
          <summary className="cursor-pointer py-1 text-sm font-bold text-navy">
            場所・学年でさらにしぼる
          </summary>

          <div className="mt-2 mb-3">
            <div className="mb-1.5 text-sm font-bold text-navy">場所</div>
            <div className="flex flex-wrap gap-2">
              {recreationPlaces.map((item) => {
                const on = places.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPlaces(toggle(places, item))}
                    className={`${chipBase} ${on ? chipOn : chipOff}`}
                  >
                    {item}
                    <span className="ml-1 font-normal opacity-80">
                      {countIfSelected({ places: toggle(places, item) })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-1.5 text-sm font-bold text-navy">学年</div>
            <div className="flex flex-wrap gap-2">
              {recreationGrades.map((item) => {
                const on = grades.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setGrades(toggle(grades, item))}
                    className={`${chipBase} ${on ? chipOn : chipOff}`}
                  >
                    {item}
                    <span className="ml-1 font-normal opacity-80">
                      {countIfSelected({ grades: toggle(grades, item) })}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[13px] text-muted">
              ※その学年で、そのまま使えるものに付けています。ほとんどのレクは中学年で使えます。
            </p>
          </div>
        </details>

        <div className="mt-2 flex flex-wrap gap-x-5 border-t border-line pt-1">
          <label className="flex w-fit cursor-pointer items-center gap-2 py-2 text-sm font-bold text-navy">
            <input
              type="checkbox"
              checked={noMaterialsOnly}
              onChange={(event) => setNoMaterialsOnly(event.target.checked)}
              className="h-4 w-4 accent-[#1f7a9e]"
            />
            準備物がいらないものだけ（
            {countIfSelected({ noMaterialsOnly: !noMaterialsOnly })}件）
          </label>
          <label className="flex w-fit cursor-pointer items-center gap-2 py-2 text-sm font-bold text-navy">
            <input
              type="checkbox"
              checked={sortByTime}
              onChange={(event) => setSortByTime(event.target.checked)}
              className="h-4 w-4 accent-[#1f7a9e]"
            />
            種類で分けず、時間が短い順に並べる
          </label>
        </div>

        <div
          aria-live="polite"
          className="mt-3 flex flex-wrap items-center gap-3 border-t border-line pt-3"
        >
          <p className="text-sm font-bold text-navy">
            {filtered.length}件を表示中
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-sm font-bold text-accent hover:border-accent"
            >
              条件をすべて外す
            </button>
          )}
          {filtered.length === 0 && (
            <p className="text-sm text-muted">
              この条件に合う学級レクはありませんでした。条件を1つ外してみてください。
            </p>
          )}
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.key} className="mb-10">
          <h2 className="mb-3 text-sm font-bold text-navy">{group.label}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.list.map((rec) => (
              <Link
                key={rec.slug}
                href={`/lessons/recreations/${rec.slug}`}
                className={`overflow-hidden rounded-2xl border border-line border-l-4 bg-white transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${getRecreationBorderColor(rec.category)}`}
              >
                <div className="h-28">
                  <RecreationScene type={rec.scene} />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold">
                    <span aria-hidden="true">{rec.emoji} </span>
                    {rec.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-background px-2 py-0.5 text-[13px] font-bold text-navy">
                      <span aria-hidden="true">⏱ </span>
                      <span className="sr-only">所要時間 </span>
                      {rec.duration}
                    </span>
                    <span className="rounded-full bg-background px-2 py-0.5 text-[13px] font-bold text-navy">
                      <span aria-hidden="true">📍 </span>
                      <span className="sr-only">場所 </span>
                      {rec.places.join("・")}
                    </span>
                    {needsNoMaterials(rec.materials) && (
                      <span className="rounded-full bg-good-bg px-2 py-0.5 text-[13px] font-bold text-good">
                        準備なし
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13px] text-muted">
                    {gradeLabel(rec.grades)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
