import {
  AcademyIcon,
  AlertIcon,
  BlogIcon,
  BuildIcon,
  CaseIcon,
  CommunityIcon,
  DropdownLink,
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
import { Fragment, PropsWithChildren, useCallback, useState } from 'react';

export function BurgerMenu({
  className,
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) {
  return (
    <div className={clsx('px-[16px] pt-[24px] md:px-[48px]', className)}>
      <div className="flex flex-col">
        <MobileMenuLink title="Shariah" />
        <MobileMenuLink title="About" withArrow>
          <div className="flex flex-col">
            <DropdownLink title="Mission" icon={<MissionIcon />} />
            <DropdownLink title="Roadmap" icon={<RoadmapIcon />} />
            <DropdownLink title="News" icon={<NewsIcon />} />
            <DropdownLink title="Press" icon={<NewsIcon />} />
            <DropdownLink title="Events" icon={<EventsIcon />} />
            <DropdownLink title="Ecosystem" icon={<EcosystemIcon />} />
            <DropdownLink title="Partnerships" icon={<PartnershipIcon />} />
            <DropdownLink title="Build on HAQQ" icon={<BuildIcon />} />
          </div>
        </MobileMenuLink>
        <MobileMenuLink title="Use Islm" withArrow>
          <DropdownLink title="Wallet" icon={<WalletIcon />} />
          <DropdownLink title="Staking & Hodling" icon={<StakingIcon />} />
          <DropdownLink
            title="Tracker and Tokenomics"
            icon={<TokenomicsIcon />}
          />
          <DropdownLink title="What is ISLM" icon={<QuestionMarkIcon />} />
          <DropdownLink title="Get ISLM" icon={<GetISLMIcon />} />
        </MobileMenuLink>
        <MobileMenuLink title="Learn" withArrow>
          <DropdownLink title="Academy" icon={<AcademyIcon />} />
          <DropdownLink title="Blog" icon={<BlogIcon />} />
          <DropdownLink title="Podcast" icon={<PodcastIcon />} />
          <DropdownLink title="Videos" icon={<VideoIcon />} />
          <DropdownLink title="Where to start?" icon={<RocketIcon />} />
          <DropdownLink title="Partners" icon={<PartnersIcon />} />
        </MobileMenuLink>
        <MobileMenuLink title="Team" withArrow>
          <DropdownLink title="Career" icon={<CaseIcon />} />
          <DropdownLink title="Our Values" icon={<ValuesIcon />} />
          <DropdownLink title="Community" icon={<CommunityIcon />} />
          <DropdownLink title="Meet our team" icon={<StarIcon />} />
          <DropdownLink title="Fraud alert" icon={<AlertIcon />} />
        </MobileMenuLink>
      </div>
    </div>
  );
}

function MobileMenuLink({
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
        onClick={withArrow ? toggleSelector : undefined}
        className="hover:text-islamic-primary-green z-50 flex cursor-pointer items-center justify-between bg-[#15191EF2] py-[12px] text-base uppercase text-white transition-colors duration-300"
      >
        {title}
        {withArrow && (
          <div
            className={clsx(
              'transform transition-transform duration-100',
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
        )}
      </div>
      {isSelectorOpened && children}
    </Fragment>
  );
}
