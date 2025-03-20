export interface FalconerRequestInit extends RequestInit {
  next?: {
    revalidate?: number;
  };
}

export const FALCONER_ENDPOINT = 'https://falconer.haqq.network' as const;
