import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { WaitlistPage } from '@haqq/shell-burn-waitlist';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface BurnWaitlistPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BurnWaitlistPage({
  params,
}: BurnWaitlistPageProps) {
  const { locale } = await params;
  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <WaitlistPage locale={locale} />
    </HydrationBoundary>
  );
}
