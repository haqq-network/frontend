import {
  AcademyIcon,
  AlertIcon,
  BlogIcon,
  BuildIcon,
  CaseIcon,
  EcosystemIcon,
  HalfMoonAndStarIcon,
  MissionIcon,
  NewsIcon,
  PartnershipIcon,
  RoadmapIcon,
  StarIcon,
  ValuesIcon,
} from '@haqq/islamic-website-ui-kit';
import clsx from 'clsx';
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
  return (
    <div className={clsx('px-[16px] md:px-[48px]', className)}>
      <div className="flex flex-col gap-y-[12px]">
        <Link
          href="/shariah"
          className="hover:text-islamic-primary-green z-50 py-[12px] text-base uppercase text-white transition-colors duration-200"
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
              title="Whitepaper"
              icon={<HalfMoonAndStarIcon />}
              href="/whitepaper"
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
            <BurgerMenuDropdownLink
              onClick={onClick}
              title="Ecosystem"
              icon={<EcosystemIcon />}
              href="https://haqq.network/ecosystem"
              isOutLink
            />
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
        <Link
          href="/wallet"
          className="hover:text-islamic-primary-green z-50 py-[12px] text-base uppercase text-white transition-colors duration-200"
          onClick={onClick}
        >
          Wallet
        </Link>
        <MobileMenuDropdownLink title="Learn" withArrow>
          <BurgerMenuDropdownLink
            onClick={onClick}
            title="Academy"
            icon={<AcademyIcon />}
            href="/academy"
          />
          <BurgerMenuDropdownLink
            onClick={onClick}
            title="Blog"
            icon={<BlogIcon />}
            href="https://haqq.network/blog"
            isOutLink
          />
          <BurgerMenuDropdownLink
            onClick={onClick}
            title="Fraud alert"
            icon={<AlertIcon />}
            href="/fraud-alert"
          />
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
          <BurgerMenuDropdownLink
            onClick={onClick}
            title="Meet our team"
            icon={<StarIcon />}
            href="/team"
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
