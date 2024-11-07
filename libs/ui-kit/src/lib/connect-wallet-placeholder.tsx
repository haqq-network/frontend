import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { Button } from './button';

export function ConnectWalletPlaceholder({
  className,
  onConnectWalletClick,
}: {
  className?: string;
  onConnectWalletClick: () => void;
}) {
  const { t } = useTranslate('common');
  return (
    <div
      className={clsx(
        'flex flex-col items-center space-y-[12px] py-[58px]',
        className,
      )}
    >
      <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
        {t('connect-wallet-message', 'You should connect wallet first')}
      </div>
      <Button onClick={onConnectWalletClick} variant={2}>
        {t('connect-wallet-button', 'Connect wallet')}
      </Button>
    </div>
  );
}
