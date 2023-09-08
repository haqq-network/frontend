import { ScanBlock } from '../scan-block/scan-block';

export function ScanPage() {
  return (
    <section className="py-20">
      <div className="w-full overflow-clip px-[16px] sm:px-[63px] lg:px-[79px]">
        <div className="flex flex-col gap-16">
          <div className="flex flex-1 flex-row items-center justify-between gap-[24px]">
            <div>
              <h2 className="font-serif text-[18px] font-[500] leading-[1.3em] sm:text-[24px] lg:text-[32px]">
                Event Scanner
              </h2>
            </div>
          </div>

          <ScanBlock />
        </div>
      </div>
    </section>
  );
}
