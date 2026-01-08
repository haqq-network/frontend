'use client';

export function ParticipationFormSkeleton() {
  return (
    <div className="space-y-[20px]">
      {/* Balances skeleton */}
      <div className="mb-[24px] rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-[16px]">
        <div className="mb-[12px] h-[14px] w-[100px] animate-pulse rounded bg-[#E5E7EB]" />
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex flex-col rounded-[6px] bg-white p-[12px]"
            >
              <div className="mb-[4px] h-[12px] w-[80px] animate-pulse rounded bg-[#E5E7EB]" />
              <div className="h-[16px] w-[100px] animate-pulse rounded bg-[#E5E7EB]" />
            </div>
          ))}
        </div>
      </div>

      {/* Amount input skeleton */}
      <div>
        <div className="mb-[8px] h-[14px] w-[60px] animate-pulse rounded bg-[#E5E7EB]" />
        <div className="relative">
          <div className="h-[46px] w-full animate-pulse rounded-[6px] bg-[#E5E7EB]" />
          <div className="absolute end-3 top-1/2 h-[14px] w-[40px] -translate-y-1/2 animate-pulse rounded bg-[#E5E7EB]" />
        </div>
        <div className="mt-1 h-[20px] w-[150px] animate-pulse rounded bg-[#E5E7EB]" />
      </div>

      {/* Funds Source skeleton */}
      <div>
        <div className="mb-[8px] h-[14px] w-[90px] animate-pulse rounded bg-[#E5E7EB]" />
        <div className="space-y-[8px]">
          {[1, 2].map((index) => (
            <div key={index} className="flex items-center space-x-[8px]">
              <div className="h-[16px] w-[16px] animate-pulse rounded-full bg-[#E5E7EB]" />
              <div className="h-[14px] w-[100px] animate-pulse rounded bg-[#E5E7EB]" />
            </div>
          ))}
        </div>
      </div>

      {/* Submit button skeleton */}
      <div className="pt-[8px]">
        <div className="h-[44px] w-full animate-pulse rounded-[6px] bg-[#E5E7EB]" />
      </div>
    </div>
  );
}
