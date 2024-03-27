import {
  PropsWithChildren,
  ReactNode,
  useState,
  useMemo,
  createContext,
  useContext,
  forwardRef,
  isValidElement,
  cloneElement,
  HTMLProps,
} from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/react';
import clsx from 'clsx';

export interface TooltipProps {
  text?: ReactNode;
  className?: string;
}

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return useMemo(() => {
    return {
      open,
      setOpen,
      ...interactions,
      ...data,
    };
  }, [open, setOpen, interactions, data]);
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = createContext<ContextType>(null);

export function useTooltipContext() {
  const context = useContext(TooltipContext);

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
}

export function Tooltip({
  text,
  children,
  ...options
}: PropsWithChildren<TooltipProps> & TooltipOptions) {
  const tooltip = useTooltip(options);

  if (!text || text === '') {
    return children;
  }

  return (
    <TooltipContext.Provider value={tooltip}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent
        className={clsx(
          'pointer-events-none select-none',
          'font-guise rounded-[4px] p-[8px] text-[12px] font-[500] leading-[18px] shadow-sm',
          'bg-haqq-black transform-gpu border border-[#FFFFFF26] bg-opacity-90 text-white backdrop-blur',
          'z-50',
        )}
      >
        {text}
      </TooltipContent>
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = forwardRef<
  HTMLElement,
  HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useTooltipContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': context.open ? 'open' : 'closed',
      }),
    );
  }

  return (
    <span
      ref={ref}
      // The user can style the trigger based on the state
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </span>
  );
});

export const TooltipContent = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(function TooltipContent({ style, ...props }, propRef) {
  const context = useTooltipContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.open) {
    return null;
  }

  return (
    <FloatingPortal>
      <span
        ref={ref}
        style={{
          ...context.floatingStyles,
          ...style,
        }}
        {...context.getFloatingProps(props)}
      />
    </FloatingPortal>
  );
});
