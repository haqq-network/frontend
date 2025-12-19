import { TallyResults } from '@haqq/data-access-cosmos';

// Convert string vote count to BigInt
export function parseVoteCount(value: string): bigint {
  try {
    return BigInt(value);
  } catch {
    return BigInt(0);
  }
}

// Calculate total votes
export function calculateTotalVotes(results: TallyResults): bigint {
  return (
    parseVoteCount(results.yes_count) +
    parseVoteCount(results.abstain_count) +
    parseVoteCount(results.no_count) +
    parseVoteCount(results.no_with_veto_count)
  );
}

// Calculate vote percentage
export function calculateVotePercentageAndBigInt(
  voteCount: string,
  totalVotes: bigint,
): { percentage: number; valueBigInt: bigint } {
  if (totalVotes === BigInt(0)) {
    return { percentage: 0, valueBigInt: BigInt(0) };
  }

  const count = parseVoteCount(voteCount);

  // Use even more precision (1e36) and adjust calculation order
  const multiplier = BigInt(1e36);
  const percentage =
    Number.parseFloat(
      (
        (count * multiplier * BigInt(100)) /
        totalVotes /
        (multiplier / BigInt(1e18))
      ).toString(),
    ) / 1e18;

  return {
    percentage,
    valueBigInt: count,
  };
}

// Format vote results with percentages
export interface VoteResultsWithPercentages {
  yes: { value: string; percentage: number; valueBigInt: bigint };
  abstain: { value: string; percentage: number; valueBigInt: bigint };
  no: { value: string; percentage: number; valueBigInt: bigint };
  noWithVeto: { value: string; percentage: number; valueBigInt: bigint };
  total: string;
  totalBigInt: bigint;
}

export function formatVoteResults(
  results?: TallyResults,
): VoteResultsWithPercentages {
  if (!results) {
    return {
      yes: { value: '0', percentage: 0, valueBigInt: BigInt(0) },
      abstain: { value: '0', percentage: 0, valueBigInt: BigInt(0) },
      no: { value: '0', percentage: 0, valueBigInt: BigInt(0) },
      noWithVeto: { value: '0', percentage: 0, valueBigInt: BigInt(0) },
      total: '0',
      totalBigInt: BigInt(0),
    };
  }

  const totalVotes = calculateTotalVotes(results);

  return {
    yes: {
      value: results.yes_count,
      ...calculateVotePercentageAndBigInt(results.yes_count, totalVotes),
    },
    abstain: {
      value: results.abstain_count,
      ...calculateVotePercentageAndBigInt(results.abstain_count, totalVotes),
    },
    no: {
      value: results.no_count,
      ...calculateVotePercentageAndBigInt(results.no_count, totalVotes),
    },
    noWithVeto: {
      value: results.no_with_veto_count,
      ...calculateVotePercentageAndBigInt(
        results.no_with_veto_count,
        totalVotes,
      ),
    },
    total: totalVotes.toString(),
    totalBigInt: totalVotes,
  };
}
