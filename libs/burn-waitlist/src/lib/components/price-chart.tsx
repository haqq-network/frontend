'use client';

import { useMemo } from 'react';
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

const CHART_PADDING = { top: 12, right: 12, bottom: 24, left: 48 };
const DEFAULT_HEIGHT = 200;

/**
 * Simple SVG line chart for price over time.
 * Uses no external chart library.
 */
export function PriceChart({
  data,
  height = DEFAULT_HEIGHT,
  priceInAtto = true,
  isLoading = false,
  error = null,
}: PriceChartProps) {
  const { pathD, minPrice, maxPrice, minTs, maxTs, width } = useMemo(() => {
    const width = 400;
    const innerWidth = width - CHART_PADDING.left - CHART_PADDING.right;
    const innerHeight = height - CHART_PADDING.top - CHART_PADDING.bottom;

    if (!data.length) {
      return { pathD: '', minPrice: 0, maxPrice: 0, minTs: 0, maxTs: 0, width };
    }

    const prices = data.map((d) => d.price);
    const timestamps = data.map((d) => d.timestamp);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minTs = Math.min(...timestamps);
    const maxTs = Math.max(...timestamps);
    const timeRange = maxTs - minTs || 1;
    // When all prices are the same, add vertical padding so the line is visible (not stuck at edge)
    const priceRange = maxPrice - minPrice || 1;
    const displayMinPrice =
      minPrice === maxPrice ? Math.max(0, minPrice - priceRange) : minPrice;
    const displayMaxPrice =
      maxPrice === minPrice ? maxPrice + priceRange : maxPrice;
    const displayPriceRange = displayMaxPrice - displayMinPrice || 1;

    const points = data.map((d, i) => {
      const x =
        CHART_PADDING.left + (innerWidth * (d.timestamp - minTs)) / timeRange;
      const y =
        CHART_PADDING.top +
        innerHeight -
        (innerHeight * (d.price - displayMinPrice)) / displayPriceRange;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    });
    let pathD = points.join(' ');
    // Single point: draw horizontal line across chart so it's visible
    if (data.length === 1) {
      const y =
        CHART_PADDING.top +
        innerHeight -
        (innerHeight * (data[0].price - displayMinPrice)) / displayPriceRange;
      pathD = `M ${CHART_PADDING.left} ${y} L ${width - CHART_PADDING.right} ${y}`;
    }

    return {
      pathD,
      minPrice,
      maxPrice,
      minTs,
      maxTs,
      width,
    };
  }, [data, height]);

  const formattedMinPrice = useMemo(() => {
    if (priceInAtto && (minPrice > 0 || maxPrice > 0)) {
      return formatEthDecimal(BigInt(minPrice), 4, 18);
    }
    return minPrice.toFixed(4);
  }, [minPrice, priceInAtto]);

  const formattedMaxPrice = useMemo(() => {
    if (priceInAtto && maxPrice > 0) {
      return formatEthDecimal(BigInt(maxPrice), 4, 18);
    }
    return maxPrice.toFixed(4);
  }, [maxPrice, priceInAtto]);

  if (error) {
    return (
      <div
        className="rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-[24px] text-center"
        style={{ minHeight: height }}
      >
        <div className="text-[14px] text-[#6B7280]">
          Failed to load price chart
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="animate-pulse rounded-[8px] border border-[#E5E7EB] bg-[#F3F4F6]"
        style={{ height, width: '100%' }}
      />
    );
  }

  if (!data.length) {
    return (
      <div
        className="rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-[24px] text-center"
        style={{ minHeight: height }}
      >
        <div className="text-[14px] text-[#6B7280]">No chart data yet</div>
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-[16px]">
      <div className="mb-[12px] text-[14px] font-[500] text-[#0D0D0E]">
        Price history
      </div>
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="max-h-[200px] min-h-[200px] w-full"
      >
        <defs>
          <linearGradient id="price-chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(34 197 94)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(34 197 94)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <text
          x={CHART_PADDING.left - 4}
          y={CHART_PADDING.top}
          textAnchor="end"
          className="fill-[#6B7280] text-[10px]"
        >
          {formattedMaxPrice}
        </text>
        <text
          x={CHART_PADDING.left - 4}
          y={height - CHART_PADDING.bottom}
          textAnchor="end"
          className="fill-[#6B7280] text-[10px]"
        >
          {formattedMinPrice}
        </text>
        <path
          d={`${pathD} L ${width - CHART_PADDING.right} ${height - CHART_PADDING.bottom} L ${CHART_PADDING.left} ${height - CHART_PADDING.bottom} Z`}
          fill="url(#price-chart-gradient)"
        />
        <path
          d={pathD}
          fill="none"
          stroke="rgb(34 197 94)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-[8px] text-[12px] text-[#6B7280]">ISLM per token</div>
    </div>
  );
}
