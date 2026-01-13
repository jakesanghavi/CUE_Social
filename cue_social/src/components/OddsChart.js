import { useRef } from 'react';

export default function OddsChart({
  label,
  color,
  values,
  hoverSpend,
  setHoverSpend,
  maxSpend,
  type
}) {
  const svgRef = useRef(null);
  const xMax = type === 'coin' ? 250000 : 1000;
  const xTicks =
    type === 'coin'
      ? [50000, 100000, 150000, 200000, 250000]
      : [250, 500, 750, 1000];

  const width = 700;
  const height = 200;
  const padding = 40;

  const minXval = 20;

  const scaleX = (v) =>
    padding +
    ((v - minXval) / (xMax - minXval)) * (width - padding * 2);

  const scaleY = (v) =>
    height - padding - (v / 100) * (height - padding * 2);

  const filteredValues = values.filter(v => v.spend >= minXval);

  // Assumes limleg coin pity at 250k
  const chartValues =
    type === 'coin' && label === "1+ Limited Legendary"
      ? [
        ...filteredValues,
        {
          spend: 250000,
          odds: 100
        }
      ]
      : filteredValues;

  const hoveredValue =
    hoverSpend !== null
      ? (() => {
        if (type === 'coin' && hoverSpend >= 250000 && label === "1+ Limited Legendary") {
          return { spend: 250000, odds: 100 };
        }

        return filteredValues.reduce((a, b) =>
          Math.abs(b.spend - hoverSpend) <
            Math.abs(a.spend - hoverSpend)
            ? b
            : a
        );
      })()
      : null;

  const handlePointer = (clientX) => {
    const svg = svgRef.current;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = 0;

    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const clampedX = Math.max(
      padding,
      Math.min(width - padding, svgP.x)
    );

    const percent =
      (clampedX - padding) / (width - padding * 2);

    setHoverSpend(
      minXval + percent * (xMax - minXval)
    );
  };

  const path = chartValues
    .map((d, i) =>
      `${i === 0 ? 'M' : 'L'} ${scaleX(d.spend)} ${scaleY(d.odds)}`
    )
    .join(' ');

  const isRightHalf =
    hoveredValue &&
    scaleX(hoveredValue.spend) > width / 2;

  return (
    <div className="chart-block">
      <div className="chart-label">{label}</div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="odds-chart"
        onMouseMove={(e) => handlePointer(e.clientX)}
        onTouchStart={(e) => handlePointer(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointer(e.touches[0].clientX)}
      >
        {/* Y axis */}
        <line
          x1={padding}
          x2={padding}
          y1={padding}
          y2={height - padding}
          className="axis-line"
        />

        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line
              x1={padding - 6}
              x2={padding}
              y1={scaleY(v)}
              y2={scaleY(v)}
              className="axis-tick"
            />
            <text
              x={padding - 10}
              y={scaleY(v) + 4}
              textAnchor="end"
              className="axis-label"
            >
              {v}%
            </text>
          </g>
        ))}

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(v => (
          <line
            key={v}
            x1={padding}
            x2={width - padding}
            y1={scaleY(v)}
            y2={scaleY(v)}
            className="grid-line"
          />
        ))}

        {/* X axis */}
        <line
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
          className="axis-line"
        />

        {xTicks.map(v => (
          <g key={v}>
            <line
              x1={scaleX(v)}
              x2={scaleX(v)}
              y1={height - padding}
              y2={height - padding + 6}
              className="axis-tick"
            />
            <text
              x={scaleX(v)}
              y={height - padding + 20}
              textAnchor="middle"
              className="axis-label"
            >
              {v.toLocaleString()} {type === 'coin' ? 'Coins' : 'Gems'}
            </text>
          </g>
        ))}


        {/* Curve */}
        <path d={path} stroke={color} strokeWidth="3" fill="none" />

        {/* Hover line */}
        {hoverSpend !== null && (
          <line
            x1={scaleX(hoverSpend)}
            x2={scaleX(hoverSpend)}
            y1={padding}
            y2={height - padding}
            className="hover-line"
          />
        )}

        {/* Hover dot */}
        {hoveredValue && (
          <circle
            cx={scaleX(hoveredValue.spend)}
            cy={scaleY(hoveredValue.odds)}
            r="5"
            fill={color}
          />
        )}
        {hoveredValue && hoveredValue.spend !== null && (
          <g
            transform={`translate(
              ${scaleX(hoveredValue.spend) + (isRightHalf ? -122 : 12)},
              ${scaleY(hoveredValue.odds) - 12}
            )`}
            className="hover-tooltip"
          >
            <rect
              width="110"
              height="44"
              rx="8"
              ry="8"
              className="tooltip-bg"
            />
            <text x="10" y="18" className="tooltip-subtext">
              Spend: {hoveredValue.spend.toFixed(0)}
            </text>
            <text x="10" y="34" className="tooltip-subtext">
              Odds: {hoveredValue.odds.toFixed(1)}%
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
