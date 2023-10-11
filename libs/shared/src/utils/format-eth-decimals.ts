import { formatUnits } from 'viem';

export function formatEthDecimal(value: bigint, precision = 2, decimals = 18) {
  const data = +formatUnits(value, decimals);

  if (data > 1) {
    return formatNumberWithSuffix(data, precision);
  }

  return data.toFixed(precision);
}

export function numberWithCommas(value: number, precision: number) {
  return value.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatNumberWithSuffix(num: number, precision: number) {
  const map = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    // { suffix: 'K', threshold: 1e3 },
    { suffix: '', threshold: 1 },
  ];

  const found = map.find((x) => {
    return Math.abs(num) >= x.threshold;
  });

  if (found) {
    return numberWithCommas(num / found.threshold, precision) + found.suffix;
  }

  return numberWithCommas(num, precision);
}
