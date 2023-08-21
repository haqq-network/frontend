import {
  AcademyIcon,
  AlertIcon,
  BlogIcon,
  BuildIcon,
  CaseIcon,
  CommunityIcon,
  EcosystemIcon,
  EventsIcon,
  GetISLMIcon,
  MissionIcon,
  NewsIcon,
  PartnersIcon,
  PartnershipIcon,
  PodcastIcon,
  QuestionMarkIcon,
  RoadmapIcon,
  RocketIcon,
  StakingIcon,
  StarIcon,
  TokenomicsIcon,
  ValuesIcon,
  VideoIcon,
  WalletIcon,
} from '@haqq/islamic-ui-kit';
import clsx from 'clsx';
import Link from 'next/link';
import {
  Fragment,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from 'react';

const HEADER_LINKS = [
  {
    title: 'Shariah',
  },
  {
    title: 'About',
    withArrow: true,
    children: [
      {
        title: 'Mission',
        icon: <MissionIcon />,
      },
      {
        title: 'Roadmap',
        icon: <RoadmapIcon />,
      },
      {
        title: 'News',
        icon: <NewsIcon />,
      },
      {
        title: 'Press',
        icon: <NewsIcon />,
      },
      {
        title: 'Events',
        icon: <EventsIcon />,
      },
      { title: 'Ecosystem', icon: <EcosystemIcon /> },
      { title: 'Partnerships', icon: <PartnershipIcon /> },
      { title: 'Build on HAQQ', icon: <BuildIcon /> },
    ],
  },
  {
    title: 'Use ISLM',
    withArrow: true,
    children: [
      { title: 'Wallet', icon: <WalletIcon /> },
      { title: 'Staking & Hodling', icon: <StakingIcon /> },
      { title: 'Tracker and Tokenomics', icon: <TokenomicsIcon /> },
      { title: 'What is ISLM', icon: <QuestionMarkIcon /> },
      { title: 'Get ISLM', icon: <GetISLMIcon /> },
    ],
  },
  {
    title: 'Learn',
    withArrow: true,
    children: [
      { title: 'Academy', icon: <AcademyIcon /> },
      { title: 'Blog', icon: <BlogIcon /> },
      { title: 'Podcast', icon: <PodcastIcon /> },
      { title: 'Videos', icon: <VideoIcon /> },
      { title: 'Where to start?', icon: <RocketIcon /> },
      { title: 'Partners', icon: <PartnersIcon /> },
    ],
  },
  {
    title: 'Team',
    withArrow: true,
    children: [
      { title: 'Career', icon: <CaseIcon /> },
      { title: 'Our Values', icon: <ValuesIcon /> },
      { title: 'Community', icon: <CommunityIcon /> },
      { title: 'Meet the team', icon: <StarIcon /> },
      { title: 'Fraud Alert', icon: <AlertIcon /> },
    ],
  },
];

function BurgerMenuDropdownLink({
  icon,
  title,
  href,
  onClick,
}: {
  icon?: ReactNode;
  title: string;
  href: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="hover:text-islamic-primary-green w-fit cursor-pointer py-[12px] text-base font-[500] text-white transition-colors duration-200"
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-x-[10px]">
        {icon && <div>{icon}</div>}
        <div>{title}</div>
      </div>
    </Link>
  );
}

export function BurgerMenu({
  className,
  isOpen,
  onClick,
}: {
  className?: string;
  isOpen?: boolean;
  onClick: () => void;
}) {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const toggleLangMenu = useCallback(() => {
    return setIsLangMenuOpen(!isLangMenuOpen);
  }, [isLangMenuOpen]);

  return (
    <div className={clsx('px-[16px] md:px-[48px]', className)}>
      {!isLangMenuOpen ? (
        <div className="flex flex-col gap-y-[12px]">
          <Link
            href="/shariah"
            className="hover:text-islamic-primary-green z-50 cursor-pointer py-[12px] text-base uppercase text-white transition-colors duration-200"
            onClick={onClick}
          >
            Shariah
          </Link>
          <MobileMenuDropdownLink title="About" withArrow>
            <div className="flex flex-col">
              <BurgerMenuDropdownLink
                title="Mission"
                icon={<MissionIcon />}
                href="/mission"
                onClick={onClick}
              />
              <BurgerMenuDropdownLink
                onClick={onClick}
                title="Roadmap"
                icon={<RoadmapIcon />}
                href="/roadmap"
              />
              <BurgerMenuDropdownLink
                onClick={onClick}
                title="News"
                icon={<NewsIcon />}
                href="/news"
              />
              {/* <BurgerMenuDropdownLink
                onClick={onClick}
                title="Press"
                icon={<NewsIcon />}
                href="/press"
              /> */}
              {/* <BurgerMenuDropdownLink
                onClick={onClick}
                title="Events"
                icon={<EventsIcon />}
                href="/events"
              />
              <BurgerMenuDropdownLink
                onClick={onClick}
                title="Ecosystem"
                icon={<EcosystemIcon />}
                href="/ecosystem"
              /> */}
              <BurgerMenuDropdownLink
                onClick={onClick}
                title="Partnerships"
                icon={<PartnershipIcon />}
                href="/partnerships"
              />
              <BurgerMenuDropdownLink
                onClick={onClick}
                title="Build on HAQQ"
                icon={<BuildIcon />}
                href="/build"
              />
            </div>
          </MobileMenuDropdownLink>
          <MobileMenuDropdownLink title="Use ISLM" withArrow>
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Wallet"
              icon={<WalletIcon />}
              href="/wallet"
            />
            {/* <BurgerMenuDropdownLink
              onClick={onClick}
              title="Staking & Hodling"
              icon={<StakingIcon />}
              href="/hodling"
            />
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Tracker and Tokenomics"
              icon={<TokenomicsIcon />}
              href="/tokenomics"
            />
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="What is ISLM"
              icon={<QuestionMarkIcon />}
              href="/what-is-islm"
            />
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Get ISLM"
              icon={<GetISLMIcon />}
              href="/get-islm"
            /> */}
          </MobileMenuDropdownLink>
          <MobileMenuDropdownLink title="Learn" withArrow>
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Academy"
              icon={<AcademyIcon />}
              href="/academy"
            />
            {/* <BurgerMenuDropdownLink
              onClick={onClick}
              title="Blog"
              icon={<BlogIcon />}
              href="/blog"
            />
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Podcast"
              icon={<PodcastIcon />}
              href="/podcast"
            />
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Videos"
              icon={<VideoIcon />}
              href="/videos"
            />
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Where to start?"
              icon={<RocketIcon />}
              href="/where-to-start"
            />
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Partners"
              icon={<PartnersIcon />}
              href="/partners"
            /> */}
          </MobileMenuDropdownLink>
          <MobileMenuDropdownLink title="Team" withArrow>
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Career"
              icon={<CaseIcon />}
              href="/career"
            />
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Our Values"
              icon={<ValuesIcon />}
              href="/values"
            />
            {/* <BurgerMenuDropdownLink
              onClick={onClick}
              title="Community"
              icon={<CommunityIcon />}
              href="/community"
            /> */}
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Meet our team"
              icon={<StarIcon />}
              href="/team"
            />
            {/* <BurgerMenuDropdownLink
              onClick={onClick}
              title="Fraud alert"
              icon={<AlertIcon />}
              href="/fraud"
            /> */}
          </MobileMenuDropdownLink>

          <div
            className="hover:text-islamic-primary-green z-50 flex cursor-pointer items-center justify-between py-[12px] text-base uppercase text-white transition-colors duration-200"
            onClick={toggleLangMenu}
          >
            Lang
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-[4px]"
            >
              <path
                d="M17.2773 11.9941C17.2773 11.7256 17.1807 11.4893 16.9766 11.2852L8.45801 2.95996C8.27539 2.7666 8.03906 2.66992 7.75977 2.66992C7.20117 2.66992 6.77149 3.08887 6.77149 3.64746C6.77149 3.92676 6.88965 4.16309 7.06152 4.3457L14.8818 11.9941L7.06152 19.6426C6.88965 19.8252 6.77148 20.0723 6.77148 20.3408C6.77148 20.8994 7.20117 21.3184 7.75977 21.3184C8.03906 21.3184 8.27539 21.2217 8.45801 21.0391L16.9766 12.7031C17.1807 12.5098 17.2773 12.2627 17.2773 11.9941Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-y-[12px]">
          <div
            className='hover:text-islamic-primary-green duration-200" z-50 flex w-fit cursor-pointer items-start gap-x-[10px] py-[12px] text-base uppercase text-white transition-colors'
            onClick={toggleLangMenu}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.77148 11.9941C6.77148 12.2627 6.86816 12.499 7.07227 12.7031L15.5908 21.0283C15.7734 21.2217 16.0098 21.3184 16.2891 21.3184C16.8477 21.3184 17.2773 20.8994 17.2773 20.3408C17.2773 20.0615 17.1592 19.8252 16.9873 19.6426L9.16699 11.9941L16.9873 4.3457C17.1592 4.16309 17.2773 3.91602 17.2773 3.64746C17.2773 3.08887 16.8477 2.66992 16.2891 2.66992C16.0098 2.66992 15.7734 2.7666 15.5908 2.94922L7.07227 11.2852C6.86816 11.4785 6.77148 11.7256 6.77148 11.9941Z"
                fill="currentColor"
              />
            </svg>
            <span>Back</span>
          </div>
          {/* <div className="flex flex-col">
            <BurgerMenuDropdownLink title="English" href="#" />
            <BurgerMenuDropdownLink title="عربي" href="#" />
            <BurgerMenuDropdownLink title="Bahasa Indonesia" href="#" />
          </div> */}
        </div>
      )}
    </div>
  );
}

function MobileMenuDropdownLink({
  title,
  withArrow,
  children,
}: PropsWithChildren<{
  title: string;
  withArrow?: boolean;
}>) {
  const [isSelectorOpened, setIsSelectorOpened] = useState(false);

  const toggleSelector = useCallback(() => {
    return setIsSelectorOpened(!isSelectorOpened);
  }, [isSelectorOpened]);

  return (
    <Fragment>
      <div
        onClick={toggleSelector}
        className="hover:text-islamic-primary-green z-50 flex cursor-pointer items-center justify-between py-[12px] text-base uppercase text-white transition-colors duration-200"
      >
        <div>{title}</div>

        <div
          className={clsx(
            'mr-[6px] transform transition-transform duration-100',
            isSelectorOpened && 'rotate-180',
          )}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.0234 17.2471C12.292 17.2471 12.5283 17.1504 12.7324 16.9463L21.0576 8.42773C21.251 8.24512 21.3477 8.00879 21.3477 7.72949C21.3477 7.1709 20.9287 6.74121 20.3701 6.74121C20.0908 6.74121 19.8545 6.85937 19.6719 7.03125L12.0234 14.8516L4.375 7.03125C4.19238 6.85937 3.94531 6.74121 3.67676 6.74121C3.11816 6.74121 2.69922 7.1709 2.69922 7.72949C2.69922 8.00879 2.7959 8.24512 2.97852 8.42773L11.3145 16.9463C11.5078 17.1504 11.7549 17.2471 12.0234 17.2471Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {isSelectorOpened && children}
    </Fragment>
  );
}
