import { Fragment, ReactElement } from 'react';
import { useTranslate } from '@tolgee/react';
import SuccessIndicator from 'react-success-indicator';
import Reaptcha from 'reaptcha';
import { ProposalPeriodTimer, Button } from '@haqq/shell-ui-kit';
import { Heading, SpinnerLoader, EarnIcon } from '@haqq/shell-ui-kit/server';

interface ClaimInfo {
  available: boolean;
  next_claim_sec: number;
}

interface ClaimTokensSectionProps {
  reCaptchaSiteKey: string;
  isRecaptchaVerified: boolean;
  isRequestTokensAvailable: boolean;
  isTokensClaimed: boolean;
  isCountDownVisible: boolean;
  claimIsLoading: boolean;
  claimInfo?: ClaimInfo;
  onRecaptchaVerify: (token: string) => void;
  onRequestTokens: () => void;
}

export function ClaimTokensSection({
  reCaptchaSiteKey,
  isRecaptchaVerified,
  isRequestTokensAvailable,
  isTokensClaimed,
  isCountDownVisible,
  claimIsLoading,
  claimInfo,
  onRecaptchaVerify,
  onRequestTokens,
}: ClaimTokensSectionProps): ReactElement {
  const { t } = useTranslate();

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-row items-center gap-2">
        <EarnIcon className="h-[26px] w-[26px]" />
        <Heading level={3} className="mb-[-2px]">
          {t('claim-tokens', 'Claim tokens', { ns: 'faucet' })}
        </Heading>
      </div>

      {claimIsLoading ? (
        <div className="flex h-[44px] flex-row items-center justify-center">
          <SpinnerLoader className="mx-auto" />
        </div>
      ) : (
        <Fragment>
          {isRequestTokensAvailable && (
            <div>
              {isRecaptchaVerified ? (
                <div>
                  <Button
                    variant={2}
                    className="w-full"
                    onClick={onRequestTokens}
                  >
                    {t('request-tokens', 'Request tokens', {
                      ns: 'faucet',
                    })}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-row items-center">
                  <Reaptcha
                    sitekey={reCaptchaSiteKey}
                    onVerify={onRecaptchaVerify}
                    theme="dark"
                  />
                </div>
              )}
            </div>
          )}

          {isTokensClaimed && (
            <div className="flex flex-row items-center gap-[12px]">
              <SuccessIndicator size="44px" color="#01B26E" />
              <p className="text-[13px] font-[500] leading-[22px] text-white lg:text-[18px] lg:leading-[28px]">
                {t('tokens-claimed', 'Tokens claimed', {
                  ns: 'faucet',
                })}
              </p>
            </div>
          )}

          {isCountDownVisible && claimInfo && (
            <ProposalPeriodTimer
              color="blue"
              date={new Date(Date.now() + claimInfo.next_claim_sec * 1000)}
              title={t(
                'next-token-request-available',
                'Next request tokens available after',
                { ns: 'faucet' },
              )}
            />
          )}
        </Fragment>
      )}
    </div>
  );
}
