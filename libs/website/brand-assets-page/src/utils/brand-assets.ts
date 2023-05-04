export type CustomImage = {
  size: {
    width: number;
    height: number;
  };
  svgPath: string;
  pngPath: string;
};

export interface BrandAsset extends CustomImage {
  logoType: 'full' | 'sign' | 'text';
}

export const haqqLogos: BrandAsset[] = [
  {
    logoType: 'full',
    svgPath: '../assets/haqq-logo.svg',
    pngPath: '../assets/haqq-logo.png',
    size: {
      width: 147,
      height: 38,
    },
  },
  {
    logoType: 'full',
    svgPath: '../assets/haqq-logo-vertical.svg',
    pngPath: '../assets/haqq-logo-vertical.png',
    size: {
      width: 96,
      height: 81,
    },
  },
  {
    logoType: 'sign',
    svgPath: '../assets/haqq-sign.svg',
    pngPath: '../assets/haqq-sign.png',
    size: {
      width: 52,
      height: 52,
    },
  },
  {
    logoType: 'text',
    svgPath: '../assets/haqq-logo-text.svg',
    pngPath: '../assets/haqq-logo-text.png',
    size: {
      width: 120,
      height: 40,
    },
  },
];

export const islamicLogos: BrandAsset[] = [
  {
    logoType: 'full',

    size: {
      width: 215,
      height: 34,
    },
    svgPath: '../assets/islamic-logo.svg',
    pngPath: '../assets/islamic-logo.png',
  },
  {
    logoType: 'sign',

    size: {
      width: 52,
      height: 52,
    },
    pngPath: '../assets/islamic-sign.png',
    svgPath: '../assets/islamic-sign.svg',
  },
  {
    logoType: 'text',

    size: {
      width: 58,
      height: 58,
    },
    svgPath: '../assets/islamic-mark.png',
    pngPath: '../assets/islamic-mark.png',
  },
];

export const haqqWhiteLogos: BrandAsset[] = [
  {
    logoType: 'full',

    svgPath: '../assets/haqq-logo-white.svg',
    pngPath: '../assets/haqq-logo-white.png',
    size: {
      width: 147,
      height: 38,
    },
  },
  {
    logoType: 'full',

    svgPath: '../assets/haqq-logo-vertical-white.svg',
    pngPath: '../assets/haqq-logo-vertical-white.png',
    size: {
      width: 96,
      height: 81,
    },
  },
  {
    logoType: 'sign',

    svgPath: '../assets/haqq-sign.svg',
    pngPath: '../assets/haqq-sign.png',
    size: {
      width: 52,
      height: 52,
    },
  },
  {
    logoType: 'text',

    svgPath: '../assets/haqq-logo-text-white.svg',
    pngPath: '../assets/haqq-logo-text-white.png',
    size: {
      width: 120,
      height: 40,
    },
  },
];
