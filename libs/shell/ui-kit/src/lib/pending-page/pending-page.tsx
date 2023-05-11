import { SpinnerLoader } from '../spinner-loader/spinner-loader';

export function PendingPage() {
  return (
    <div className="mx-auto flex w-full flex-1 flex-col content-center items-center justify-center px-[16px] sm:px-[48px] lg:px-[79px] lg:py-[34px]">
      <SpinnerLoader />
    </div>
  );
}
