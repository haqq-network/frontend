import clsx from 'clsx';

interface SideLinkProps {
  isActive?: boolean;
  children: string;
}

function BarAndSquare() {
  return (
    <div className="flex items-center">
      <div className="h-[1px] w-full min-w-[30px] bg-[#0d0d0e3d] xl:min-w-[50px]" />
      <div className="bg-haqq-black min-h-[12px] min-w-[13px] xl:min-h-[16px] xl:min-w-[17px]" />
    </div>
  );
}

export function SideLink({ isActive, children }: SideLinkProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-x-[16px]">
      {isActive ? <BarAndSquare /> : <div />}
      <div
        className={clsx(
          'text-[13px] xl:text-[14px] xl:leading-[22px]',
          isActive ? 'text-haqq-black' : 'text-[#0d0d0e3d]',
        )}
      >
        {children}
      </div>
    </div>
  );
}
