const DEFAULT_LOCALE = 'en-US';

// Matches language tags as defined in RFC 5646
const regex =
  /^((?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))|((?:([A-Za-z]{2,3}(-(?:[A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[A-Za-z]{4}|[A-Za-z]{5,8})(-(?:[A-Za-z]{4}))?(-(?:[A-Za-z]{2}|[0-9]{3}))?(-(?:[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(-(?:[0-9A-WY-Za-wy-z](-[A-Za-z0-9]{2,8})+))*(-(?:x(-[A-Za-z0-9]{1,8})+))?)|(?:x(-[A-Za-z0-9]{1,8})+))$/;

export function formatNumber(
  numberToFormat: number | string,
  minimumFractionDigits = 0,
  maximumFractionDigits = 3,
  locale = DEFAULT_LOCALE,
) {
  // Convert string to number if needed
  const numValue =
    typeof numberToFormat === 'string'
      ? parseFloat(numberToFormat)
      : numberToFormat;

  // Check if the conversion resulted in a valid number
  if (isNaN(numValue)) {
    console.warn(`Invalid number format: "${numberToFormat}"`);
    return '0';
  }

  if (!regex.test(locale)) {
    console.warn(
      `Invalid locale "${locale}". Falling back to default locale "${DEFAULT_LOCALE}".`,
    );
    locale = DEFAULT_LOCALE;
  }

  return numValue.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}
