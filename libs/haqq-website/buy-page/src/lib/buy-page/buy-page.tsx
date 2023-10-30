import { PageTitle } from '@haqq/haqq-website-ui-kit';
import { OnRamperBuy } from '../../buy/buy';

export function BuyPage({ apiKey }: { apiKey: string }) {
  return (
    <section>
      <PageTitle title="Buy crypto" />
      <div className="bg-haqq-black flex px-[16px] py-[48px] sm:px-[63px] md:py-[68px] lg:px-[79px] lg:py-[100px]">
        <OnRamperBuy apiKey={apiKey} />
      </div>
    </section>
  );
}
