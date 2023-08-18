import { Text } from '@haqq/islamic-ui-kit';

export function ShariahBlock() {
  return (
    <div className="flex flex-col gap-y-[24px]">
      <h2 className="text-[22px] font-[600] leading-[24px] md:text-[32px] md:leading-[36px] lg:text-[48px] lg:leading-[54px]">
        Shariah Oracle
      </h2>

      <p>
        <Text size="small">
          Shariah Oracle is an on-chain mechanism controlling a whitelist of
          smart contracts allowed for interaction (signing and listing in the
          in-app marketplace) through the HAQQ Wallet.
        </Text>
      </p>
      <p>
        <Text size="small">
          The Shariah Oracle serves as an on-chain registry of Halal
          Certificates that provides smart contract developers and web2
          businesses a way to prove their ethical relevance for Muslim users by
          listing their products/services on the HAQQ Wallet.
        </Text>
      </p>
      <p>
        <Text size="small">
          Islamic Coin harmonizes tradition with modernity, uniting Sharia
          compliance with blockchain technology to forge a pioneering platform
          in Islamic finance. Upheld by Halal Investing principles and
          safeguarded by our innovative Sharia Oracle, Islamic Coin stands as a
          testament to the thriving of traditional Islamic values in the digital
          world.
        </Text>
      </p>
      <p>
        <Text size="small">
          Integrating the Shariah Oracle with HAQQ Wallet will ensure that users
          interact only with whitelisted, Sharia-compliant dApps. Thus whilst
          being a place where anyone can deploy their dApp or project, HAQQ
          network’s Shariah Oracle is a key measure to minimize unethical or
          Haram activity in our network.
        </Text>
      </p>
    </div>
  );
}
