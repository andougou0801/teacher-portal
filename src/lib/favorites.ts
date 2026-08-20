"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "teacher-portal-favorites";
const CHANGE_EVENT = "teacher-portal-favorites-changed";

export type FavoriteKind = "tool" | "article" | "icebreaker";

function makeId(kind: FavoriteKind, slug: string): string {
  return `${kind}:${slug}`;
}

function readAll(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** ブラウザのlocalStorageだけでお気に入りを保存・購読するフック。会員登録・サーバー保存は不要。 */
export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorageはeffect外で読めないための初回同期
    setIds(readAll());
    function handleChange() {
      setIds(readAll());
    }
    window.addEventListener(CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  const isFavorite = useCallback(
    (kind: FavoriteKind, slug: string) => ids.includes(makeId(kind, slug)),
    [ids],
  );

  const toggleFavorite = useCallback((kind: FavoriteKind, slug: string) => {
    const id = makeId(kind, slug);
    const current = readAll();
    const next = current.includes(id)
      ? current.filter((existing) => existing !== id)
      : [...current, id];
    writeAll(next);
  }, []);

  return { ids, isFavorite, toggleFavorite };
}
