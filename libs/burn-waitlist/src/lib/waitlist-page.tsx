'use client';

import Link from 'next/link';
import { Container } from '@haqq/shell-ui-kit/server';

import { useWaitlistPage } from './hooks/use-waitlist-page';
import {
  PriceChart,
  StatusMessages,
  WalletConnectionWarning,
  NetworkWarning,
  GlobalStats,
  UserAggregates,
  WaitlistFormSection,
  RequestsSection,
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
    handleMintHaqqByApplication,
    handleSwitchChain,

    isCancelling,
    cancellingRequestId,

    isMinting,
    mintingApplicationId,
  } = useWaitlistPage();

  return (
    <Container>
      <div className="mx-auto max-w-[1200px] px-[16px] py-[40px]">
        <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
          <div className="mb-[24px] flex items-center justify-between">
            <h1 className="text-haqq-black text-[24px] font-semibold">
              Burn Waitlist
            </h1>
            {isWaitlistStopped && (
              <Link
                href={`/${locale}/burn`}
                className="text-haqq-orange text-[14px] font-medium hover:underline"
              >
                Go to Burn page →
              </Link>
            )}
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

                <RequestsSection
                  applications={mergedApplications}
                  isLoading={requestsLoading}
                  hasData={hasRequestsData}
                  canCancel={canWithdraw || false}
                  onCancel={handleCancel}
                  onMintHaqq={
                    isWaitlistStopped ? handleMintHaqqByApplication : undefined
                  }
                  isCancelling={isCancelling}
                  cancellingRequestId={cancellingRequestId}
                  isMinting={isMinting}
                  mintingApplicationId={mintingApplicationId}
                  balances={waitlistBalances}
                  locale={locale}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
