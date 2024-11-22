import { SpinnerLoader } from '@haqq/shell-ui-kit/server';

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[320px] w-full flex-1 flex-col content-center items-center justify-center px-[16px] sm:px-[48px] lg:px-[80px] lg:py-[34px]">
      <SpinnerLoader />
    </div>
  );
}
