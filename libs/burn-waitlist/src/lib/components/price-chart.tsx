'use client';

import { useId, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
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

const DEFAULT_HEIGHT = 240;
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
 * Price chart built with Recharts (SVG-based). Web3-style dark card.
 * @see https://recharts.org/
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

  const chartData = useMemo(
    () =>
      expandedData.map((d) => ({
        ...d,
        timeLabel: formatChartTime(d.timestamp),
      })),
    [expandedData],
  );

  const formatPrice = useMemo(
    () => (p: number) =>
      priceInAtto && p > 0 ? formatEthDecimal(BigInt(p), 2, 0) : p.toFixed(2),
    [priceInAtto],
  );

  const currentPriceFormatted = useMemo(() => {
    if (!chartData.length) return '0';
    return formatPrice(chartData[chartData.length - 1]!.price);
  }, [chartData, formatPrice]);

  const isSinglePoint = chartData.length === 1;

  const gradientId = `price-chart-gradient-${uid.replace(/:/g, '')}`;

  if (error) {
    return (
      <div
        className="border-haqq-border bg-haqq-black/80 rounded-xl border p-6 text-center"
        style={{ minHeight: height }}
      >
        <div className="text-haqq-modal-border text-sm">
          Failed to load price chart
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="border-haqq-border bg-haqq-black/50 animate-pulse rounded-xl border"
        style={{ height, width: '100%' }}
      />
    );
  }

  if (!data.length) {
    return (
      <div
        className="border-haqq-border bg-haqq-black/80 rounded-xl border p-6 text-center"
        style={{ minHeight: height }}
      >
        <div className="text-haqq-modal-border text-sm">No chart data yet</div>
      </div>
    );
  }

  return (
    <div className="border-haqq-border bg-haqq-black/95 w-full overflow-hidden rounded-xl border shadow-lg">
      <div className="border-haqq-border flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <span className="text-haqq-modal-border text-xs font-medium uppercase tracking-wider">
          Price history
        </span>
        <div className="flex items-baseline gap-2">
          {isSinglePoint && (
            <span className="bg-haqq-seaweed/20 text-haqq-seaweed rounded px-2 py-0.5 text-[10px] font-medium">
              Holding
            </span>
          )}
          <span className="text-haqq-azure font-mono text-sm font-semibold tabular-nums">
            {currentPriceFormatted}
          </span>
          <span className="text-haqq-modal-border text-[10px]">ISLM/HAQQ</span>
        </div>
      </div>

      <div
        className="px-2 py-3"
        style={{ width: '100%', height, minHeight: 200 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 16, right: 24, bottom: 28, left: 16 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#157C83" stopOpacity={0.3} />
                <stop offset="60%" stopColor="#157C83" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#157C83" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              stroke="#FFFFFF1A"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(ts: number) => formatChartTime(ts)}
              stroke="#C5C5C5"
              tick={{ fill: '#C5C5C5', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="price"
              type="number"
              domain={['auto', 'auto']}
              tickFormatter={(p: number) => formatPrice(p)}
              stroke="#C5C5C5"
              tick={{ fill: '#C5C5C5', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickMargin={12}
            />
            <Tooltip
              content={({
                active,
                payload,
              }: {
                active?: boolean;
                payload?: ReadonlyArray<{
                  payload: {
                    timestamp: number;
                    price: number;
                    timeLabel: string;
                  };
                }>;
              }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0]?.payload as {
                  timestamp: number;
                  price: number;
                  timeLabel: string;
                };
                if (!point) return null;
                return (
                  <div className="border-haqq-border bg-haqq-black rounded-lg border px-3 py-2 shadow-xl">
                    <div className="text-haqq-modal-border text-[10px]">
                      {point.timeLabel}
                    </div>
                    <div className="text-haqq-azure font-mono text-sm font-semibold tabular-nums">
                      {formatPrice(point.price)} ISLM
                    </div>
                  </div>
                );
              }}
              cursor={{ stroke: '#C5C5C5', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#157C83"
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
