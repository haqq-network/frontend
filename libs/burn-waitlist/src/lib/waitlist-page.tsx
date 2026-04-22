'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { Container } from '@haqq/shell-ui-kit/server';
import { Button } from '@haqq/shell-ui-kit';
import { useWallet } from '@haqq/shell-shared';

import { useWaitlistPage } from './hooks/use-waitlist-page';
import { getHaqqTokenAddress } from './constants/waitlist-config';
import {
  PriceChart,
  StatusMessages,
  WalletConnectionWarning,
  NetworkWarning,
  GlobalStats,
  UserAggregates,
  WaitlistFormSection,
  RequestsSection,
  SafeAccountSelector,
} from './components';

export interface WaitlistPageProps {
  locale?: string;
}

export function WaitlistPage({ locale = 'en' }: WaitlistPageProps = {}) {
  const {
    isConnected,
    isWaitlistStopped,
    isCorrectChain,

    currentState,
    canSubmit,
    canWithdraw,
    paused,

    globalStats,
    isLoadingGlobalStats,
    totalBurnedData,

    chartData,
    isLoadingChart,
    chartError,

    formState,
    setAmount,
    setSource,
    handleMaxClick,
    isValid,
    formattedAmount,
    availableBalance,
    waitlistBalances,
    isLoadingBalances,
    currentPriceAtto,
    isSubmitting,
    errorMessage,
    formDisabled,
    handleSubmit,
    setSelectedSource,

    mergedApplications,
    requestsLoading,
    hasRequestsData,

    userAggregates,

    handleCancel,
    handleApproveByApplication,
    handleMintHaqqByApplication,
    handleSwitchChain,

    isCancelling,
    cancellingRequestId,

    isSafe,
    isApprovingByApp,
    safeOwners,
    isSafeOwnersLoading,
    safeAccountAddress,
    setSafeAccountAddress,
    validSafeAccount,

    authzNeedsApproval,
    isApplicationApproved,
    isAuthzLoading,

    isMinting,
    mintingApplicationId,
  } = useWaitlistPage();

  const { chain } = useAccount();
  const { watchAsset } = useWallet();
  const haqqTokenAddress = getHaqqTokenAddress(chain?.id);
  const handleAddHaqqToken = useCallback(async () => {
    if (!haqqTokenAddress) {
      return;
    }
    await watchAsset('HAQQ', haqqTokenAddress);
  }, [watchAsset, haqqTokenAddress]);

  return (
    <Container>
      <div className="mx-auto max-w-[1200px] px-[16px] py-[40px]">
        <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
          <div className="mb-[24px] flex flex-col items-stretch gap-[12px] md:flex-row md:items-center md:justify-between">
            <h1 className="text-haqq-black text-[24px] font-semibold">
              Burn Waitlist
            </h1>
            <div className="flex flex-col items-stretch gap-[12px] sm:flex-row sm:items-center">
              {haqqTokenAddress && isConnected && isCorrectChain && (
                <Button
                  variant={3}
                  onClick={handleAddHaqqToken}
                  className="w-full sm:w-auto sm:shrink-0"
                >
                  Add HAQQ token
                </Button>
              )}
              {isWaitlistStopped && (
                <Link
                  href={`/${locale}/burn`}
                  className="text-haqq-orange text-[14px] font-medium hover:underline"
                >
                  Go to Haqq Mint →
                </Link>
              )}
            </div>
          </div>

          <GlobalStats
            globalStats={globalStats}
            isLoading={isLoadingGlobalStats}
            totalBurnedData={totalBurnedData}
          />

          {!isConnected && <WalletConnectionWarning />}

          <div className="mb-[24px]">
            <PriceChart
              data={chartData?.data ?? []}
              isLoading={isLoadingChart}
              error={chartError}
              priceInAtto
            />
          </div>

          {isConnected ? (
            <>
              <StatusMessages
                currentState={currentState}
                canSubmit={canSubmit}
                canWithdraw={canWithdraw}
                paused={paused}
                isCorrectChain={isCorrectChain}
                isConnected={isConnected}
              />

              {!isCorrectChain && (
                <NetworkWarning onSwitchChain={handleSwitchChain} />
              )}

              <UserAggregates
                totalCount={userAggregates.totalCount}
                totalAmount={userAggregates.totalAmount}
              />

              <div
                className={`grid grid-cols-1 gap-[32px] ${isWaitlistStopped ? '' : 'lg:grid-cols-2'}`}
              >
                {!isWaitlistStopped && (
                  <WaitlistFormSection
                    formState={formState}
                    availableBalance={availableBalance}
                    waitlistBalances={waitlistBalances}
                    isLoadingBalances={isLoadingBalances}
                    currentPriceAtto={currentPriceAtto}
                    formattedAmount={formattedAmount}
                    isValid={isValid}
                    isSubmitting={isSubmitting}
                    errorMessage={errorMessage}
                    disabled={formDisabled}
                    onAmountChange={setAmount}
                    onSourceChange={(source) => {
                      setSource(source);
                      setSelectedSource(source);
                    }}
                    onMaxClick={handleMaxClick}
                    onSubmit={handleSubmit}
                  />
                )}

                <div className="space-y-[16px]">
                  {/* Safe account selector and allowance status */}
                  {isSafe && isWaitlistStopped && (
                    <div className="space-y-[12px]">
                      <SafeAccountSelector
                        owners={safeOwners}
                        selectedAddress={safeAccountAddress}
                        onSelect={setSafeAccountAddress}
                        isLoading={isSafeOwnersLoading}
                        disabled={isApprovingByApp || isMinting}
                      />

                      {validSafeAccount && !isAuthzLoading && (
                        <div
                          className={`flex items-center justify-between rounded-[8px] p-[12px] ${
                            authzNeedsApproval ? 'bg-yellow-50' : 'bg-green-50'
                          }`}
                        >
                          <span className="text-[14px] text-gray-500">
                            Allowance Status
                          </span>
                          <span
                            className={`text-[14px] font-medium ${
                              authzNeedsApproval
                                ? 'text-yellow-700'
                                : 'text-emerald-700'
                            }`}
                          >
                            {authzNeedsApproval
                              ? 'Approval required'
                              : 'Approved'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <RequestsSection
                    applications={mergedApplications}
                    isLoading={requestsLoading}
                    hasData={hasRequestsData}
                    canCancel={canWithdraw || false}
                    onCancel={handleCancel}
                    onApprove={
                      isWaitlistStopped ? handleApproveByApplication : undefined
                    }
                    onMintHaqq={
                      isWaitlistStopped
                        ? handleMintHaqqByApplication
                        : undefined
                    }
                    isCancelling={isCancelling}
                    cancellingRequestId={cancellingRequestId}
                    isSafe={isSafe}
                    isApproving={isApprovingByApp}
                    authzNeedsApproval={authzNeedsApproval}
                    isApplicationApproved={isApplicationApproved}
                    hasSelectedGrantee={!!validSafeAccount}
                    isMinting={isMinting}
                    mintingApplicationId={mintingApplicationId}
                    balances={waitlistBalances}
                    locale={locale}
                  />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
