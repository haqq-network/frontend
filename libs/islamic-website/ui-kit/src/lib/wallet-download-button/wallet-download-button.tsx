import clsx from 'clsx';
import {
  AndroidLogoIcon,
  AppStoreLogoIcon,
  GooglePlayLogoIcon,
} from '../icons';

export function WalletDownloadButton({
  className,
  type,
  title,
}: {
  className?: string;
  type: 'google' | 'apple' | 'apk';
  title?: string;
}) {
  return (
    <div
      className={clsx(
        'group flex w-fit min-w-[172px] select-none items-center justify-center gap-x-[8px] rounded-xl px-[24px] py-[10px]',
        'cursor-pointer bg-white text-[#2F2F2F]',
        className,
      )}
    >
      <div className="group-hover:text-islamic-primary-green group-hover:transition-colors group-hover:duration-300">
        {type === 'apple' && <AppStoreLogoIcon />}
        {type === 'google' && <GooglePlayLogoIcon />}
        {type === 'apk' && <AndroidLogoIcon />}
      </div>
      <div className="flex flex-col text-start">
        <span className="group-hover:text-islamic-primary-green/50 text-[10px] leading-[12px] text-[#8E8E8E] group-hover:transition-colors group-hover:duration-300">
          {title && title}
        </span>
        <span className="group-hover:text-islamic-primary-green text-base font-[600] group-hover:transition-colors group-hover:duration-300">
          {type === 'apple' && 'App Store'}
          {type === 'google' && 'Google Play'}
          {type === 'apk' && 'Download .apk'}
        </span>
      </div>
    </div>
  );
}
