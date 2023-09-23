import toast, { Toaster as ReactHotToast, resolveValue } from 'react-hot-toast';

export function Toaster() {
  return (
    <ReactHotToast containerStyle={{ zIndex: 6000 }}>
      {(t) => {
        return (
          <span
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="cursor-pointer"
          >
            {resolveValue(t.message, t)}
          </span>
        );
      }}
    </ReactHotToast>
  );
}
