import clsx from 'clsx';
import { QRCodeSVG } from 'qrcode.react';
import {
  AndroidLogoIcon,
  AppStoreLogoIcon,
  GooglePlayLogoIcon,
  QrCodeIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useHoverPopover,
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

export function WalletDownloadWithQrButton({
  className,
  type,
  link,
}: {
  className?: string;
  type: 'google' | 'apple';
  link: string;
}) {
  const { isHovered, handleMouseEnter, handleMouseLeave } =
    useHoverPopover(100);

  return (
    <Popover open={isHovered} placement="right">
      <PopoverTrigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={clsx(
            'inline-flex min-w-[188px] flex-initial select-none flex-row items-center space-x-[8px] rounded-xl px-[24px] py-[12px] transition duration-150',
            'text-haqq-black bg-white hover:text-[#01B36E] hover:shadow-xl',
          )}
        >
          {type === 'apple' && <AppStoreLogoIcon />}
          {type === 'google' && <GooglePlayLogoIcon />}

          <div>
            <div className={clsx('flex flex-col text-start', className)}>
              <span className="text-[10px] font-bold leading-[12px]">
                Download from
              </span>
              <span className="text-[16px] font-extrabold leading-[22px]">
                {type === 'apple' && 'App Store'}
                {type === 'google' && 'Google Play'}
              </span>
            </div>
          </div>

          <div className="pl-[16px]">
            <QrCodeIcon />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="bg-haqq-black transform-gpu rounded-lg border border-[#FFFFFF26] bg-opacity-90 p-4 text-white shadow-lg outline-none backdrop-blur">
        <div className="flex flex-col items-center gap-3">
          <div className="leading-[0px]">
            <div className="inline-block rounded border bg-white p-[4px]">
              <QRCodeSVG
                value={link}
                size={148}
                bgColor="#ffffff"
                fgColor="#0d0d0e"
              />
            </div>
          </div>

          <div className="text-xs text-white/80">Scan QR to download</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
