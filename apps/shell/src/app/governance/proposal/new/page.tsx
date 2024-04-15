import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { Container } from '@haqq/shell-ui-kit';
import {
  CreateTextProposalForm,
  CreateUpgradeProposalForm,
} from '../../../../components/submit-proposal-form';
// import { CreateProposalFormKeplr } from '../../../../components/submit-proposal-su-form-keplr';

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

        <CreateTextProposalForm />
        <CreateUpgradeProposalForm />
        {/* <CreateProposalFormKeplr /> */}
      </div>
    </HydrationBoundary>
  );
}
