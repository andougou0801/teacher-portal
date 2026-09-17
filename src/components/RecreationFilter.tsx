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
  const min = Math.min(...years);
  const max = Math.max(...years);
  return `${min}〜${max}年むき`;
}

function toggle<T>(set: T[], value: T): T[] {
  return set.includes(value) ? set.filter((item) => item !== value) : [...set, value];
}

const chipBase =
  "rounded-full border px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const chipOff = "border-line bg-white text-muted hover:border-accent";
const chipOn = "border-accent bg-accent text-white";

export default function RecreationFilter({ items }: { items: Recreation[] }) {
  const [places, setPlaces] = useState<RecreationPlace[]>([]);
  const [grades, setGrades] = useState<RecreationGrade[]>([]);
  const [occasion, setOccasion] = useState<RecreationOccasion | null>(null);
  const [noMaterialsOnly, setNoMaterialsOnly] = useState(false);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (places.length > 0 && !item.places.some((place) => places.includes(place))) {
          return false;
        }
        if (grades.length > 0 && !item.grades.some((grade) => grades.includes(grade))) {
          return false;
        }
        if (occasion && !item.occasions.includes(occasion)) return false;
        if (noMaterialsOnly && !needsNoMaterials(item.materials)) return false;
        return true;
      }),
    [items, places, grades, occasion, noMaterialsOnly],
  );

  const isFiltered =
    places.length > 0 || grades.length > 0 || occasion !== null || noMaterialsOnly;

  function reset() {
    setPlaces([]);
    setGrades([]);
    setOccasion(null);
    setNoMaterialsOnly(false);
  }

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-line bg-white p-5">
        <div className="mb-3">
          <div className="mb-1.5 text-sm font-bold text-navy">こんなときに</div>
          <div className="flex flex-wrap gap-2">
            {recreationOccasions.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={occasion === item}
                onClick={() => setOccasion(occasion === item ? null : item)}
                className={`${chipBase} ${occasion === item ? chipOn : chipOff}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="mb-1.5 text-sm font-bold text-navy">場所</div>
          <div className="flex flex-wrap gap-2">
            {recreationPlaces.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={places.includes(item)}
                onClick={() => setPlaces(toggle(places, item))}
                className={`${chipBase} ${places.includes(item) ? chipOn : chipOff}`}
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={noMaterialsOnly}
              onClick={() => setNoMaterialsOnly(!noMaterialsOnly)}
              className={`${chipBase} ${noMaterialsOnly ? chipOn : chipOff}`}
            >
              準備物なし
            </button>
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-sm font-bold text-navy">学年</div>
          <div className="flex flex-wrap gap-2">
            {recreationGrades.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={grades.includes(item)}
                onClick={() => setGrades(toggle(grades, item))}
                className={`${chipBase} ${grades.includes(item) ? chipOn : chipOff}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-3">
          <p aria-live="polite" className="text-sm font-bold text-navy">
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
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="mb-10 text-center text-sm text-muted">
          この条件に合う学級レクはありませんでした。条件を1つ外してみてください。
        </p>
      )}

      {recreationCategories.map((category) => {
        const list = sortRecreations(
          filtered.filter((item) => item.category === category),
        );
        if (list.length === 0) return null;
        return (
          <div key={category} className="mb-10">
            <h2 className="mb-3 text-sm font-bold text-navy">
              {category}（{list.length}件）
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {list.map((rec) => (
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
                    <p className="mt-1.5 text-[13px] text-muted">{gradeLabel(rec.grades)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
