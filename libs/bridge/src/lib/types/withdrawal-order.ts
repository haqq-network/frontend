export enum WithdrawalStatus {
  INITIATED = 'initiated',
  PROVING = 'proving',
  PROVED = 'proved',
  FINALIZING = 'finalizing',
  FINALIZED = 'finalized',
  FAILED = 'failed',
}

export interface WithdrawalOrder {
  id: string;
  amount: number;
  toAddress: string;
  fromAddress: string;
  initiateHash: string;
  proveHash?: string;
  finalizeHash?: string;
  status: WithdrawalStatus;
  createdAt: number;
  updatedAt: number;
  sourceChainId: number;
  targetChainId: number;
  tokenSymbol: string;
  error?: string;
  // Timer information for prove and finalize steps
  timeToProve?: {
    seconds: number;
    timestamp: number;
  };
  timeToFinalize?: {
    seconds: number;
    timestamp: number;
  };
}

export interface WithdrawalOrderStorage {
  orders: WithdrawalOrder[];
  lastUpdated: number;
}
