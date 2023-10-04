import { Container } from '@haqq/islamic-website-ui-kit';
import Image from 'next/image';
import Link from 'next/link';
import contactPageImageData from '../../assets/images/contact-page-image.webp';

export function ContactUsPage() {
  return (
    <section className="">
      <Container>
        <div className="pb-[36px] pt-[32px] md:pb-[46px] md:pt-[60px] lg:py-[244px] xl:pb-[324px] xl:pt-[284px]">
          <div className="flex min-h-[200px] flex-col items-start lg:flex-row">
            <div className="lg:w-9/12">
              <div className="flex flex-col gap-[24px] md:gap-[28px] lg:gap-[36px] xl:gap-[32px]">
                <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
                  Contact us
                </h1>
                <div className="flex flex-col gap-[16px] md:gap-[20px] lg:gap-[24px] xl:flex-row xl:gap-[32px]">
                  <div>
                    <p>
                      For questions related to anti-scam, please write to us at{' '}
                      <Link
                        href="mailto:scamalert@islamiccoin.net"
                        className="text-islamic-primary-green hover:text-islamic-primary-green-hover cursor-pointer transition-colors duration-300"
                      >
                        scamalert@islamiccoin.net
                      </Link>
                    </p>
                  </div>
                  <div>
                    <p>
                      For other legal and privacy questions, please write to us
                      at{' '}
                      <Link
                        href="mailto:compliance@islamiccoin.net"
                        className="text-islamic-primary-green hover:text-islamic-primary-green-hover cursor-pointer transition-colors duration-300"
                      >
                        compliance@islamiccoin.net
                      </Link>
                    </p>
                  </div>
                  <div>
                    <p>
                      In case of an emergency, please contact us by phone{' '}
                      <Link
                        href="tel:+9715855474242"
                        className="text-islamic-primary-green hover:text-islamic-primary-green-hover cursor-pointer transition-colors duration-300"
                      >
                        +9715855474242
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mb-[-30%] w-full flex-1 lg:mb-[0px] lg:min-h-[200px]">
              <div className="pointer-events-none z-[-1] select-none lg:absolute lg:right-[0px] lg:top-[50%] lg:origin-right lg:translate-x-[80%] lg:translate-y-[-50%] lg:scale-150">
                <div className="from-islamic-bg-black absolute bottom-[0px] h-[75%] w-full bg-gradient-to-t from-55% to-transparent lg:right-0 lg:h-full lg:w-[90%] lg:bg-gradient-to-l" />
                <Image
                  alt=""
                  src={contactPageImageData}
                  width={1430 / 2.4}
                  height={1000 / 2.4}
                  className="w-full lg:w-auto lg:max-w-none"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
