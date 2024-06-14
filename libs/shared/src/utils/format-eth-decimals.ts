import { formatUnits } from 'viem';

export function formatEthDecimal(value: bigint, precision = 2, decimals = 18) {
  const data = +formatUnits(value, decimals);

  if (data > 1) {
    return formatNumberWithSuffix(data, precision);
  }

  return data.toFixed(precision);
}

export function numberWithCommas(value: number, precision: number) {
  const fixedNumber = value.toFixed(precision);
  const parts = fixedNumber.split('.');

  const withCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts[1] ? withCommas + '.' + parts[1] : withCommas;
}

export function formatNumberWithSuffix(num: number, precision: number) {
  const map = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    // { suffix: 'K', threshold: 1e3 },
    { suffix: '', threshold: 1 },
  ];
  const absNum = Math.abs(num);
  let found;
  for (let i = 0; i < map.length; i++) {
    if (absNum >= map[i].threshold) {
      found = map[i];
      break;
    }
  }

  if (!found) {
    return numberWithCommas(num, precision);
  }

  return `${numberWithCommas(num / found.threshold, precision)}${found.suffix}`;
}
