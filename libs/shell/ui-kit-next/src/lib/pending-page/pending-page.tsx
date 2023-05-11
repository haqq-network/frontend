import { SpinnerLoader } from '../spinner-loader/spinner-loader';

export function PendingPage() {
  return (
    <div className="w-full mx-auto px-[16px] sm:px-[48px] lg:px-[79px] lg:py-[34px] flex flex-col flex-1 items-center justify-center content-center">
      <SpinnerLoader />
    </div>
  );
}
