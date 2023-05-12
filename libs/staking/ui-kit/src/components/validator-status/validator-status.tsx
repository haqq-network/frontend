import clsx from 'clsx';

export function ValidatorListStatus({
  jailed,
  status,
}: {
  jailed: boolean;
  status: number;
}) {
  if (jailed) {
    return (
      <div className="text-[16px] leading-[26px] text-[#FF5454]">Jailed</div>
    );
  }

  if (status === 3) {
    return (
      <div className="text-[16px] leading-[26px] text-[#01B26E]">Active</div>
    );
  }

  return (
    <div className="text-[16px] leading-[26px] text-[#E3A13F]">Inactive</div>
  );
}

export function ValidatorDetailsStatus({
  jailed,
  status,
}: {
  jailed: boolean;
  status: number;
}) {
  if (jailed) {
    return (
      <div
        className={clsx(
          'inline-block whitespace-nowrap rounded-lg px-[12px] pb-[11px] pt-[13px] text-center',
          'font-serif text-[14px] font-medium uppercase leading-none tracking-[.01em] text-white',
          'bg-[#FF5454]',
        )}
      >
        Jailed
      </div>
    );
  }

  if (status === 3) {
    return (
      <div
        className={clsx(
          'inline-block whitespace-nowrap rounded-lg px-[12px] pb-[11px] pt-[13px] text-center',
          'font-serif text-[14px] font-medium uppercase leading-none tracking-[.01em] text-white',
          'bg-[#01B26E]',
        )}
      >
        Active
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'inline-block whitespace-nowrap rounded-lg px-[12px] pb-[11px] pt-[13px] text-center',
        'font-serif text-[14px] font-medium uppercase leading-none tracking-[.01em] text-white',
        'bg-[#E3A13F]',
      )}
    >
      Inactive
    </div>
  );
}
