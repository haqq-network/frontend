import { useCallback } from 'react';

interface UseClipboardHook {
  copyText: (text: string) => void;
}

export function useClipboard(): UseClipboardHook {
  const copyText = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`"${text}" copied to clipboard`);
    } catch (error) {
      console.error('Error in copying text: ', error);
    }
  }, []);

  return {
    copyText,
  };
}
