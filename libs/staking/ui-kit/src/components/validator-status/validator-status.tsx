export function ValidatorStatus({
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
