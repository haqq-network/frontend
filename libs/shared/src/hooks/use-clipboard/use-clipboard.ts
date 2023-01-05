interface UseClipboardHook {
  copyText: (text: string) => Promise<void>;
}

export function useClipboard(): UseClipboardHook {
  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      // console.log(`"${text}" copied to clipboard`);
    } catch (error) {
      console.error('Error in copying text: ', error);
      throw error;
    }
  }

  return {
    copyText,
  };
}
