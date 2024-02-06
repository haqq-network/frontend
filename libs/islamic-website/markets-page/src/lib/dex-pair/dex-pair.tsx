import clsx from 'clsx';
import Image from 'next/image';
import atomLogo from '../../assets/images/coin-logos/atom.svg';
import btcLogo from '../../assets/images/coin-logos/btc.svg';
import daiLogo from '../../assets/images/coin-logos/dai.svg';
import ethLogo from '../../assets/images/coin-logos/eth.svg';
import injLogo from '../../assets/images/coin-logos/inj.svg';
import islmLogo from '../../assets/images/coin-logos/islm.svg';
import usdcLogo from '../../assets/images/coin-logos/usdc.svg';
import usdtLogo from '../../assets/images/coin-logos/usdt.svg';

const coinLogos: Record<string, string> = {
  islm: islmLogo,
  weth: ethLogo,
  atom: atomLogo,
  usdt: usdtLogo,
  usdc: usdcLogo,
  dai: daiLogo,
  wbtc: btcLogo,
  inj: injLogo,
};

export function DEXPair({ pair }: { pair: [string, string] }) {
  return (
    <div className="relative h-[52px] w-[52px] md:h-[62px] md:w-[62px]">
      <DEXPairCoinImage
        symbol={pair[0].toLowerCase()}
        className="absolute left-[4px] top-[4px] z-20"
      />
      <DEXPairCoinImage
        symbol={pair[1].toLowerCase()}
        className="absolute bottom-[4px] right-[4px] z-10"
      />
    </div>
  );
}

function DEXPairCoinImage({
  className,
  symbol,
}: {
  className?: string;
  symbol: string;
}) {
  return (
    <div
      className={clsx(
        'h-[30px] w-[30px] overflow-hidden rounded-full outline-[1px] outline-[#181E25B2] md:h-[36px] md:w-[36px]',
        className,
      )}
    >
      <Image
        src={coinLogos[symbol] as string}
        alt={`${symbol} coin logo`}
        className="object-cover"
        width={36}
        height={36}
      />
    </div>
  );
}
