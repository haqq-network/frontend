'use client';
import { ApplyBlock } from '../apply-block/apply-block';
import { SelectWalletModalWrapper } from '../select-wallet-modal-wrapper/select-wallet-modal-wrapper';
import { WebsiteProviders } from '../website-providers/website-providers';

export function QrRegistrationPage({
  walletConnectProjectId,
  isProduction,
}: {
  walletConnectProjectId: string | undefined;
  isProduction: boolean;
}) {
  return (
    <section className="min-h-[400px] py-20">
      <div className="w-full overflow-clip px-[16px] sm:px-[63px] lg:px-[79px]">
        <div className="flex flex-col gap-16">
          <div className="flex flex-1 flex-row items-center justify-between gap-[24px]">
            <div>
              <h2 className="font-clash text-[18px] font-[500] leading-[1.3em] sm:text-[24px] lg:text-[32px]">
                Event Registration
              </h2>
            </div>
          </div>

          <WebsiteProviders
            // walletConnectProjectId={walletConnectProjectId}
            withReactQueryDevtools={isProduction}
          >
            <SelectWalletModalWrapper>
              <ApplyBlock />
            </SelectWalletModalWrapper>
          </WebsiteProviders>
        </div>
      </div>
    </section>
  );
}
