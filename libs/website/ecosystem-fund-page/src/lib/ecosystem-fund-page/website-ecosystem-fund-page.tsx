import { ApplyBlock } from '../apply-block/apply-block';
import { TextBlock } from '../text-block.tsx/text-block';
import { TitleBlock } from '../title-block/title-block';

export function EcosystemFundPage() {
  return (
    <div className="relative">
      <TitleBlock />
      <TextBlock />
      <ApplyBlock />
    </div>
  );
}
