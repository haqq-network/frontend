import clsx from 'clsx';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

function BurgerMenuNavLink({
  href,
  children,
  isOutLink = false,
}: {
  href: string;
  children: ReactNode;
  isOutLink?: boolean;
}) {
  const additionalProps = isOutLink
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};
  return (
    <Link
      to={href}
      className="text-[13px] leading-[20px] sm:text-[15px] sm:leading-[24px]"
      {...additionalProps}
    >
      {children}
    </Link>
  );
}

export function BurgerMenu({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'bg-[#0D0D0E] z-50 px-[20px] py-[32px] sm:py-[40px] sm:pl-[40px] sm:pr-[64px]',
        'overflow-y-auto',
        className,
      )}
    >
      <div className="flex flex-col items-start space-y-[16px] mb-[60px] sm:mb-[80px]">
        <BurgerMenuNavLink href="/staking">Staking</BurgerMenuNavLink>
        <BurgerMenuNavLink href="/governance">Governance</BurgerMenuNavLink>
      </div>
    </div>
  );
}
