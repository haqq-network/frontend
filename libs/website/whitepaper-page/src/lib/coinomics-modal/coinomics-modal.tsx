import { Modal } from '@haqq/website-ui-kit';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { CoinomicsInfo } from '../coinomics-info/coinomics-info';

export function CoinomicsModal() {
  const router = useRouter();
  const { query } = router;
  const [isOpen, setIsOpen] = useState(true);

  // useEffect(() => {
  //   setIsOpen(query.centuryCoinomics === 'true');
  // }, [query.centuryCoinomics]);

  const closeCoinomicsModal = useCallback(() => {
    router.push({ query: {} }, undefined, { scroll: false });
    setIsOpen(false);
  }, [router]);

  return (
    <Modal onClose={closeCoinomicsModal} isOpen={isOpen}>
      <CoinomicsInfo onClick={closeCoinomicsModal} />
    </Modal>
  );
}
