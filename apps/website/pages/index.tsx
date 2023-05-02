export { WebsiteIndexPage as default } from '@haqq/website/index-page';

export async function getServerSideProps() {
  const stats = {
    mainnetAccountsCreated: 2000,
    transactionsInLast24Hours: 5000,
    secondsToConsensusFinality: 1000,
    averageCostPerTransaction: 200,
    era: 5,
    emissionRate: 2000,
    emittedAlready: 2000,
    willBeEmitted: 2000,
  };

  return {
    props: { stats },
  };
}
