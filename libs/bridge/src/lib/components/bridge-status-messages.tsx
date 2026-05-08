'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { getAddressExplorerUrl } from '@haqq/shell-shared';

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
  needsApproval?: boolean;
  selectedToken?: Token | null;
  isCheckingRemoteToken?: boolean;
  needsDeployment?: boolean;
  isDeploying?: boolean;
  deploymentError?: string | null;
  onDeployToken?: () => void;
  remoteTokenAddress?: string | null;
  remoteTokenChainId?: number;
  isProving?: boolean;
  isFinalizing?: boolean;
}

const ETH_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export function BridgeStatusMessages({
  tokensError,
  isLoadingTokens,
  needsApproval,
  selectedToken,
  isCheckingRemoteToken,
  needsDeployment,
  isProving,
  isFinalizing,
  onDeployToken,
  remoteTokenAddress,
  remoteTokenChainId,
}: BridgeStatusMessagesProps) {
  useEffect(() => {
    if (tokensError) {
      console.warn('Token Loading Error', tokensError);
    }
  }, [tokensError]);

  return (
    <>
      {isProving && (
        <div className="mb-4 rounded-lg bg-blue-50 p-4 text-blue-700">
          <p className="text-sm">Proving your transaction...</p>
        </div>
      )}
      {isFinalizing && (
        <div className="mb-4 rounded-lg bg-blue-50 p-4 text-blue-700">
          <p className="text-sm">Finalizing your transaction...</p>
        </div>
      )}
      {isLoadingTokens && (
        <div className="mb-4 rounded-lg bg-blue-50 p-4 text-blue-700">
          <p className="text-sm">Loading your token balances...</p>
        </div>
      )}

      {isCheckingRemoteToken &&
        selectedToken &&
        selectedToken.address !== ETH_TOKEN_ADDRESS && (
          <div className="mb-4 rounded-lg bg-blue-50 p-4 text-blue-700">
            <p className="text-sm font-medium">
              Checking Token on Destination Chain
            </p>
            <p className="mt-1 text-xs">
              Verifying if {selectedToken.symbol} exists on the destination
              chain...
            </p>
          </div>
        )}

      {needsDeployment &&
        selectedToken &&
        selectedToken.address !== ETH_TOKEN_ADDRESS && (
          <div className="mb-4 rounded-lg bg-orange-50 p-4 text-orange-700">
            <p className="text-sm font-medium">Token Deployment Required</p>
            <p className="mt-1 text-xs">
              {selectedToken.symbol} needs to be deployed on the destination
              chain before bridging. This is a one-time setup required for new
              tokens.
            </p>
            {onDeployToken && (
              <button
                onClick={onDeployToken}
                className="mt-2 rounded bg-orange-600 px-3 py-1 text-xs font-medium text-white hover:bg-orange-700 disabled:opacity-50"
              >
                Deploy ${selectedToken.symbol}
              </button>
            )}
          </div>
        )}

      {remoteTokenAddress &&
        selectedToken &&
        selectedToken.address !== ETH_TOKEN_ADDRESS && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
            <p className="text-sm font-medium">
              Token Available on Destination Chain
            </p>
            <p className="word-break-all mt-1 text-xs">
              {selectedToken.symbol} is available at:{' '}
              <Link
                href={getAddressExplorerUrl(
                  remoteTokenAddress,
                  remoteTokenChainId ?? 0,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {remoteTokenAddress}
              </Link>
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
              {selectedToken.symbol} tokens. This is a transaction required
              before bridging ERC-20 tokens.
            </p>
          </div>
        )}
    </>
  );
}
