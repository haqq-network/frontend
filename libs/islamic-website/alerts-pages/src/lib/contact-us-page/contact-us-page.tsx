import { Container } from '@haqq/islamic-website-ui-kit';
import fraudCubesImgData from '../../assets/images/fraud-cubes.webp';
import Image from 'next/image';
import Link from 'next/link';

export function ContactUsPage() {
  return (
    <section className="gap-y-[24px] overflow-x-clip pb-[60px] pt-[32px] md:pb-[90px] lg:gap-y-[40px] lg:pb-[180px] lg:pt-[80px]">
      <Container className="relative">
        <div className="flex flex-col gap-y-[24px] md:gap-y-[32px] lg:gap-y-[40px]">
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            Contact us
          </h1>
        </div>
        <div className="mt-[32px] flex flex-col items-center md:mt-[44px] md:flex-row md:items-start lg:mt-[60px]">
          <div className="md:w-2/3">
            <div className="flex w-full flex-col gap-12 text-xl">
              <p>
                For questions related to anti-scam, please write to us at:{' '}
                <br />
                <Link
                  href="mailto:scamalert@islmamicoin.net"
                  className="text-islamic-primary-green hover:text-islamic-primary-green-hover text-2xl font-semibold underline transition-colors duration-150"
                >
                  scamalert@islmamicoin.net
                </Link>
              </p>
              <p>
                For other legal and privacy questions, please write to us at{' '}
                <br />
                <Link
                  href="mailto:compliance@islamiccoin.net"
                  className="text-islamic-primary-green hover:text-islamic-primary-green-hover text-2xl font-semibold underline transition-colors duration-150"
                >
                  compliance@islamiccoin.net
                </Link>
              </p>
              <p>
                In case of an emergency, please contact us by phone: <br />
                <Link
                  href="tel:+9715855474242"
                  className="text-islamic-primary-green hover:text-islamic-primary-green-hover text-2xl font-semibold underline transition-colors duration-150"
                >
                  +9715855474242
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-[32px] md:mt-0 md:flex-1">
            <Image
              src={fraudCubesImgData}
              width={502}
              height={764}
              alt=""
              className="pointer-events-none select-none md:absolute md:right-[-385px] md:top-[350px] md:translate-x-[-50%] md:translate-y-[-50%] lg:right-[-295px] xl:right-[-265px]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
