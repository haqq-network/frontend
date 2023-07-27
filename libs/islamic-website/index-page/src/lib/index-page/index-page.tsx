import { JoinCommunityBlock } from '../join-community-block/join-community-block';
import { WhyBlock } from '../why-block/why-block';

export function IndexPage() {
  return (
    <div>
      <h1>Welcome to IslamicWebsiteIndexPage!</h1>
      <WhyBlock />
      <JoinCommunityBlock />
    </div>
  );
}
