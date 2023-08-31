'use client';
import Link from 'next/link';
import clsx from 'clsx';
import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Transition } from '@headlessui/react';
import {
  Container,
  AcademyIcon,
  BlogIcon,
  BuildIcon,
  CaseIcon,
  CommunityIcon,
  EcosystemIcon,
  MissionIcon,
  NewsIcon,
  PartnershipIcon,
  RoadmapIcon,
  ValuesIcon,
  BurgerButton,
  DropdownLink,
  HalfMoonAndStarIcon,
  AlertIcon,
  StarIcon,
} from '@haqq/islamic-website-ui-kit';
import { BurgerMenu } from '../burger-menu/burger-menu';
import { useMediaQuery } from 'react-responsive';

interface HeaderLinkProps {
  url: string;
  isOutLink?: boolean;
}

function DesktopHeaderLink({
  children,
  url,
  isOutLink = false,
}: PropsWithChildren<HeaderLinkProps>) {
  return (
    <Link
      href={url}
      target={isOutLink ? '_blank' : undefined}
      rel={isOutLink ? 'noopener noreferrer' : undefined}
      className="hover:text-islamic-primary-green p-[16px] text-[14px] font-[400] uppercase leading-[24px] text-white transition-colors duration-200"
    >
      {children}
    </Link>
  );
}

