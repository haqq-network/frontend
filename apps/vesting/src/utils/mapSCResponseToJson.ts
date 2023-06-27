export interface Contract {
  sumInWeiDeposited: bigint;
  sumPaidAlready: bigint;
  timestamp: bigint;
}

export function mapSCResponseToJson(
  contract: Contract,
  available: bigint,
  period: bigint,
) {
  const deposited = contract.sumInWeiDeposited;
  const withdrawn = contract.sumPaidAlready;
  const unlocked = contract.sumPaidAlready + available;
  const locked = deposited - unlocked;

  return {
    locked,
    unlocked,
    available,
    deposited,
    withdrawn,
    createdAt: new Date(Number(contract.timestamp) * 1000).toISOString(),
    unlockPeriod: Number(period),
  };
}
