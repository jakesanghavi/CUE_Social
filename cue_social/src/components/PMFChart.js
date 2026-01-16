import { useMemo, useRef, useState, useEffect } from 'react';

/* ------------------ math helpers ------------------ */
// function binomial(n, k) {
//   if (k < 0 || k > n) return 0;
//   let res = 1;
//   for (let i = 1; i <= k; i++) {
//     res *= (n - (k - i));
//     res /= i;
//   }
//   return res;
// }

// function binomialPMF(n, p, k) {
//   return binomial(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
// }

function gaussianKernel(x, h) {
  return Math.exp(-0.5 * (x / h) ** 2);
}

function smoothPMF(pmf, bandwidth = 0.6) {
  return pmf.map(d => {
    let sum = 0;
    let weight = 0;

    for (let j = 0; j < pmf.length; j++) {
      const w = gaussianKernel(d.k - pmf[j].k, bandwidth);
      sum += pmf[j].prob * w;
      weight += w;
    }

    return { k: d.k, y: sum / weight };
  });
}

function perPackPMFFromOddsList(oddsList) {
  // Start with P(0) = 1
  let pmf = [{ k: 0, prob: 1 }];

  for (const p of oddsList) {
    const next = new Map();

    for (const { k, prob } of pmf) {
      // no hit from this source
      next.set(
        k,
        (next.get(k) || 0) + prob * (1 - p)
      );

      // hit from this source
      next.set(
        k + 1,
        (next.get(k + 1) || 0) + prob * p
      );
    }

    pmf = [...next.entries()].map(([k, prob]) => ({ k, prob }));
  }

  return pmf;
}

/**
 * Convolve two discrete PMFs
 */
function convolvePMFs(a, b) {
  const out = new Map();

  for (const x of a) {
    for (const y of b) {
      const k = x.k + y.k;
      out.set(k, (out.get(k) || 0) + x.prob * y.prob);
    }
  }

  return [...out.entries()].map(([k, prob]) => ({ k, prob }));
}

/**
 * Build PMF for total epics after opening N packs
 */
function pmfForNPacks(n, perPackPMF) {
  let pmf = [{ k: 0, prob: 1 }];

  for (let i = 0; i < n; i++) {
    pmf = convolvePMFs(pmf, perPackPMF);
  }

  return pmf;
}

