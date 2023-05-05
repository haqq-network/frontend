export type LogoType = 'full' | 'sign' | 'text' | 'mark';

export type BrandColorsNames =
  | 'haqq-orange'
  | 'haqq-blue'
  | 'haqq-seaweed'
  | 'haqq-big-foot-feet'
  | 'haqq-azure'
  | 'islamic-primary';

export type BrandColorsType = 'main' | 'gradient';
export interface CustomImage {
  size: {
    width: number;
    height: number;
  };
  svgPath: string;
  pngPath: string;
}

export interface BrandColorAsset {
  color: BrandColorsNames;
  colorType: BrandColorsType;
  hex: string;
}

export interface BrandAsset extends CustomImage {
  logoType: LogoType;
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
    logoType: 'mark',
    size: {
      width: 58,
      height: 58,
    },
    svgPath: '../assets/islamic-mark.svg',
    pngPath: '../assets/islamic-mark.png',
  },
];

export const haqqBrandColors: BrandColorAsset[] = [
  {
    color: 'haqq-orange',
    colorType: 'main',
    hex: '#EC5728',
  },
  {
    color: 'haqq-blue',
    colorType: 'gradient',
    hex: '#091D53',
  },
  {
    color: 'haqq-seaweed',
    colorType: 'gradient',
    hex: '#157C83',
  },
  {
    color: 'haqq-big-foot-feet',
    colorType: 'gradient',
    hex: '#E98C50',
  },
  {
    color: 'haqq-azure',
    colorType: 'gradient',
    hex: '#ECFEFE',
  },
];

export const islamicBrandColors: BrandColorAsset[] = [
  {
    color: 'islamic-primary',
    colorType: 'main',
    hex: '#04D484',
  },
];
