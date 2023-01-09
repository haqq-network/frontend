import clsx from 'clsx';
import {
  AndroidLogoIcon,
  AppStoreLogoIcon,
  GooglePlayLogoIcon,
} from '@haqq/website/ui-kit';

export function DownloadButton({
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
        'px-[24px] py-[12px] flex space-x-[8px] rounded-xl flex-initial min-w-[188px] select-none transition duration-150',
        isAvailable &&
          'bg-white hover:text-[#01B36E] hover:shadow-xl text-haqq-black cursor-pointer',
        !isAvailable && 'cursor-default text-white/60 border border-white/60',
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
