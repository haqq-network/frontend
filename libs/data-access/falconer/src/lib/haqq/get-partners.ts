import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';

interface Partner {
  logoUrl: string;
  logoWidth?: number;
  logoHeight?: number;
  name: string;
  description: string;
  type: PartnerType;
  status: PartnerStatus;
  link: string;
  className?: string;
  _uid?: string;
}

export enum PartnerType {
  INFRASTRUCTURE = 'infrastructure',
  WALLET = 'wallet',
  DEFI = 'defi',
  BRIDGE = 'bridge',
  PAYMENTS = 'payments',
  SERVICE = 'service',
  INSTITUTIONAL = 'institutional',
}

export enum PartnerStatus {
  LIVE = 'live',
  PLANNED = 'planned',
}

export async function getHAQQPartners(options: Partial<FalconerRequestInit>) {
  const requestUrl = new URL('/haqq/partners', FALCONER_ENDPOINT);
  const response = await fetch(requestUrl, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    throw new Error('Partners fetch failed');
  }

  const responseJson = await response.json();
  console.log({ responseJson });

  return responseJson.partners as Partner[];
}
