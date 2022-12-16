import { BigNumber } from 'ethers';

export interface Contract {
  sumInWeiDeposited: BigNumber;
  sumPaidAlready: BigNumber;
  timestamp: BigNumber;
}

export function mapSCResponseToJson(
  contract: Contract,
  available: BigNumber,
  period: BigNumber,
) {
  const deposited = contract.sumInWeiDeposited;
  const withdrawn = contract.sumPaidAlready;
  const unlocked = contract.sumPaidAlready.add(available);
  const locked = deposited.sub(unlocked);

  return {
    locked,
    unlocked,
    available,
    deposited,
    withdrawn,
    createdAt: new Date(contract.timestamp.toNumber() * 1000).toISOString(),
    unlockPeriod: period.toNumber(),
  };
}
