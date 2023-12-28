import { PageTitle } from '@haqq/haqq-website-ui-kit';
import { OnramperWidget } from '../onramper-widget/onramper-widget';

export function BuyPage({ apiKey }: { apiKey?: string }) {
  return (
    <section>
      <PageTitle title="Buy crypto" className="h-[68px] !py-[22px]" />

      <div className="bg-haqq-black flex flex-row justify-center pb-[24px]">
        {!apiKey ? (
          <div className="font-clash py-[32px] text-center text-[20px] leading-[26px] text-[#ff5454]">
            No API key provided
          </div>
        ) : (
          <OnramperWidget apiKey={apiKey} />
        )}
      </div>
    </section>
  );
}
