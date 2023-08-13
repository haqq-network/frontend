import { RoadmapPage } from '@haqq/islamic-website/roadmap-page';

export default function Page() {
  const roadmap = [
    {
      goals: [
        'The private sale has been completed',
        'Major investment inked, including $200M from ABO Digital',
        'Network transition from PoA to PoS',
        'Mnemonicless private key managment in HAQQ Wallet (testflight)',
        'Web3 Browser in HAQQ Wallet',
      ],
      isAchieved: true,
      title: 'Q2 2023',
    },
    {
      goals: [
        'Islamic Coin launches on major crypto exchanges 1 September',
        'ISLM minting starts (Century Coinomics)',
        'NFT support in Haqq Wallet',
        'Decentralized Identity',
        'ERC20 Tokens in Haqq Wallet',
        'Shariah Oracle implementation in HAQQ Wallet for TestEdge users',
        'Mnemonicless private key management in HAQQ wallet (security audit and public release)',
      ],
      title: 'Q3 2023',
    },
    {
      goals: ['Gold-pegged Stable Coin in cooperation with top UAE banks'],
      title: 'Q1 2024',
    },
  ];

  return <RoadmapPage roadmap={roadmap} />;
}
