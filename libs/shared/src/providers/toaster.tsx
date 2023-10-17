import { Toaster as ReactHotToast } from 'react-hot-toast';

export function Toaster() {
  return <ReactHotToast containerStyle={{ zIndex: 9000 }} />;
}
