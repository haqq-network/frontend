import {
  AcademyIcon,
  AlertIcon,
  BlogIcon,
  BuildIcon,
  CaseIcon,
  CommunityIcon,
  EcosystemIcon,
  HalfMoonAndStarIcon,
  MissionIcon,
  NewsIcon,
  PartnershipIcon,
  QuestionMarkIcon,
  RoadmapIcon,
  StarIcon,
  ValuesIcon,
} from '@haqq/islamic-website-ui-kit';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Fragment,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from 'react';

function BurgerMenuDropdownLink({
  icon,
  title,
  href,
  onClick,
  isOutLink = false,
}: {
  icon?: ReactNode;
  title: string;
  href: string;
  onClick?: () => void;
  isOutLink?: boolean;
}) {
  return (
    <Link
      href={href}
      className="hover:text-islamic-primary-green w-fit py-[12px] text-base font-[500] text-white transition-colors duration-200"
      onClick={onClick}
      target={isOutLink ? '_blank' : undefined}
      rel={isOutLink ? 'noopener noreferrer' : undefined}
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
  const t = useTranslations('header');
  return (
    <div className={clsx('px-[16px] md:px-[48px]', className)}>
      <div className="flex flex-col gap-y-[12px]">
        <Link
          href="/shariah"
          className="hover:text-islamic-primary-green z-50 py-[12px] text-base uppercase text-white transition-colors duration-200"
          onClick={onClick}
        >
          {t('single-links.shariah')}
        </Link>
        <MobileMenuDropdownLink
          title={t('dropdown-links.about.about')}
          withArrow
        >
          <div className="flex flex-col">
            <BurgerMenuDropdownLink
              title={t('dropdown-links.about.mission')}
              icon={<MissionIcon />}
              href="/mission"
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.about.whitepaper')}
              icon={<HalfMoonAndStarIcon />}
              href="/whitepaper"
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.about.roadmap')}
              icon={<RoadmapIcon />}
              href="/roadmap"
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.about.news')}
              icon={<NewsIcon />}
              href="/news"
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.about.ecosystem')}
              icon={<EcosystemIcon />}
              href="https://haqq.network/ecosystem"
              isOutLink
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.about.partnerships')}
              icon={<PartnershipIcon />}
              href="/partnerships"
              onClick={onClick}
            />
            <BurgerMenuDropdownLink
              title={t('dropdown-links.about.build-on-haqq')}
              icon={<BuildIcon />}
              href="/build"
              onClick={onClick}
            />
          </div>
        </MobileMenuDropdownLink>
        <Link
          href="/wallet"
          className="hover:text-islamic-primary-green z-50 py-[12px] text-base uppercase text-white transition-colors duration-200"
          onClick={onClick}
        >
          {t('single-links.wallet')}
        </Link>
        <MobileMenuDropdownLink title="Learn" withArrow>
          <BurgerMenuDropdownLink
            title={t('dropdown-links.learn.academy')}
            icon={<AcademyIcon />}
            href="/academy"
            onClick={onClick}
          />
          <BurgerMenuDropdownLink
            onClick={onClick}
            title="Privacy Policy"
            icon={<QuestionMarkIcon />}
            href="/privacy-policy"
          />
          <BurgerMenuDropdownLink
            onClick={onClick}
            title={t('dropdown-links.learn.blog')}
            icon={<BlogIcon />}
            href="https://haqq.network/blog"
            isOutLink
          />
          <BurgerMenuDropdownLink
            title={t('dropdown-links.learn.fraud-alert')}
            icon={<AlertIcon />}
            href="/fraud-alert"
            onClick={onClick}
          />
        </MobileMenuDropdownLink>
        <MobileMenuDropdownLink title="Team" withArrow>
          <BurgerMenuDropdownLink
            title={t('dropdown-links.team.career')}
            icon={<CaseIcon />}
            href="/career"
            onClick={onClick}
          />
          <BurgerMenuDropdownLink
            title={t('dropdown-links.team.our-values')}
            icon={<ValuesIcon />}
            href="/values"
            onClick={onClick}
          />
          <BurgerMenuDropdownLink
            title={t('dropdown-links.team.community')}
            icon={<CommunityIcon />}
            href="/community-hub"
            onClick={onClick}
          />
          <BurgerMenuDropdownLink
            title={t('dropdown-links.team.meet-our-team')}
            icon={<StarIcon />}
            href="/team"
            onClick={onClick}
          />
        </MobileMenuDropdownLink>
      </div>
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
        className="hover:text-islamic-primary-green z-50 flex cursor-default items-center justify-between py-[12px] text-base uppercase text-white transition-colors duration-200"
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
