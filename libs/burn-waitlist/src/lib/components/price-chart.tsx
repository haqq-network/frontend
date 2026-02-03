'use client';

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import type { PriceChartPoint } from '../hooks/use-waitlist-price-chart';
import { formatEthDecimal } from '@haqq/shell-shared';

export interface PriceChartProps {
  data: PriceChartPoint[];
  /** Chart height in pixels */
  height?: number;
  /** Whether price values are in atto (wei) - will format for display */
  priceInAtto?: boolean;
  isLoading?: boolean;
  error?: Error | null;
}

const CHART_PADDING = { top: 32, right: 16, bottom: 36, left: 56 };
const DEFAULT_HEIGHT = 240;
const CHART_WIDTH = 600;
const GRID_LINES = 4;
const ONE_HOUR = 3600;

/**
 * Expands chart data by adding a point every hour from the last point up to now.
 * So a single API point becomes a line from that time to current time (same price).
 */
function expandDataWithHourlyPoints(
  data: Array<{ timestamp: number; price: number }>,
): Array<{ timestamp: number; price: number }> {
  if (!data.length) return [];
  const now = Math.floor(Date.now() / 1000);
  const last = data[data.length - 1]!;
  if (last.timestamp >= now) return data;
  const result: PriceChartPoint[] = [...data];
  for (let t = last.timestamp + ONE_HOUR; t <= now; t += ONE_HOUR) {
    result.push({ timestamp: t, price: last.price });
  }
  if (result[result.length - 1]!.timestamp < now) {
    result.push({ timestamp: now, price: last.price });
  }
  return result;
}

