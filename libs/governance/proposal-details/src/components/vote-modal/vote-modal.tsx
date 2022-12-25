import { useCallback } from 'react';
import { Button2, Card, Heading, Modal, ModalCloseButton } from '@haqq/ui-kit';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import { useProposalVote, useToast } from '@haqq/shared';

export interface VoteModalProps {
  proposalId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function VoteModal({ proposalId, isOpen, onClose }: VoteModalProps) {
  const vote = useProposalVote();
  const toast = useToast();
  const handleVote = useCallback(
    async (option: number) => {
      try {
        const txHash = await vote(proposalId, option);
        console.log('vote succesfull', { option, txHash });
        onClose();
        toast.success(`Your vote will be counted!!!`);
      } catch (error) {
        console.error((error as any).message);

        toast.error(`For some reason your vote failed.`);
      }
    },
    [onClose, proposalId, toast, vote],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="mx-auto w-[420px] !bg-white dark:!bg-slate-700">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-row justify-between items-center">
            <Heading level={3}>Vote for #{proposalId}</Heading>
            <ModalCloseButton onClick={onClose} />
          </div>

          <div className="flex flex-row space-x-2">
            <Button2
              onClick={() => {
                handleVote(VoteOption.VOTE_OPTION_YES);
              }}
              fill
            >
              YES
            </Button2>
            <Button2
              onClick={() => {
                handleVote(VoteOption.VOTE_OPTION_ABSTAIN);
              }}
              fill
            >
              ABSTAIN
            </Button2>
            <Button2
              onClick={() => {
                handleVote(VoteOption.VOTE_OPTION_NO);
              }}
              fill
            >
              NO
            </Button2>
            <Button2
              onClick={() => {
                handleVote(VoteOption.VOTE_OPTION_NO_WITH_VETO);
              }}
              fill
            >
              VETO
            </Button2>
          </div>
        </div>
      </Card>
    </Modal>
  );
}
