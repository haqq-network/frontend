import {
  HaqqAssetsBlock,
  IslamicAssetsBlock,
} from './assets-block/assets-block';
import { TitleBlock } from './title-block/title-block';

export function BrandAssetsPage() {
  return (
    <section>
      <TitleBlock />
      <HaqqAssetsBlock />
      <IslamicAssetsBlock />
    </section>
  );
}
