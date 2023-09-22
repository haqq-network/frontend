import toast, { Toaster as ReactHotToast, resolveValue } from 'react-hot-toast';

export function Toaster() {
  return (
    <ReactHotToast>
      {(t) => {
        return (
          <span
            onClick={() => {
              toast.dismiss(t.id);
            }}
          >
            {resolveValue(t.message, t)}
          </span>
        );
      }}
    </ReactHotToast>
  );
}
