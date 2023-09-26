import { Container } from '@haqq/islamic-website-ui-kit';
import Image from 'next/image';
import Link from 'next/link';
import mobileStarsImgData from '../../assets/images/contact-stars-mobile.webp';
import desktopStarsImgData from '../../assets/images/contact-stars-desktop.webp';

const phone = '+9715855474242';
export function ContactUsPage() {
  return (
    <section className="">
      <Container className="relative">
        <div className="flex flex-col items-start pb-[36px] pt-[32px] md:pb-[46px] md:pt-[60px] lg:py-[244px] xl:pb-[324px] xl:pt-[284px]">
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            Contact us
          </h1>
          <div className="flex flex-col lg:flex-row">
            <div className="mt-[24px] flex max-w-[500px] flex-col gap-[16px] md:mt-[28px] md:gap-[20px] lg:mt-[36px] lg:gap-[24px] xl:max-w-[850px] xl:flex-row xl:gap-[32px]">
              <p>
                For questions related to anti-scam, please write to us at{' '}
                <Link
                  href="mailto:scamalert@islmamicoin.net"
                  className="text-islamic-primary-green hover:text-islamic-primary-green-hover cursor-pointer transition-colors duration-300"
                >
                  scamalert@islmamicoin.net
                </Link>
              </p>
              <p>
                For other legal and privacy questions, please write to us at{' '}
                <Link
                  href="mailto:complience@islmamicoin.net"
                  className="text-islamic-primary-green hover:text-islamic-primary-green-hover cursor-pointer transition-colors duration-300"
                >
                  complience@islmamicoin.net
                </Link>
              </p>
              <p>
                In case of an emergency, please contact us by phone{' '}
                <Link
                  href={`tel:${phone}`}
                  className="text-islamic-primary-green hover:text-islamic-primary-green-hover cursor-pointer transition-colors duration-300"
                >
                  {phone}
                </Link>
              </p>
            </div>
          </div>
          <div className="absolute bottom-[-220px] z-[-1] self-center min-[385px]:bottom-[-300px] lg:hidden">
            <Image src={mobileStarsImgData} alt="" />
          </div>
          <div className="right-0 top-[10%] hidden lg:absolute lg:block">
            <Image src={desktopStarsImgData} alt="" width={475} height={600} />
          </div>
        </div>
      </Container>
    </section>
  );
}
