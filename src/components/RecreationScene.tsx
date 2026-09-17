import { SCENE_COLORS as COLORS, Figure, Chair } from "@/components/sceneParts";

export type RecreationSceneType =
  | "tag"
  | "field"
  | "ball"
  | "relay"
  | "rope"
  | "team-line"
  | "gym-circle"
  | "seated-circle"
  | "desk-group"
  | "quiz";

/** 校庭＝緑、体育館＝木の床、教室＝水色。場所が一目で伝わるように背景を変える。 */
const BACKGROUNDS: Record<RecreationSceneType, string> = {
  tag: "#E3F0DA",
  field: "#E3F0DA",
  ball: "#F7EEDD",
  relay: "#E3F0DA",
  rope: "#F7EEDD",
  "team-line": "#F7EEDD",
  "gym-circle": "#F7EEDD",
  "seated-circle": "#EAF2FA",
  "desk-group": "#EAF2FA",
  quiz: "#EAF2FA",
};

const ONI = "#C2551E";

function Cone({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M ${x} ${y - 16} L ${x + 9} ${y} L ${x - 9} ${y} Z`} fill={ONI} opacity={0.8} />
      <rect x={x - 12} y={y} width={24} height={4} rx={2} fill={ONI} opacity={0.5} />
    </g>
  );
}

function Ball({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#F5A623" />
      <path
        d={`M ${x - r} ${y} Q ${x} ${y - r * 0.9} ${x + r} ${y}`}
        stroke="#FFFFFF"
        strokeWidth={2}
        fill="none"
      />
    </g>
  );
}

/** 走っている感じを出すスピード線。 */
function Dash({ x, y, w = 18 }: { x: number; y: number; w?: number }) {
  return (
    <line
      x1={x}
      y1={y}
      x2={x + w}
      y2={y}
      stroke="#8A93A3"
      strokeWidth={2}
      strokeLinecap="round"
      opacity={0.6}
    />
  );
}

export default function RecreationScene({ type }: { type: RecreationSceneType }) {
  const cx = 120;
  const cy = 80;

  return (
    <svg
      viewBox="0 0 240 160"
      className="h-full w-full"
      aria-hidden="true"
      style={{ backgroundColor: BACKGROUNDS[type] }}
    >

      {type === "tag" && (
        <g>
          <Dash x={18} y={62} />
          <Dash x={24} y={74} w={12} />
          <Figure x={58} y={80} color={ONI} scale={1.2} armsUp />
          <text x={58} y={128} textAnchor="middle" fontSize="13" fontWeight="bold" fill={ONI}>
            鬼
          </text>
          <Figure x={130} y={66} color={COLORS[1]} />
          <Figure x={172} y={96} color={COLORS[2]} />
          <Figure x={208} y={62} color={COLORS[3]} scale={0.85} />
        </g>
      )}

      {type === "field" && (
        <g>
          {[
            [44, 46],
            [110, 38],
            [186, 52],
            [36, 108],
            [104, 104],
            [180, 112],
          ].map(([x, y], i) => (
            <Figure
              key={i}
              x={x}
              y={y}
              color={i === 0 ? ONI : COLORS[i % COLORS.length]}
              scale={0.85}
              armsUp={i % 3 === 0}
            />
          ))}
        </g>
      )}

      {type === "ball" && (
        <g>
          <line
            x1={cx}
            y1={20}
            x2={cx}
            y2={140}
            stroke="#D8C7A6"
            strokeWidth={3}
            strokeDasharray="6 6"
          />
          <Figure x={44} y={56} color={COLORS[0]} scale={0.9} />
          <Figure x={72} y={104} color={COLORS[1]} scale={0.9} />
          <Figure x={38} y={112} color={COLORS[2]} scale={0.75} />
          <Figure x={172} y={58} color={COLORS[3]} scale={0.9} />
          <Figure x={200} y={106} color={COLORS[4]} scale={0.9} />
          <Figure x={166} y={116} color={COLORS[1]} scale={0.75} />
          <Ball x={cx} y={70} />
        </g>
      )}

      {type === "relay" && (
        <g>
          <path
            d="M 26 124 L 200 124 Q 216 124 216 108 L 216 60"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeDasharray="8 7"
            fill="none"
            opacity={0.9}
          />
          <Cone x={200} y={64} />
          <Cone x={40} y={64} />
          <Figure x={70} y={116} color={COLORS[1]} scale={0.95} armsUp />
          <Figure x={126} y={116} color={COLORS[3]} scale={0.95} />
          <Dash x={36} y={104} w={14} />
        </g>
      )}

      {type === "rope" && (
        <g>
          <path
            d="M 40 66 Q 120 140 200 66"
            stroke="#8E63C7"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          <Figure x={34} y={96} color={COLORS[0]} scale={0.9} />
          <Figure x={206} y={96} color={COLORS[2]} scale={0.9} />
          <Figure x={120} y={76} color={COLORS[3]} scale={1.05} armsUp />
          <Figure x={160} y={116} color={COLORS[1]} scale={0.7} />
          <Figure x={80} y={116} color={COLORS[4]} scale={0.7} />
        </g>
      )}

      {type === "team-line" && (
        <g>
          {Array.from({ length: 3 }).map((_, i) => (
            <Figure key={`l${i}`} x={52} y={44 + i * 38} color={COLORS[0]} scale={0.85} />
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <Figure key={`r${i}`} x={188} y={44 + i * 38} color={COLORS[3]} scale={0.85} />
          ))}
          <line
            x1={78}
            y1={cy}
            x2={162}
            y2={cy}
            stroke="#8A93A3"
            strokeWidth={2}
            strokeDasharray="4 5"
          />
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#4B5B6B">
            対決
          </text>
        </g>
      )}

      {type === "gym-circle" && (
        <g>
          <circle cx={cx} cy={cy} r={54} fill="none" stroke="#E4D6B8" strokeWidth={3} />
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
            const r = 48;
            return (
              <Figure
                key={i}
                x={cx + r * Math.cos(angle)}
                y={cy + r * Math.sin(angle) * 0.75}
                color={COLORS[i % COLORS.length]}
                scale={0.9}
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

      {type === "desk-group" && (
        <g>
          <rect x={cx - 42} y={cy - 14} width={84} height={34} rx={6} fill="#D8DFEA" />
          <Figure x={cx - 54} y={cy - 6} color={COLORS[0]} scale={0.85} />
          <Figure x={cx + 54} y={cy - 6} color={COLORS[1]} scale={0.85} />
          <Figure x={cx - 20} y={cy - 40} color={COLORS[2]} scale={0.85} />
          <Figure x={cx + 20} y={cy - 40} color={COLORS[3]} scale={0.85} />
        </g>
      )}

      {type === "quiz" && (
        <g>
          <rect x={150} y={28} width={70} height={46} rx={6} fill="#FFFFFF" stroke="#B9CEDD" strokeWidth={3} />
          <text x={185} y={60} textAnchor="middle" fontSize="26" fontWeight="bold" fill="#1F7A9E">
            ？
          </text>
          <Figure x={185} y={116} color={COLORS[0]} scale={1.1} armsUp />
          {Array.from({ length: 3 }).map((_, i) => (
            <g key={i}>
              <Chair x={38 + i * 38} y={96} scale={0.85} />
              <Figure x={38 + i * 38} y={96} color={COLORS[(i + 1) % COLORS.length]} scale={0.85} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
