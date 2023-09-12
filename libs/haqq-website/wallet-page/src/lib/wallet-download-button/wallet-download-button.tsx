import clsx from 'clsx';
import {
  AndroidLogoIcon,
  AppStoreLogoIcon,
  GooglePlayLogoIcon,
} from '@haqq/haqq-website-ui-kit';

export function WalletDownloadButton({
  className,
  isAvailable,
  type,
}: {
  className?: string;
  isAvailable?: boolean;
  type: 'google' | 'apple' | 'apk';
}) {
  return (
    <div
      className={clsx(
        'flex min-w-[188px] flex-initial select-none space-x-[8px] rounded-xl px-[24px] py-[12px] transition duration-150',
        isAvailable &&
          'text-haqq-black cursor-pointer bg-white hover:text-[#01B36E] hover:shadow-xl',
        !isAvailable && 'cursor-default border border-white/60 text-white/60',
      )}
    >
      {type === 'apple' && <AppStoreLogoIcon />}
      {type === 'google' && <GooglePlayLogoIcon />}
      {type === 'apk' && <AndroidLogoIcon />}
      <div>
        <div className={clsx('flex flex-col text-start', className)}>
          <span className="text-[10px] font-bold leading-[12px]">
            {type === 'apk'
              ? 'Direct download'
              : isAvailable
              ? 'Available in'
              : 'Coming soon to the'}
          </span>
          <span className="text-[16px] font-extrabold leading-[22px]">
            {type === 'apple' && 'App Store'}
            {type === 'google' && 'Google Play'}
            {type === 'apk' && 'Download .apk'}
          </span>
        </div>
      </div>
    </div>
  );
}
