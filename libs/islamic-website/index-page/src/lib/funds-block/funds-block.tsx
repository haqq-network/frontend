import { Container, GradientText, Heading } from '@haqq/islamic-ui-kit';
import a195LogoImgData from '../../assets/images/a195-logo.png';
import df101LogoImgData from '../../assets/images/df101-logo.svg';
import opticCapitalLogoImgData from '../../assets/images/optic-capital-logo.png';
import Image from 'next/image';
import Link from 'next/link';

export function FundsBlock() {
  return (
    <Container>
      <div className="relative flex items-center justify-between border-y-[1px] border-dashed border-[#2F2F2F] py-[80px] lg:mt-[140px]">
        <div className="absolute left-0 top-[-2px] z-30 h-[102%] w-[40px] bg-gradient-to-l from-transparent to-[#010304] md:w-[120px]" />
        <div className="flex flex-1 flex-col items-center gap-y-[32px]">
          <Heading>
            These funds <GradientText>trust us</GradientText>
          </Heading>
          <div className="flex items-center gap-x-[40px]">
            <Link
              href={'https://df101.xyz/'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative h-[80px] w-[222px] opacity-60 transition-opacity duration-300 hover:opacity-100">
                <Image src={df101LogoImgData} alt="" fill />
              </div>
            </Link>

            <Link
              href={'https://www.a195.capital/'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative h-[80px] w-[178px] opacity-60 transition-opacity duration-300 hover:opacity-100">
                <Image src={a195LogoImgData.src} alt="" fill />
              </div>
            </Link>

            <Link
              href={'https://optic.capital/'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative h-[80px] w-[101px] opacity-60 transition-opacity duration-300 hover:opacity-100">
                <Image src={opticCapitalLogoImgData.src} alt="" fill />
              </div>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-[-2px] z-30 h-[102%] w-[40px] bg-gradient-to-l from-[#010304] to-transparent md:w-[120px]" />
      </div>
    </Container>
  );
}
