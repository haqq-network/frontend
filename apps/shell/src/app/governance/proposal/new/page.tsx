import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { Container } from '@haqq/shell-ui-kit';
import { CreateSoftwareUpgradeProposalFormKeplr } from '../../../../components/submit-proposal-su-form-keplr';
import { CreateTextProposalFormKeplr } from '../../../../components/submit-proposal-text-form-keplr';

export default async function CreateProposal() {
  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div>
        <div className="py-[32px] lg:py-[68px]">
          <Container>
            <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              Submit proposal
            </div>
          </Container>
        </div>

        <div>
          <Container>
            <div className="flex flex-col gap-12 md:flex-row">
              <CreateTextProposalFormKeplr />
              <CreateSoftwareUpgradeProposalFormKeplr />
            </div>
          </Container>
        </div>
      </div>
    </HydrationBoundary>
  );
}