/* ------------------ component ------------------ */
export default function PMFChart({ label, probability, spend, cost, color, type, name, odds_list }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(320); // default
  const [hoverK, setHoverK] = useState(null);

  // Adjusted label
  let label2 = label;
  label2 = label2.replace('1+ New Card', '1+ New Cards');
  label2 = label2.replace('1+', 'Expected Number of');
  label2 = label2.replace('Limited Legendary', 'Limited Legendaries');
  label2 = label2.replace('Limited Epic', 'Limited Epics');

  const draws = Math.floor(spend / cost);
  const valid = draws > 0 && probability > 0;

  // Special coin legendary case
  const isCoinLegendary = type === 'coin' && /Legendary/i.test(label);
  const coinLegendaryValue = isCoinLegendary ? Math.floor(spend / 250000) : null;

  const stratospheric = /Stratospheric/i.test(name);
  const stratosphericValue = stratospheric
    ? /Legendary/i.test(label)
      ? (6 * (spend / cost)).toFixed(1)
      : /Epic/i.test(label)
        ? (12 * (spend / cost)).toFixed(1)
        : null
    : null;

  const grabBag = /Grab Bag/i.test(name);
  const grabBagValue = grabBag
    ? /Legendary/i.test(label)
      ? (1 * (spend / cost)).toFixed(1)
      : /Epic/i.test(label)
        ? (2 * (spend / cost)).toFixed(1)
        : null
    : null;
  const albumLegendary = /Album Legendary/i.test(name);
  const albumLegendaryValue = albumLegendary
    ? /Legendary/i.test(label)
      ? (1 * (spend / cost)).toFixed(1)
      : /Epic/i.test(label)
        ? 0
        : null
    : null;

  /* -------- resize observer for responsive width -------- */
  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (let entry of entries) setContainerWidth(entry.contentRect.width);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /* -------- PMF + KDE (hooks called unconditionally) -------- */
  const perPackPMF = useMemo(() => {
    if (!odds_list || odds_list.length === 0) return null;
    return perPackPMFFromOddsList(odds_list);
  }, [odds_list]);

  const totalPMF = useMemo(() => {
    if (!valid || !perPackPMF || isCoinLegendary) return [];
    return pmfForNPacks(draws, perPackPMF);
  }, [valid, draws, perPackPMF, isCoinLegendary]);

  const mean = useMemo(() => {
    if (!totalPMF.length || !valid) return 0;
    return totalPMF.reduce((s, d) => s + d.k * d.prob, 0);
  }, [totalPMF, valid]);

  console.log(label)
  console.log(mean)

  const std = useMemo(() => {
    if (!totalPMF.length || !valid) return 0;
    const mu = mean;
    return Math.sqrt(
      totalPMF.reduce((s, d) => s + (d.k - mu) ** 2 * d.prob, 0)
    );
  }, [totalPMF, mean, valid]);

  // const mean = valid ? draws * probability : 0;
  // const std = valid ? Math.sqrt(draws * probability * (1 - probability)) : 0;
  const kSigma = 3;
  // let xMin = valid ? Math.max(0, Math.floor(mean - kSigma * std)) : 0;
  // let xMax = valid ? Math.min(draws, Math.ceil(mean + kSigma * std)) : 1;
  const halfWidth = Math.ceil(kSigma * std);
  let xMin = Math.max(0, Math.floor(mean - halfWidth));
  let xMax = Math.ceil(mean + halfWidth);
  if (valid && xMax <= xMin) {
    xMin = Math.max(0, Math.floor(mean) - 2);
    xMax = Math.min(draws, Math.ceil(mean) + 2);
  }

  const pmf = useMemo(() => {
    if (!totalPMF.length || !valid || isCoinLegendary) return [];
    return totalPMF.filter(d => d.k >= xMin && d.k <= xMax);
  }, [totalPMF, xMin, xMax, valid, isCoinLegendary]);

  // const pmf = useMemo(() => {
  //   if (!valid || isCoinLegendary) return [];
  //   return Array.from({ length: xMax - xMin + 1 }, (_, i) => {
  //     const k = xMin + i;
  //     return { k, prob: binomialPMF(draws, probability, k) };
  //   });
  // }, [valid, draws, probability, xMin, xMax, isCoinLegendary]);

  const kde = useMemo(() => {
    if (!valid || pmf.length === 0 || isCoinLegendary) return [];
    return smoothPMF(pmf);
  }, [valid, pmf, isCoinLegendary]);

  // -------- chart layout --------
  const width = containerWidth;
  const height = 200;
  const padding = 36;
  const maxY = kde.length > 0 ? Math.max(...kde.map(d => d.y)) : 1;
  const scaleX = k => padding + ((k - xMin) / Math.max(1, xMax - xMin)) * (width - padding * 2);
  const scaleY = y => height - padding - (y / maxY) * (height - padding * 2);
  const path = kde.length > 0 ? kde.map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(d.k)} ${scaleY(d.y)}`).join(' ') : '';

  const handlePointer = clientX => {
    if (!valid || isCoinLegendary) return;
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = 0;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const percent = (svgP.x - padding) / (width - padding * 2);
    const k = Math.round(Math.max(xMin, Math.min(xMax, xMin + percent * (xMax - xMin))));
    setHoverK(k);
  };

  const hovered = valid ? pmf.find(d => d.k === hoverK) : null;
  const xTicks = valid ? [Math.round(xMin), Math.round(mean), Math.round(xMax)] : [];
  const yTicks = valid ? [0, maxY / 2, maxY] : [];

  const tooLarge = isNaN(maxY) || isNaN(mean);

  const showMeanLabel = !(isCoinLegendary || tooLarge || stratospheric || grabBag || albumLegendary);

  /* -------- render -------- */
  return (
    <div className="chart-block" ref={containerRef}>
      <div className="chart-label">
        {label2}{showMeanLabel ? `: ${mean.toFixed(1)}` : ''}
      </div>

      {isCoinLegendary ? (
        <div className="chart-empty" style={{ fontSize: '2rem', textAlign: 'center', padding: '3rem 0' }}>
          {coinLegendaryValue}
        </div>
      ) : tooLarge ? (
        <div className="chart-empty" style={{ fontSize: '1.5rem', textAlign: 'center', padding: '3rem 0' }}>
          Number of packs too large!
        </div>
      ) : !valid ? (
        <div className="chart-empty">Increase spend to see distribution</div>
      ) : stratospheric ? (
        <div className="chart-empty" style={{ fontSize: '2rem', textAlign: 'center', padding: '3rem 0' }}>
          {stratosphericValue}
        </div>
      ) : grabBag ? (
        <div className="chart-empty" style={{ fontSize: '2rem', textAlign: 'center', padding: '3rem 0' }}>
          {grabBagValue}
        </div>
      ) : albumLegendary ? (
        <div className="chart-empty" style={{ fontSize: '2rem', textAlign: 'center', padding: '3rem 0' }}>
          {albumLegendaryValue}
        </div>
      ) : (
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="kde-chart"
          onMouseMove={e => handlePointer(e.clientX)}
          onTouchStart={e => handlePointer(e.touches[0].clientX)}
          onTouchMove={e => handlePointer(e.touches[0].clientX)}
          onMouseLeave={() => setHoverK(null)}
        >
          {/* Y axis */}
          <line x1={padding} x2={padding} y1={padding} y2={height - padding} className="axis-line" />
          {yTicks.map((v, i) => (
            <text key={i} x={padding - 6} y={scaleY(v) + 4} textAnchor="end" className="axis-label">
              {(v * 100).toFixed(1)}%
            </text>
          ))}

          {/* X axis */}
          <line x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} className="axis-line" />
          {xTicks.map(v => (
            <text key={v} x={scaleX(v)} y={height - padding + 16} textAnchor="middle" className="axis-label">
              {v}
            </text>
          ))}

          {/* KDE curve */}
          <path d={path} fill="none" stroke={color} strokeWidth="3" />

          {/* Expected value marker */}
          <line
            x1={scaleX(mean)}
            x2={scaleX(mean)}
            y1={padding}
            y2={height - padding}
            stroke={color}
            strokeDasharray="4 4"
            opacity="0.6"
          />

          {/* Hover indicator */}
          {hovered && (
            <>
              <line x1={scaleX(hovered.k)} x2={scaleX(hovered.k)} y1={padding} y2={height - padding} className="hover-line" />
              {(() => {
                const isRightHalf = scaleX(hovered.k) > width / 2;
                return (
                  <g
                    transform={`translate(${scaleX(hovered.k) + (isRightHalf ? -138 : 8)}, ${scaleY(kde.find(d => d.k === hovered.k)?.y ?? maxY) - 28})`}
                    className="hover-tooltip"
                  >
                    <rect width="130" height="40" rx="8" className="tooltip-bg" />
                    <text x="8" y="16" className="tooltip-subtext">k = {hovered.k}</text>
                    <text x="8" y="30" className="tooltip-subtext">
                      P = {(hovered.prob * 100).toFixed(2)}%
                    </text>
                  </g>
                );
              })()}
            </>
          )}
        </svg>
      )}
    </div>
  );
}

