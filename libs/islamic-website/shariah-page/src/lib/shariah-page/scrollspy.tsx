'use client';
import { PropsWithChildren, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export function ScrollSpySection({
  children,
  id,
  onSectionInView,
  threshold = [0.3, 0.7],
  className,
  initialInView = false,
}: PropsWithChildren<{
  id: string;
  onSectionInView: (id: string, inView: boolean) => void;
  threshold?: number | number[];
  className?: string;
  initialInView?: boolean;
}>) {
  const [ref, inView] = useInView({
    threshold,
    initialInView,
  });

  useEffect(() => {
    onSectionInView(id, inView);
  }, [id, inView, onSectionInView]);

  return (
    <section id={id} ref={ref} className={className}>
      {children}
    </section>
  );
}
