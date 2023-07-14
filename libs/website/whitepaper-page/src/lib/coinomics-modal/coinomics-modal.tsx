import { Modal } from '@haqq/website-ui-kit';
import { CoinomicsInfo } from '../coinomics-info/coinomics-info';

export function CoinomicsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <CoinomicsInfo />
    </Modal>
  );
}
