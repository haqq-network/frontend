import { useCallback } from 'react';
import { Button2, Card, Heading, Modal, ModalCloseButton } from '@haqq/ui-kit';
import toast from 'react-hot-toast';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import { useProposal } from '@haqq/hooks';

export interface VoteModalProps {
  proposalId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function VoteModal({ proposalId, isOpen, onClose }: VoteModalProps) {
  const handleModalClose = useCallback(() => {
    onClose();
  }, [onClose]);
  const { vote } = useProposal();
  const handleVote = useCallback(
    async (option: number) => {
      try {
        const txHash = await vote(proposalId, option);
        console.log('vote succesfull', { option, txHash });
        handleModalClose();
        toast.success(`Your vote will be counted!!!`);
      } catch (error) {
        console.error((error as any).message);

        toast.error(`For some reason your vote failed.`);
      }
    },
    [handleModalClose, proposalId, vote],
  );

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <Card className="mx-auto w-[420px] !bg-white dark:!bg-slate-700">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-row justify-between items-center">
            <Heading level={3}>Vote for #{proposalId}</Heading>
            <ModalCloseButton onClick={handleModalClose} />
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
