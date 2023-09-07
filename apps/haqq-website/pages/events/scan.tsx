import { ScanPage } from '@haqq/haqq-website/events';
import dynamic from 'next/dynamic';

const ScanPageWrapper = () =>  {
  return (
    <ScanPage />
  );
}

export default dynamic(() => {return Promise.resolve(ScanPageWrapper)}, {
  ssr: false,
});
