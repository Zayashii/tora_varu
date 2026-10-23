import { PROCESS_LANES, PROCESS_STEPS } from './content';
import s from './landing.module.css';

// Нүүрний гол дүрслэл: бизнес → процесс → систем эгнээ дундуур
// нэг удаа зурагдах процессын шугам.

const LANES = PROCESS_LANES.length;
const LAST = PROCESS_STEPS.length - 1;

// ---------- Босоо зураглал ----------
const V_W = 360;
const V_HEAD = 44;
const V_LANE = V_W / LANES;
const V_NODE_W = 100;
const V_NODE_H = 40;
const V_STEP = 64;
const V_H = V_HEAD + 36 + LAST * V_STEP + 48;

const vNodes = PROCESS_STEPS.map((st, i) => ({
  ...st,
  cx: V_LANE * st.lane + V_LANE / 2,
  cy: V_HEAD + 36 + i * V_STEP,
}));

function vPath() {
  let d = `M ${vNodes[0].cx} ${V_HEAD + 4} V ${vNodes[0].cy - V_NODE_H / 2}`;
  for (let i = 0; i < LAST; i += 1) {
    const a = vNodes[i];
    const b = vNodes[i + 1];
    const y1 = a.cy + V_NODE_H / 2;
    const y2 = b.cy - V_NODE_H / 2;
    const mid = (y1 + y2) / 2;
    d += ` M ${a.cx} ${y1} V ${mid} H ${b.cx} V ${y2}`;
  }
  return d;
}

// ----------------------------------------------------------------------

function Node({ cx, cy, w, h, label, end, delay }) {
  return (
    <g className={s.mapNode} style={{ animationDelay: `${delay}s` }}>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={h / 2}
        className={end ? s.nodeEnd : s.nodeBox}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" className={s.nodeText}>
        {label}
      </text>
    </g>
  );
}

const TITLE =
  'Төслийн явц: санаа, процессын зураглал, шаардлага, хөгжүүлэлт, нэвтрүүлэлт, үр дүн';

export default function ProcessMap() {
  return (
    <figure className={s.mapFigure}>
      <svg className={s.map} viewBox={`0 0 ${V_W} ${V_H}`} role="img" aria-label={TITLE}>
        {PROCESS_LANES.map((lane, i) => (
          <g key={lane}>
            <rect x={i * V_LANE} y="0" width={V_LANE} height={V_H} className={i % 2 ? s.laneB : s.laneA} />
            <text x={i * V_LANE + V_LANE / 2} y="28" textAnchor="middle" className={s.laneLabel}>
              {lane}
            </text>
          </g>
        ))}
        <line x1="0" y1={V_HEAD} x2={V_W} y2={V_HEAD} className={s.laneDivider} />
        <path d={vPath()} pathLength="1" className={s.mapPath} />
        {vNodes.map((n, i) => (
          <Node
            key={n.label}
            cx={n.cx}
            cy={n.cy}
            w={V_NODE_W}
            h={V_NODE_H}
            label={n.label}
            end={i === LAST}
            delay={0.25 + i * 0.32}
          />
        ))}
      </svg>
    </figure>
  );
}
