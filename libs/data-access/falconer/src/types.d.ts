export interface FalconerRequestInit extends RequestInit {
  next?: {
    revalidate?: number;
  };
}
