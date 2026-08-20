"use client";

import { useFavorites, type FavoriteKind } from "@/lib/favorites";

type Props = {
  kind: FavoriteKind;
  slug: string;
  className?: string;
};

export default function FavoriteButton({ kind, slug, className = "" }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(kind, slug);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "お気に入りから外す" : "お気に入りに追加"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(kind, slug);
      }}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg hover:bg-background focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      {active ? "⭐" : "☆"}
    </button>
  );
}
