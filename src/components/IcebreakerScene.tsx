export type SceneType =
  | "circle"
  | "pair"
  | "small-group"
  | "line"
  | "scatter"
  | "front"
  | "seated-circle";

const COLORS = ["#1F4E79", "#2E86AB", "#2F8F5B", "#F5A623", "#8E63C7"];

function Figure({
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

function Chair({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
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

export default function IcebreakerScene({ type }: { type: SceneType }) {
  const cx = 120;
  const cy = 80;

  return (
    <svg viewBox="0 0 240 160" className="h-full w-full">
      <rect width="240" height="160" rx="16" fill="#EAF2FA" />

      {type === "circle" && (
        <g>
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
            const r = 46;
            return (
              <Figure
                key={i}
                x={cx + r * Math.cos(angle)}
                y={cy + r * Math.sin(angle) * 0.75}
                color={COLORS[i % COLORS.length]}
              />
            );
          })}
        </g>
      )}

      {type === "seated-circle" && (
        <g>
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
            const r = 46;
            const fx = cx + r * Math.cos(angle);
            const fy = cy + r * Math.sin(angle) * 0.75;
            return (
              <g key={i}>
                <Chair x={fx} y={fy} scale={0.9} />
                <Figure x={fx} y={fy} color={COLORS[i % COLORS.length]} scale={0.9} />
              </g>
            );
          })}
        </g>
      )}

      {type === "pair" && (
        <g>
          <Figure x={cx - 30} y={cy} color={COLORS[0]} scale={1.3} />
          <Figure x={cx + 30} y={cy} color={COLORS[1]} scale={1.3} />
          <path
            d={`M ${cx - 14} ${cy - 8} Q ${cx} ${cy - 20} ${cx + 14} ${cy - 8}`}
            stroke="#8A93A3"
            strokeWidth={2}
            strokeDasharray="3 4"
            fill="none"
          />
        </g>
      )}

      {type === "small-group" && (
        <g>
          <Figure x={cx - 24} y={cy + 10} color={COLORS[0]} scale={1.1} />
          <Figure x={cx + 24} y={cy + 10} color={COLORS[1]} scale={1.1} />
          <Figure x={cx} y={cy - 26} color={COLORS[2]} scale={1.1} />
          <Figure x={cx - 6} y={cy + 34} color={COLORS[3]} scale={0.9} />
        </g>
      )}

      {type === "line" && (
        <g>
          {Array.from({ length: 5 }).map((_, i) => (
            <Figure key={i} x={44 + i * 38} y={cy + 10} color={COLORS[i % COLORS.length]} />
          ))}
          <path
            d="M 20 130 L 220 130"
            stroke="#B9CEDD"
            strokeWidth={2}
            strokeDasharray="4 5"
          />
        </g>
      )}

      {type === "scatter" && (
        <g>
          {[
            [50, 40],
            [180, 35],
            [30, 100],
            [120, 60],
            [200, 105],
            [95, 115],
          ].map(([x, y], i) => (
            <Figure key={i} x={x} y={y} color={COLORS[i % COLORS.length]} scale={0.85} armsUp={i % 3 === 0} />
          ))}
        </g>
      )}

      {type === "front" && (
        <g>
          <Figure x={44} y={cy + 6} color={COLORS[0]} scale={1.4} armsUp />
          <rect x={16} y={cy + 30} width={56} height={5} rx={2.5} fill="#B9CEDD" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Figure key={i} x={130 + i * 28} y={cy + 12} color={COLORS[(i + 1) % COLORS.length]} scale={0.9} />
          ))}
        </g>
      )}
    </svg>
  );
}
