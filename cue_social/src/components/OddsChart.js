import { useRef } from 'react';

export default function OddsChart({
  label,
  color,
  values,
  hoverSpend,
  setHoverSpend,
  maxSpend
}) {
  const svgRef = useRef(null);

  const width = 700;
  const height = 200;
  const padding = 40;

  const scaleX = (v) =>
    padding + (v / maxSpend) * (width - padding * 2);

  const scaleY = (v) =>
    height - padding - (v / 100) * (height - padding * 2);

  const path = values
    .map((d, i) =>
      `${i === 0 ? 'M' : 'L'} ${scaleX(d.spend)} ${scaleY(d.odds)}`
    )
    .join(' ');

  const hoveredValue =
    hoverSpend !== null
      ? values.reduce((a, b) =>
        Math.abs(b.spend - hoverSpend) <
          Math.abs(a.spend - hoverSpend)
          ? b
          : a
      )
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

    setHoverSpend(percent * maxSpend);
  };

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

        {[0, 250, 500, 750, 1000].map(v => (
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
              {v} Gems
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
            transform={`translate(${scaleX(hoveredValue.spend) + 12}, ${scaleY(hoveredValue.odds) - 12})`}
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

      {hoveredValue && (
        <div className="chart-value">
          {hoveredValue.odds.toFixed(1)}%
        </div>
      )}
    </div>
  );
};