function HeaderDropdown({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setDropdownOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  return (
    <div
      className="group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hover:text-islamic-primary-green group-hover:text-islamic-primary-green flex cursor-default items-center gap-x-[4px] p-[16px] text-white transition-colors duration-200">
        <span className="text-[14px] uppercase leading-[20px]">{title}</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.29289 8.79289C6.68342 8.40237 7.31658 8.40237 7.70711 8.79289L12 13.0858L16.2929 8.79289C16.6834 8.40237 17.3166 8.40237 17.7071 8.79289C18.0976 9.18342 18.0976 9.81658 17.7071 10.2071L12.7071 15.2071C12.5196 15.3946 12.2652 15.5 12 15.5C11.7348 15.5 11.4804 15.3946 11.2929 15.2071L6.29289 10.2071C5.90237 9.81658 5.90237 9.18342 6.29289 8.79289Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        show={isDropdownOpen}
      >
        <div className="absolute left-1/2 top-full min-w-max origin-center translate-x-[-50%]">
          <div className="w-fit rounded-xl bg-[#15191ef2] p-[8px] backdrop-blur">
            {children}
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default function Header() {
  const isTabletMedia = useMediaQuery({
    query: `(max-width: 1023px)`,
  });

  return isTabletMedia ? <MobileHeader /> : <DesktopHeader />;
}

export function MobileHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpened] = useState(false);
  const [isBlurred, setBlured] = useState(false);

  useEffect(() => {
    const offset = 40;

    function handleScroll() {
      if (window.scrollY > offset) {
        setBlured(true);
      } else {
        setBlured(false);
      }
    }

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobileMenuOpen]);

  return (
    <Fragment>
      <div className="h-[72px] lg:h-[92px]" />
      <header
        className={clsx(
          'fixed top-0 z-50 h-[72px] w-full border-b-[1px] border-transparent',
          'transform-gpu overflow-clip transition-[height,background,border] duration-150 ease-in-out will-change-[height,background,border]',
          isMobileMenuOpen
            ? '!h-[100vh] bg-[#15191ef2] backdrop-blur-[6px]'
            : isBlurred
            ? '!border-[#2F2F2F] bg-[#010304CC] backdrop-blur-[6px]'
            : 'bg-transparent',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="py-[18px]">
            <Container>
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={'/'}
                    className="hover:text-islamic-primary-green leading-[0] text-white transition-colors duration-150"
                  >
                    <IslamicHeaderLogo />
                  </Link>
                </div>
                <div className="leading-[0]">
                  <BurgerButton
                    onClick={() => {
                      setIsMobileMenuOpened(!isMobileMenuOpen);
                    }}
                    isOpen={isMobileMenuOpen}
                    className="p-[6px]"
                  />
                </div>
              </div>
            </Container>
          </div>
          <div
            className={clsx(
              'flex-1 overflow-y-auto',
              isMobileMenuOpen ? 'block ' : 'hidden',
            )}
          >
            <div className={clsx('py-[24px]', 'w-full')}>
              <BurgerMenu
                isOpen={isMobileMenuOpen}
                onClick={() => {
                  setIsMobileMenuOpened(false);
                }}
              />
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
}

export function DesktopHeader() {
  const [isBlurred, setBlured] = useState(false);

  useEffect(() => {
    const offset = 50;

    function handleScroll() {
      if (window.scrollY > offset) {
        setBlured(true);
      } else {
        setBlured(false);
      }
    }

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 w-full',
        'transform-gpu transition-all duration-150 will-change-auto',
        isBlurred && 'translate-y-[-16px]',
      )}
    >
      <div className="pb-[10px] pt-[26px]">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="hover:text-islamic-primary-green leading-[0] text-white transition-colors duration-150"
              >
                <IslamicHeaderLogo />
              </Link>
            </div>

            <nav className="flex flex-row">
              <DesktopHeaderLink url="/shariah">Shariah</DesktopHeaderLink>

              <HeaderDropdown title="About">
                <div className="flex gap-x-[18px]">
                  <div className="flex flex-col">
                    <DropdownLink
                      title="Mission & Vision"
                      icon={<MissionIcon />}
                      href="/mission"
                    />
                    <DropdownLink
                      title="Roadmap"
                      icon={<RoadmapIcon />}
                      href="/roadmap"
                    />
                    <DropdownLink
                      title="Whitepaper"
                      icon={<HalfMoonAndStarIcon />}
                      href="/whitepaper"
                    />
                    <DropdownLink
                      title="Ecosystem"
                      icon={<EcosystemIcon />}
                      href="https://haqq.network/ecosystem"
                      isOutLink
                    />
                  </div>
                  {/* <div className="flex flex-col"> */}
                  {/* <DropdownLink
                      title="News"
                      icon={<NewsIcon />}
                      href="/news"
                    /> */}
                  {/* <DropdownLink
                      title="Press"
                      icon={<NewsIcon />}
                      href="/press"
                    /> */}
                  {/* <DropdownLink
                      title="Events"
                      icon={<EventsIcon />}
                      href="/events"
                    /> */}
                  {/* </div> */}
                  <div className="flex flex-col">
                    <DropdownLink
                      title="News"
                      icon={<NewsIcon />}
                      href="/news"
                    />

                    <DropdownLink
                      title="Partnerships"
                      icon={<PartnershipIcon />}
                      href="/partnerships"
                    />
                    <DropdownLink
                      title="Build on HAQQ"
                      icon={<BuildIcon />}
                      href="/build"
                    />
                  </div>
                </div>
              </HeaderDropdown>

              <DesktopHeaderLink url="/wallet">Wallet</DesktopHeaderLink>

              <HeaderDropdown title="Learn">
                <div className="flex gap-x-[18px]">
                  <div className="flex flex-col">
                    <DropdownLink
                      title="Academy"
                      icon={<AcademyIcon />}
                      href="/academy"
                    />
                    <DropdownLink
                      title="Blog"
                      icon={<BlogIcon />}
                      href="https://blog.islamiccoin.net"
                      isOutLink
                    />
                    <DropdownLink
                      title="Fraud alert"
                      icon={<AlertIcon />}
                      href="/fraud-alert"
                    />

                    {/* <DropdownLink
                      title="Podcast"
                      icon={<PodcastIcon />}
                      href="/where-to-start"
                    /> */}
                    {/* <DropdownLink
                      title="Videos"
                      icon={<VideoIcon />}
                      href="/partners"
                    /> */}
                  </div>
                  {/* <div className="flex flex-col">
                    <DropdownLink
                      title="Where to start?"
                      icon={<RocketIcon />}
                      href="/where-to-start"
                    />
                    <DropdownLink
                      title="Partners"
                      icon={<PartnersIcon />}
                      href="/partners"
                    />
                  </div> */}
                </div>
              </HeaderDropdown>

              <HeaderDropdown title="Team">
                <div className="flex gap-x-[18px]">
                  <div className="flex flex-col">
                    <DropdownLink
                      title="Career"
                      icon={<CaseIcon />}
                      href="/career"
                    />
                    <DropdownLink
                      title="Our Values"
                      icon={<ValuesIcon />}
                      href="/values"
                    />
                    <DropdownLink
                      title="Community"
                      icon={<CommunityIcon />}
                      href="/community-hub"
                    />
                    <DropdownLink
                      title="Meet our team"
                      icon={<StarIcon />}
                      href="/team"
                    />
                  </div>
                </div>
              </HeaderDropdown>
            </nav>
          </div>
        </Container>
      </div>

      <div
        className={clsx(
          'absolute inset-0 z-[-1]',
          'transform-gpu transition-all duration-150 will-change-auto',
          isBlurred ? 'bg-[#010304CC] backdrop-blur-md' : 'bg-transparent',
        )}
      />
    </header>
  );
}

function IslamicHeaderLogo() {
  return (
    <svg
      viewBox="0 0 170 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[24px] w-auto md:h-[28px]"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.1215 1.4917C18.6568 1.4917 21.8578 2.89485 24.1746 5.16325C26.4641 7.40482 27.8903 10.4915 27.9238 13.904V13.911L27.9241 13.9576L27.9245 14.0266L27.9238 14.1422V14.1497C27.8903 17.5621 26.4641 20.6485 24.1746 22.89C21.8578 25.1584 18.6572 26.5615 15.1215 26.5615C11.5862 26.5615 8.38519 25.1584 6.06834 22.89C3.75149 20.6216 2.31836 17.4876 2.31836 14.0262C2.31836 10.5649 3.75149 7.43125 6.06834 5.16285C8.38519 2.89446 11.5862 1.4917 15.1215 1.4917ZM22.48 8.69597C22.9654 8.69597 23.4362 8.75866 23.8846 8.87501C22.5642 7.62054 20.7637 6.84798 18.7784 6.84798C16.7536 6.84798 14.9205 7.6513 13.5941 8.95038C12.2673 10.2494 11.4468 12.0441 11.4468 14.0266C11.4468 16.0091 12.2673 17.8039 13.5941 19.1025C14.9209 20.4015 16.754 21.2049 18.7784 21.2049C20.7637 21.2049 22.5646 20.4323 23.8846 19.1778C23.4367 19.2946 22.9658 19.3569 22.4804 19.3569C20.9773 19.3569 19.6158 18.7602 18.6309 17.7956C17.6457 16.831 17.0364 15.498 17.0364 14.0262C17.0364 12.5544 17.6457 11.2215 18.6309 10.2569C19.6154 9.29307 20.9764 8.69597 22.48 8.69597ZM25.0466 11.5137C24.3897 10.8709 23.4822 10.473 22.4796 10.473C21.4771 10.473 20.5696 10.8709 19.9126 11.5137C19.2557 12.1569 18.8497 13.0455 18.8497 14.027C18.8497 15.0086 19.2561 15.8971 19.9126 16.5403C20.5696 17.1832 21.4771 17.5811 22.4796 17.5811C23.4822 17.5811 24.3897 17.1832 25.0466 16.5403C25.7032 15.8971 26.1096 15.0086 26.1096 14.027L26.1092 13.9813C26.0971 13.0175 25.6931 12.1467 25.0466 11.5137ZM18.778 5.07136C19.9183 5.07136 21.0094 5.27564 22.0164 5.64911C20.131 4.15998 17.7323 3.26831 15.1215 3.26831C12.0872 3.26831 9.33981 4.47271 7.35123 6.4193C5.36305 8.36588 4.13293 11.0559 4.13293 14.0266C4.13293 16.9978 5.36265 19.6874 7.35123 21.6344C9.33981 23.5809 12.0868 24.7853 15.1215 24.7853C17.7327 24.7853 20.131 23.8937 22.0164 22.4041C21.0094 22.7776 19.9183 22.9819 18.778 22.9819C16.2525 22.9819 13.9655 21.9794 12.3108 20.359C10.6557 18.7385 9.63183 16.4997 9.63183 14.027C9.63183 11.5544 10.6557 9.31516 12.3108 7.69469C13.9655 6.07384 16.2525 5.07136 18.778 5.07136Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M109.613 23.1666C107.676 23.1666 106.056 22.5289 104.752 21.2527C103.467 19.9603 102.823 18.3908 102.823 16.5439C102.823 14.664 103.467 13.0944 104.752 11.8352C106.056 10.5595 107.675 9.92139 109.613 9.92139C110.865 9.92139 112.005 10.2152 113.034 10.8028C114.062 11.3904 114.834 12.1795 115.348 13.1698L112.957 14.5295C112.665 13.9254 112.224 13.4509 111.632 13.1066C111.04 12.7624 110.359 12.5904 109.587 12.5904C108.456 12.5904 107.505 12.9683 106.733 13.7235C105.979 14.4956 105.601 15.4358 105.601 16.5435C105.601 17.6513 105.978 18.5915 106.733 19.3637C107.505 20.1193 108.456 20.4967 109.587 20.4967C110.342 20.4967 111.024 20.3247 111.632 19.9805C112.241 19.6365 112.699 19.1622 113.008 18.558L115.4 19.8925C114.851 20.8997 114.058 21.6971 113.021 22.2847C111.983 22.8731 110.848 23.1666 109.613 23.1666Z"
        fill="currentColor"
      />
      <path
        d="M100.684 10.2495H97.9062V22.8397H100.684V10.2495Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M100.531 7.85679C100.187 8.1924 99.776 8.3604 99.2962 8.3604C98.8163 8.3604 98.3961 8.1924 98.0363 7.85679C97.6931 7.50424 97.5215 7.09291 97.5215 6.62283C97.5215 6.15274 97.6931 5.7501 98.0363 5.4141C98.3786 5.06154 98.7989 4.88525 99.2962 4.88525C99.7934 4.88525 100.214 5.06154 100.557 5.4141C100.899 5.74971 101.071 6.15274 101.071 6.62283C101.071 7.09291 100.891 7.50424 100.531 7.85679Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M90.4186 9.92285C91.8755 9.92285 93.0504 10.3843 93.9417 11.3078C94.833 12.2311 95.2787 13.4733 95.2787 15.0346V22.8403H92.5015V15.2109C92.5015 14.3548 92.2783 13.6832 91.8326 13.1965C91.387 12.7095 90.7785 12.4661 90.0071 12.4661C89.1325 12.4661 88.4469 12.7473 87.9496 13.3097C87.4523 13.872 87.2037 14.6986 87.2037 15.7899V22.8403H84.4257V15.2109C84.4257 14.3378 84.216 13.6623 83.7958 13.1838C83.3755 12.7055 82.7797 12.4661 82.0084 12.4661C81.1512 12.4661 80.4609 12.7516 79.9382 13.3223C79.415 13.8929 79.1532 14.7156 79.1532 15.7899V22.8403H76.376V10.2506H79.1532V11.7614C79.9763 10.5361 81.2021 9.92324 82.8314 9.92324C84.4766 9.92324 85.6944 10.5866 86.4832 11.9124C87.3237 10.5862 88.6352 9.92285 90.4186 9.92285Z"
        fill="currentColor"
      />
      <path
        d="M57.6703 5.21338H54.8926V22.8396H57.6703V5.21338Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46.0418 13.7249C46.0418 14.111 46.2477 14.4257 46.6589 14.6695C47.0706 14.9128 47.6707 15.1435 48.4589 15.3619C49.0591 15.496 49.582 15.6388 50.0279 15.7899C50.4738 15.9409 50.945 16.1633 51.4424 16.4571C51.9399 16.7509 52.3214 17.137 52.5868 17.6154C52.8526 18.0937 52.9766 18.6518 52.9593 19.2899C52.9593 20.4986 52.4792 21.447 51.5194 22.1348C50.5592 22.823 49.3676 23.1672 47.9446 23.1672C46.6758 23.1672 45.5871 22.907 44.6783 22.3868C43.7697 21.8666 43.1095 21.1446 42.6982 20.2213L45.09 18.8615C45.5186 20.0703 46.47 20.6745 47.9446 20.6745C49.4019 20.6745 50.1306 20.2044 50.1306 19.2642C50.1306 18.576 49.3161 18.0389 47.6873 17.6528C47.0702 17.5018 46.5514 17.3508 46.1312 17.1997C45.7111 17.0487 45.2483 16.8302 44.7425 16.5451C44.2365 16.2596 43.8507 15.8821 43.5852 15.412C43.3194 14.9419 43.1949 14.3966 43.2122 13.7754C43.2122 12.6172 43.6581 11.6857 44.5495 10.9806C45.4582 10.2758 46.5812 9.92285 47.9188 9.92285C48.9818 9.92285 49.9291 10.1535 50.7605 10.6154C51.5923 11.0768 52.2307 11.7188 52.6766 12.5415L50.3364 13.8255C49.9078 12.8688 49.1018 12.3904 47.9188 12.3904C47.3702 12.3904 46.9199 12.508 46.5687 12.743C46.2175 12.978 46.0418 13.3053 46.0418 13.7249Z"
        fill="currentColor"
      />
      <path
        d="M40.4821 5.21338H37.5244V22.8396H40.4821V5.21338Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M70.7143 12.0383V10.2506H73.492V22.8407H70.7143V21.0278C69.6687 22.4546 68.1682 23.168 66.2136 23.168C64.4477 23.168 62.9388 22.5303 61.687 21.2542C60.4355 19.9784 59.8096 18.4088 59.8096 16.5455C59.8096 14.6821 60.4355 13.1125 61.687 11.8367C62.9388 10.5609 64.4473 9.92285 66.2136 9.92285C68.1682 9.92285 69.6683 10.628 70.7143 12.0383ZM63.7448 19.4413C64.5166 20.1965 65.4853 20.5743 66.651 20.5743C67.8166 20.5743 68.7857 20.1965 69.5571 19.4413C70.3288 18.6691 70.7143 17.7037 70.7143 16.5455C70.7143 15.3872 70.3284 14.4305 69.5571 13.6749C68.7857 12.9027 67.8166 12.5166 66.651 12.5166C65.4849 12.5166 64.5166 12.9027 63.7448 13.6749C62.9735 14.4305 62.5876 15.3868 62.5876 16.5455C62.5872 17.6868 62.9731 18.6522 63.7448 19.4413Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M146.322 21.2527C145.019 22.5285 143.416 23.1666 141.512 23.1666C139.609 23.1666 138.006 22.5289 136.703 21.2527C135.383 19.9603 134.723 18.3908 134.723 16.5439C134.723 14.6971 135.383 13.1279 136.703 11.8352C138.006 10.5595 139.609 9.92139 141.512 9.92139C143.416 9.92139 145.019 10.559 146.322 11.8352C147.642 13.1275 148.302 14.6975 148.302 16.5439C148.302 18.3904 147.642 19.9603 146.322 21.2527ZM137.5 16.5443C137.5 17.686 137.886 18.6341 138.657 19.3897C139.429 20.1449 140.38 20.5227 141.512 20.5227C142.644 20.5227 143.595 20.1449 144.367 19.3897C145.138 18.6341 145.524 17.686 145.524 16.5443C145.524 15.403 145.138 14.4546 144.367 13.699C143.595 12.9434 142.644 12.566 141.512 12.566C140.38 12.566 139.429 12.9438 138.657 13.699C137.886 14.4542 137.5 15.4026 137.5 16.5443Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M162.867 9.92285C164.359 9.92285 165.554 10.3886 166.455 11.3205C167.355 12.2524 167.805 13.5156 167.805 15.1103V22.8407H165.028V15.3872C165.028 14.4474 164.77 13.7253 164.255 13.2217C163.741 12.7181 163.038 12.4665 162.146 12.4665C161.135 12.4665 160.337 12.7729 159.755 13.3854C159.172 13.9983 158.881 14.9006 158.881 16.0923V22.8407H156.103V10.2506H158.881V11.8619C159.738 10.5693 161.067 9.92285 162.867 9.92285Z"
        fill="currentColor"
      />
      <path
        d="M153.244 10.2495H150.467V22.8397H153.244V10.2495Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M153.09 7.85679C152.748 8.1924 152.336 8.3604 151.856 8.3604C151.376 8.3604 150.956 8.1924 150.595 7.85679C150.253 7.50424 150.081 7.09291 150.081 6.62283C150.081 6.15274 150.253 5.7501 150.595 5.4141C150.938 5.06154 151.358 4.88525 151.856 4.88525C152.353 4.88525 152.772 5.06154 153.116 5.4141C153.459 5.74971 153.63 6.15274 153.63 6.62283C153.63 7.09291 153.45 7.50424 153.09 7.85679Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M125.82 23.1671C123.111 23.1671 120.865 22.2945 119.081 20.5486C117.299 18.7692 116.407 16.5955 116.407 14.0269C116.407 11.4419 117.299 9.27642 119.081 7.53055C120.847 5.76813 123.094 4.88672 125.82 4.88672C127.448 4.88672 128.953 5.26452 130.334 6.01974C131.714 6.77534 132.79 7.79911 133.561 9.09185L130.989 10.5522C130.509 9.67946 129.811 8.98693 128.893 8.47469C127.976 7.96275 126.951 7.70683 125.82 7.70683C123.917 7.70683 122.356 8.30272 121.139 9.4949C119.956 10.6701 119.365 12.181 119.365 14.0273C119.365 15.8738 119.956 17.3846 121.139 18.5598C122.356 19.7515 123.917 20.3479 125.82 20.3479C126.951 20.3479 127.98 20.0915 128.906 19.5796C129.832 19.0677 130.527 18.3753 130.989 17.5025L133.561 18.9376C132.824 20.2134 131.752 21.2458 130.346 22.0345C128.992 22.7898 127.483 23.1671 125.82 23.1671Z"
        fill="currentColor"
      />
    </svg>
  );
}
