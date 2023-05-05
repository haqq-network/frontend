export { WebsiteIndexPage as default } from '@haqq/website/index-page';

export async function getServerSideProps() {
  const accountsResponse = await fetch(
    'https://rest.cosmos.haqq.network/cosmos/auth/v1beta1/accounts?pagination.count_total=true&pagination.limit=1',
  );
  const accounts = await accountsResponse.json();

  const stats = {
    mainnetAccountsCreated: Number.parseInt(accounts.pagination.total, 10),
    transactionsInLast24Hours: 10000,
    secondsToConsensusFinality: 5.6,
    averageCostPerTransaction: 147,
    era: 1,
    emissionRate: 0,
    emittedAlready: 20000000000,
    willBeEmitted: 80000000000,
  };

  return {
    props: { stats },
  };
}
