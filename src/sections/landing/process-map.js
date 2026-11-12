import { useLang } from './i18n';
import s from './landing.module.css';

// Нүүрний гол дүрслэл: бизнес → процесс → систем эгнээ дундуур
// нэг удаа зурагдах процессын шугам.

const W = 360;
const HEAD = 44;
const NODE_W = 100;
const NODE_H = 40;
const STEP = 64;

function layout(lanes, steps) {
  const laneW = W / lanes.length;
  const last = steps.length - 1;
  const height = HEAD + 36 + last * STEP + 48;

  const nodes = steps.map((st, i) => ({
    ...st,
    cx: laneW * st.lane + laneW / 2,
    cy: HEAD + 36 + i * STEP,
  }));

  let d = `M ${nodes[0].cx} ${HEAD + 4} V ${nodes[0].cy - NODE_H / 2}`;
  for (let i = 0; i < last; i += 1) {
    const a = nodes[i];
    const b = nodes[i + 1];
    const y1 = a.cy + NODE_H / 2;
    const y2 = b.cy - NODE_H / 2;
    const mid = (y1 + y2) / 2;
    d += ` M ${a.cx} ${y1} V ${mid} H ${b.cx} V ${y2}`;
  }

  return { laneW, height, nodes, path: d, last };
}

export default function ProcessMap() {
  const { t } = useLang();
  const { lanes, nodes: steps, title } = t.process;
  const { laneW, height, nodes, path, last } = layout(lanes, steps);

  return (
    <figure className={s.mapFigure}>
      <svg className={s.map} viewBox={`0 0 ${W} ${height}`} role="img" aria-label={title}>
        {lanes.map((lane, i) => (
          <g key={i}>
            <rect x={i * laneW} y="0" width={laneW} height={height} className={i % 2 ? s.laneB : s.laneA} />
            <text x={i * laneW + laneW / 2} y="28" textAnchor="middle" className={s.laneLabel}>
              {lane}
            </text>
          </g>
        ))}
        <line x1="0" y1={HEAD} x2={W} y2={HEAD} className={s.laneDivider} />
        <path d={path} pathLength="1" className={s.mapPath} />
        {nodes.map((n, i) => (
          <g key={i} className={s.mapNode} style={{ animationDelay: `${0.25 + i * 0.32}s` }}>
            <rect
              x={n.cx - NODE_W / 2}
              y={n.cy - NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              rx={NODE_H / 2}
              className={i === last ? s.nodeEnd : s.nodeBox}
            />
            <text x={n.cx} y={n.cy + 5} textAnchor="middle" className={s.nodeText}>
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
