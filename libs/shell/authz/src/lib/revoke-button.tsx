'use client';
import { useCallback } from 'react';
import Link from 'next/link';
import { useAccount, useChains } from 'wagmi';
import { getChainParams } from '@haqq/data-access-cosmos';
import {
  getFormattedAddress,
  useAuthzActions,
  useNetworkAwareAction,
  useQueryInvalidate,
  useToast,
} from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import {
  LinkIcon,
  ToastError,
  ToastLoading,
  ToastSuccess,
} from '@haqq/shell-ui-kit/server';

export function RevokeButton({
  grantee,
  msg,
}: {
  grantee: string;
  msg: string;
}) {
  const invalidateQueries = useQueryInvalidate();
  const { revoke, getRevokeEstimatedFee } = useAuthzActions();
  const toast = useToast();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const { executeIfNetworkSupported } = useNetworkAwareAction();
  const { explorer } = getChainParams(chain?.id ?? chains[0].id);

  const handleRevokeAccess = useCallback(
    async (grantee: string, type: string) => {
      try {
        const revokePromise = getRevokeEstimatedFee(grantee, type).then(
          (estimatedFee) => {
            return revoke(grantee, type, estimatedFee);
          },
        );

        await toast.promise(revokePromise, {
          loading: <ToastLoading>Revoke in progress</ToastLoading>,
          success: (tx) => {
            console.log('Revoke successful', { tx });
            const txHash = tx?.txhash;

            return (
              <ToastSuccess>
                <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                  <div>Revoke successful</div>
                  <div>
                    <Link
                      href={`${explorer.cosmos}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[4px] lowercase transition-colors duration-300"
                    >
                      <LinkIcon />
                      <span>{getFormattedAddress(txHash)}</span>
                    </Link>
                  </div>
                </div>
              </ToastSuccess>
            );
          },
          error: (error) => {
            return <ToastError>{error.message}</ToastError>;
          },
        });
      } catch (error) {
        console.error((error as Error).message);
      } finally {
        invalidateQueries([
          [chain.id, 'grants-granter'],
          [chain.id, 'grants-grantee'],
        ]);
      }
    },
    [
      chain.id,
      explorer.cosmos,
      getRevokeEstimatedFee,
      invalidateQueries,
      revoke,
      toast,
    ],
  );

  return (
    <Button
      onClick={() => {
        executeIfNetworkSupported(() => {
          handleRevokeAccess(grantee, msg);
        });
      }}
      variant={1}
    >
      Revoke
    </Button>
  );
}