function formatChartTime(ts: number): string {
  const d = new Date(ts * 1000);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (isToday) {
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Web3-style price chart: dark card, grid, gradient fill, time axis.
 */
export function PriceChart({
  data,
  height = DEFAULT_HEIGHT,
  priceInAtto = true,
  isLoading = false,
  error = null,
}: PriceChartProps) {
  const uid = useId();
  const expandedData = useMemo(() => expandDataWithHourlyPoints(data), [data]);
  const {
    pathD,
    areaPathD,
    minPrice,
    maxPrice,
    minTs,
    maxTs,
    width,
    innerWidth,
    gridY,
    timeLabels,
    formattedMinPrice,
    formattedMaxPrice,
    currentPriceFormatted,
    isSinglePoint,
    chartPoints,
    timeRange,
  } = useMemo(() => {
    const width = CHART_WIDTH;
    const innerWidth = width - CHART_PADDING.left - CHART_PADDING.right;
    const innerHeight = height - CHART_PADDING.top - CHART_PADDING.bottom;

    const empty = {
      pathD: '',
      areaPathD: '',
      minPrice: 0,
      maxPrice: 0,
      minTs: 0,
      maxTs: 0,
      width,
      innerWidth: 0,
      gridY: [] as number[],
      timeLabels: [] as { x: number; label: string }[],
      formattedMinPrice: '0',
      formattedMaxPrice: '0',
      currentPriceFormatted: '0',
      isSinglePoint: false,
      chartPoints: [] as { x: number; ts: number; price: number }[],
      timeRange: 0,
    };

    if (!expandedData.length) return empty;

    const prices = expandedData.map((d) => d.price);
    const timestamps = expandedData.map((d) => d.timestamp);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minTs = Math.min(...timestamps);
    const maxTs = Math.max(...timestamps);
    const timeRange = maxTs - minTs || 1;
    const priceRange = maxPrice - minPrice || 1;
    const displayMinPrice =
      minPrice === maxPrice ? Math.max(0, minPrice - priceRange) : minPrice;
    const displayMaxPrice =
      maxPrice === minPrice ? maxPrice + priceRange : maxPrice;
    const displayPriceRange = displayMaxPrice - displayMinPrice || 1;

    const chartPoints = expandedData.map((d) => ({
      x: CHART_PADDING.left + (innerWidth * (d.timestamp - minTs)) / timeRange,
      ts: d.timestamp,
      price: d.price,
    }));
    const points = chartPoints.map(({ x, ts, price }) => ({
      x,
      y:
        CHART_PADDING.top +
        innerHeight -
        (innerHeight * (price - displayMinPrice)) / displayPriceRange,
      price,
      ts,
    }));

    let pathD: string;
    if (expandedData.length === 1) {
      const y = points[0].y;
      pathD = `M ${CHART_PADDING.left} ${y} L ${width - CHART_PADDING.right} ${y}`;
    } else {
      pathD = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');
    }

    const areaPathD = `${pathD} L ${width - CHART_PADDING.right} ${height - CHART_PADDING.bottom} L ${CHART_PADDING.left} ${height - CHART_PADDING.bottom} Z`;

    const gridY: number[] = [];
    for (let i = 0; i <= GRID_LINES; i++) {
      gridY.push(CHART_PADDING.top + (innerHeight * i) / GRID_LINES);
    }

    const timeLabels: { x: number; label: string }[] = [];
    if (expandedData.length === 1) {
      timeLabels.push(
        {
          x: CHART_PADDING.left,
          label: formatChartTime(minTs),
        },
        {
          x: width - CHART_PADDING.right,
          label: 'Now',
        },
      );
    } else {
      const step = Math.max(1, Math.floor(expandedData.length / 5));
      for (let i = 0; i < expandedData.length; i += step) {
        const d = expandedData[i];
        const x =
          CHART_PADDING.left + (innerWidth * (d.timestamp - minTs)) / timeRange;
        timeLabels.push({ x, label: formatChartTime(d.timestamp) });
      }
      if (expandedData.length > 0) {
        const last = expandedData[expandedData.length - 1];
        const x =
          CHART_PADDING.left +
          (innerWidth * (last.timestamp - minTs)) / timeRange;
        if (timeLabels[timeLabels.length - 1]?.x !== x) {
          timeLabels.push({ x, label: formatChartTime(last.timestamp) });
        }
      }
    }

    const formatPrice = (p: number) =>
      priceInAtto && p > 0 ? formatEthDecimal(BigInt(p), 4, 0) : p.toFixed(4);

    return {
      pathD,
      areaPathD,
      minPrice,
      maxPrice,
      minTs,
      maxTs,
      width,
      innerWidth,
      gridY,
      timeLabels,
      formattedMinPrice: formatPrice(minPrice),
      formattedMaxPrice: formatPrice(maxPrice),
      currentPriceFormatted: formatPrice(
        expandedData[expandedData.length - 1]!.price,
      ),
      isSinglePoint: expandedData.length === 1,
      chartPoints,
      timeRange,
    };
  }, [expandedData, height, priceInAtto]);

  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    clientX: number;
    clientY: number;
    timestamp: number;
    price: number;
  } | null>(null);

  const getPriceAtTimestamp = useCallback(
    (timestamp: number): number => {
      const pts = chartPoints;
      if (!pts.length) return 0;
      if (timestamp <= pts[0]!.ts) return pts[0]!.price;
      if (timestamp >= pts[pts.length - 1]!.ts)
        return pts[pts.length - 1]!.price;
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i]!;
        const b = pts[i + 1]!;
        if (timestamp >= a.ts && timestamp <= b.ts) {
          const t = (timestamp - a.ts) / (b.ts - a.ts);
          return Math.round(a.price + t * (b.price - a.price));
        }
      }
      return pts[pts.length - 1]!.price;
    },
    [chartPoints],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const svg = svgRef.current;
      if (!svg || !chartPoints.length) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      const svgX = svgPt.x;
      const left = CHART_PADDING.left;
      const right = width - CHART_PADDING.right;
      if (svgX < left || svgX > right) {
        setTooltip(null);
        return;
      }
      const timestamp = Math.round(
        minTs + ((svgX - left) / innerWidth) * timeRange,
      );
      const price = getPriceAtTimestamp(timestamp);
      setTooltip({ clientX: e.clientX, clientY: e.clientY, timestamp, price });
    },
    [
      chartPoints.length,
      minTs,
      innerWidth,
      timeRange,
      width,
      getPriceAtTimestamp,
    ],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const tooltipPriceFormatted =
    priceInAtto && tooltip && tooltip.price > 0
      ? formatEthDecimal(BigInt(tooltip.price), 4, 0)
      : tooltip
        ? tooltip.price.toFixed(4)
        : '';

  if (error) {
    return (
      <div
        className="rounded-xl border border-zinc-700/50 bg-zinc-900/80 p-6 text-center"
        style={{ minHeight: height }}
      >
        <div className="text-sm text-zinc-400">Failed to load price chart</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="animate-pulse rounded-xl border border-zinc-700/50 bg-zinc-800/50"
        style={{ height, width: '100%' }}
      />
    );
  }

  if (!data.length) {
    return (
      <div
        className="rounded-xl border border-zinc-700/50 bg-zinc-900/80 p-6 text-center"
        style={{ minHeight: height }}
      >
        <div className="text-sm text-zinc-400">No chart data yet</div>
      </div>
    );
  }

  const gradientId = `price-chart-gradient-${uid.replace(/:/g, '')}`;
  const glowId = `price-chart-glow-${uid.replace(/:/g, '')}`;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900/95 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-700/50 px-4 py-3">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Price history
        </span>
        <div className="flex items-baseline gap-2">
          {isSinglePoint && (
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              Holding
            </span>
          )}
          <span className="font-mono text-sm font-semibold tabular-nums text-white">
            {currentPriceFormatted}
          </span>
          <span className="text-[10px] text-zinc-500">ISLM/token</span>
        </div>
      </div>

      <div
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="block max-h-[240px] min-h-[200px] w-full"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#34d399" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={CHART_PADDING.left}
              y1={gridY[i]}
              x2={width - CHART_PADDING.right}
              y2={gridY[i]}
              stroke="rgb(63 63 70 / 0.4)"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Y-axis labels */}
          <text
            x={CHART_PADDING.left - 8}
            y={CHART_PADDING.top}
            textAnchor="end"
            className="fill-zinc-500 font-mono text-[10px] tabular-nums"
          >
            {formattedMaxPrice}
          </text>
          <text
            x={CHART_PADDING.left - 8}
            y={height - CHART_PADDING.bottom}
            textAnchor="end"
            className="fill-zinc-500 font-mono text-[10px] tabular-nums"
          >
            {formattedMinPrice}
          </text>

          {/* Area fill */}
          <path d={areaPathD} fill={`url(#${gradientId})`} />

          {/* Line with glow */}
          <path
            d={pathD}
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${glowId})`}
          />

          {/* X-axis time labels */}
          {timeLabels.map(({ x, label }, i) => (
            <text
              key={i}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="fill-zinc-500 text-[9px]"
            >
              {label}
            </text>
          ))}
        </svg>

        {tooltip && (
          <div
            className="pointer-events-none fixed z-50 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 shadow-xl"
            style={{
              left: tooltip.clientX + 12,
              top: tooltip.clientY + 12,
            }}
          >
            <div className="text-[10px] text-zinc-400">
              {formatChartTime(tooltip.timestamp)}
            </div>
            <div className="font-mono text-sm font-semibold tabular-nums text-white">
              {tooltipPriceFormatted} ISLM
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-700/50 px-4 py-2">
        <div className="text-[10px] text-zinc-500">
          ISLM per token · updates from chain
        </div>
      </div>
    </div>
  );
}
