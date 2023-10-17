import toast, { Toaster as ReactHotToast, resolveValue } from 'react-hot-toast';

export function Toaster() {
  return (
    <ReactHotToast containerStyle={{ zIndex: 9000 }}>
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
