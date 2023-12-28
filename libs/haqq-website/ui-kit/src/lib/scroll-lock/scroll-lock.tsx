'use client';
import { useScrollLock } from '../hooks/use-scroll-lock';

export function ScrollLock({ isActive }: { isActive: boolean }) {
  useScrollLock(isActive);

  return null;
}
