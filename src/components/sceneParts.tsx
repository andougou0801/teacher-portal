/**
 * アイスブレイク／学級レクのイラスト（SVG）で共通して使う部品。
 * 同じ描き方の人・椅子を両方の特集で使い回すため、ここに切り出している。
 */

export const SCENE_COLORS = ["#1F4E79", "#2E86AB", "#2F8F5B", "#F5A623", "#8E63C7"];

export function Figure({
  x,
  y,
  color,
  scale = 1,
  armsUp = false,
}: {
  x: number;
  y: number;
  color: string;
  scale?: number;
  armsUp?: boolean;
}) {
  const headR = 9 * scale;
  const bodyW = 15 * scale;
  const bodyH = 22 * scale;
  return (
    <g>
      <circle cx={x} cy={y - bodyH / 2 - headR + 2} r={headR} fill={color} />
      <rect
        x={x - bodyW / 2}
        y={y - bodyH / 2}
        width={bodyW}
        height={bodyH}
        rx={bodyW / 2}
        fill={color}
        opacity={0.85}
      />
      {armsUp ? (
        <>
          <line
            x1={x - bodyW / 2}
            y1={y - bodyH / 2 + 4}
            x2={x - bodyW / 2 - 8 * scale}
            y2={y - bodyH / 2 - 10 * scale}
            stroke={color}
            strokeWidth={4 * scale}
            strokeLinecap="round"
          />
          <line
            x1={x + bodyW / 2}
            y1={y - bodyH / 2 + 4}
            x2={x + bodyW / 2 + 8 * scale}
            y2={y - bodyH / 2 - 10 * scale}
            stroke={color}
            strokeWidth={4 * scale}
            strokeLinecap="round"
          />
        </>
      ) : null}
    </g>
  );
}

export function Chair({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <rect
      x={x - 11 * scale}
      y={y + 8 * scale}
      width={22 * scale}
      height={8 * scale}
      rx={2 * scale}
      fill="#D8DFEA"
    />
  );
}
