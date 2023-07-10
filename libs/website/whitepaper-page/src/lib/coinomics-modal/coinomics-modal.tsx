import { Modal } from '@haqq/website-ui-kit';
import { CoinomicsInfo } from '../coinomics-info/coinomics-info';

interface CoinomicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CoinomicsModal({ isOpen, onClose }: CoinomicsModalProps) {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <CoinomicsInfo onClick={onClose} />
    </Modal>
  );
}
