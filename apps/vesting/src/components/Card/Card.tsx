import styled from '@emotion/styled';
import clsx from 'clsx';
import { ReactElement, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  withShadow?: boolean;
}

const CardStyled = styled.div<{ withShadow?: boolean }>`
  box-shadow: ${({ withShadow }) => {
    return withShadow ? '0px 8px 24px rgba(15, 30, 51, 0.08)' : 'none';
  }};
`;

export function Card({
  children,
  className,
  withShadow = false,
}: CardProps): ReactElement {
  const classNames = clsx('bg-white rounded-[12px] shadow-sm', className);

  return (
    <CardStyled className={classNames} withShadow={withShadow}>
      {children}
    </CardStyled>
  );
}
