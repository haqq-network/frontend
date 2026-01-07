'use client';

export function RequestsListSkeleton() {
  return (
    <div className="space-y-[12px]">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="rounded-[8px] border border-[#E5E7EB] bg-white p-[16px]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-[8px] flex items-center space-x-[8px]">
                <div className="h-[14px] w-[100px] animate-pulse rounded bg-[#E5E7EB]" />
                <div className="h-[20px] w-[60px] animate-pulse rounded-[4px] bg-[#E5E7EB]" />
              </div>
              <div className="space-y-[4px]">
                <div className="h-[14px] w-[120px] animate-pulse rounded bg-[#E5E7EB]" />
                <div className="h-[14px] w-[100px] animate-pulse rounded bg-[#E5E7EB]" />
              </div>
            </div>
            <div className="h-[32px] w-[80px] animate-pulse rounded bg-[#E5E7EB]" />
          </div>
        </div>
      ))}
    </div>
  );
}
