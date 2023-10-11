import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

export const fromWei = (
  b: BigNumber | number,
  decimals: number | undefined = 18,
) => {
  return formatUnits(b, decimals);
};

export const formatEthDecimal = (
  value: BigNumber | number,
  precision = 2,
  decimals = 18,
) => {
  const data = +fromWei(value, decimals);
  if (data > 1) {
    return formatNumber(data, precision);
  }

  return data.toFixed(precision);
};

const formatNumber = (num: number, precision: number) => {
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
};

export function numberWithCommas(x: number, precision: number) {
  return x.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
