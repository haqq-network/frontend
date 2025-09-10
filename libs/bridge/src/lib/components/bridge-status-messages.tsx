'use client';

import React from 'react';

interface Token {
  symbol: string;
  address: string;
  name?: string;
  decimals?: number;
  formattedBalance?: number;
}

interface BridgeStatusMessagesProps {
  tokensError?: string | null;
  isLoadingTokens?: boolean;
  userTokens?: any[];
  needsApproval?: boolean;
  selectedToken?: Token | null;
}

const ETH_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export function BridgeStatusMessages({
  tokensError,
  isLoadingTokens,
  userTokens = [],
  needsApproval,
  selectedToken,
}: BridgeStatusMessagesProps) {
  return (
    <>
      {tokensError && (
        <div className="mb-4 rounded-lg bg-yellow-50 p-4 text-yellow-700">
          <p className="text-sm">
            Failed to load token balances: {tokensError}
          </p>
          <p className="mt-1 text-xs">
            Using fallback token list. Check console for details.
          </p>
        </div>
      )}

      {isLoadingTokens && (
        <div className="mb-4 rounded-lg bg-blue-50 p-4 text-blue-700">
          <p className="text-sm">Loading your token balances...</p>
        </div>
      )}

      {!isLoadingTokens && !tokensError && userTokens.length > 0 && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
          <p className="text-sm">
            Loaded {userTokens.length} token
            {userTokens.length !== 1 ? 's' : ''} from your wallet
          </p>
        </div>
      )}

      {needsApproval &&
        selectedToken &&
        selectedToken.address !== ETH_TOKEN_ADDRESS && (
          <div className="mb-4 rounded-lg bg-blue-50 p-4 text-blue-700">
            <p className="text-sm font-medium">Approval Required</p>
            <p className="mt-1 text-xs">
              You need to approve the bridge contract to spend your{' '}
              {selectedToken.symbol} tokens. This is a one-time transaction
              required before bridging ERC-20 tokens.
            </p>
          </div>
        )}
    </>
  );
}
