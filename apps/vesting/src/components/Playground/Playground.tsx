import clsx from 'clsx';

export function JSONPre({ object }: { object: Record<string, unknown> }) {
  return (
    <pre className="rounded-md border border-slate-200 bg-slate-100 p-2">
      {JSON.stringify(object, null, 2)}
    </pre>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(
        'text-primary h-[48px] w-[48px] leading-none opacity-50',
        className,
      )}
    >
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
        transform="translate(12, 12) scale(0)"
        stroke="currentColor"
      >
        <animateTransform
          id="a"
          begin="0;c.end"
          attributeName="transform"
          calcMode="spline"
          type="translate"
          dur="1.2s"
          values="12 12;0 0"
          keySplines=".52,.6,.25,.99"
        />
        <animateTransform
          begin="0;c.end"
          attributeName="transform"
          calcMode="spline"
          additive="sum"
          type="scale"
          dur="1.2s"
          values="0;1"
          keySplines=".52,.6,.25,.99"
        />
        <animate
          begin="0;c.end"
          attributeName="opacity"
          calcMode="spline"
          dur="1.2s"
          values="1;0"
          keySplines=".52,.6,.25,.99"
        />
      </path>
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
        transform="translate(12, 12) scale(0)"
        stroke="currentColor"
      >
        <animateTransform
          id="b"
          begin="a.begin+0.2s"
          attributeName="transform"
          calcMode="spline"
          type="translate"
          dur="1.2s"
          values="12 12;0 0"
          keySplines=".52,.6,.25,.99"
        />
        <animateTransform
          begin="a.begin+0.2s"
          attributeName="transform"
          calcMode="spline"
          additive="sum"
          type="scale"
          dur="1.2s"
          values="0;1"
          keySplines=".52,.6,.25,.99"
        />
        <animate
          begin="a.begin+0.2s"
          attributeName="opacity"
          calcMode="spline"
          dur="1.2s"
          values="1;0"
          keySplines=".52,.6,.25,.99"
        />
      </path>
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
        transform="translate(12, 12) scale(0)"
        stroke="currentColor"
      >
        <animateTransform
          id="c"
          begin="a.begin+0.4s"
          attributeName="transform"
          calcMode="spline"
          type="translate"
          dur="1.2s"
          values="12 12;0 0"
          keySplines=".52,.6,.25,.99"
        />
        <animateTransform
          begin="a.begin+0.4s"
          attributeName="transform"
          calcMode="spline"
          additive="sum"
          type="scale"
          dur="1.2s"
          values="0;1"
          keySplines=".52,.6,.25,.99"
        />
        <animate
          begin="a.begin+0.4s"
          attributeName="opacity"
          calcMode="spline"
          dur="1.2s"
          values="1;0"
          keySplines=".52,.6,.25,.99"
        />
      </path>
    </svg>
  );
}
