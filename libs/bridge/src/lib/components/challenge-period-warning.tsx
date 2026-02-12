'use client';

import { useTranslate } from '@tolgee/react';
import { AlertTriangle } from 'lucide-react';

interface ChallengePeriodWarningProps {
  isL2ToL1?: boolean;
}

export function ChallengePeriodWarning({
  isL2ToL1 = false,
}: ChallengePeriodWarningProps) {
  const { t } = useTranslate('common');

  if (!isL2ToL1) {
    return null;
  }

  return (
    <div className="mt-4 mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start">
        <AlertTriangle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-amber-600" />
        <div className="text-sm">
          <h4 className="mb-1 font-medium text-amber-800">
            {t('challenge-period-warning-title', 'Challenge Period Notice')}
          </h4>
          <p className="text-amber-700">
            {t(
              'challenge-period-warning-message',
              'The 7-day withdrawal challenge period is crucial for security. Your withdrawal will be available to finalize after this period expires.',
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
