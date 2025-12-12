'use client';

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export interface RecoveryLinkProps {
  /** Custom recovery page URL. Defaults to '/bridge/recovery' */
  href?: string;
  /** Custom title text */
  title?: string;
  /** Custom description text */
  description?: string;
  /** Custom link text */
  linkText?: string;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * Recovery Link Component
 * Displays a call-to-action link for users to recover their withdrawal transactions
 */
export function RecoveryLink({
  href = '/bridge/recovery',
  title = 'Lost track of your withdrawal?',
  description = 'Use transaction hash to recover and complete your withdrawal.',
  linkText = 'Recover Withdrawal',
  className = '',
}: RecoveryLinkProps) {
  return (
    <div className={`mt-6 border-t border-gray-200 pt-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <p>{title}</p>
          <p className="text-xs">{description}</p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-md border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
        >
          <ExternalLink className="h-4 w-4" />
          {linkText}
        </Link>
      </div>
    </div>
  );
}
