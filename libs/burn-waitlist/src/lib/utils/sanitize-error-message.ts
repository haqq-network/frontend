/**
 * Sanitizes error messages to show user-friendly messages
 */
export function sanitizeErrorMessage(
  error: Error | null | undefined,
): string | undefined {
  if (!error) {
    return undefined;
  }

  // Handle error objects without message property
  const message = error instanceof Error ? error.message : String(error || '');

  if (!message || message.trim() === '') {
    return undefined;
  }

  const messageLower = message.toLowerCase();

  // User rejection errors
  if (
    messageLower.includes('user rejected') ||
    messageLower.includes('user denied') ||
    messageLower.includes('denied transaction signature') ||
    messageLower.includes('rejected the request') ||
    messageLower.includes('user rejected the request')
  ) {
    return 'Transaction rejected by user';
  }

  // Network errors
  if (messageLower.includes('network') || messageLower.includes('fetch')) {
    return 'Network error. Please check your connection and try again';
  }

  // Insufficient funds
  if (
    messageLower.includes('insufficient funds') ||
    messageLower.includes('insufficient balance')
  ) {
    return 'Insufficient balance';
  }

  // Contract execution reverted
  if (
    messageLower.includes('execution reverted') ||
    messageLower.includes('revert')
  ) {
    // Try to extract a more meaningful message if available
    const revertMatch = message.match(/execution reverted:?\s*(.+?)(?:\n|$)/i);
    if (revertMatch && revertMatch[1] && revertMatch[1].trim().length < 100) {
      return `Transaction failed: ${revertMatch[1].trim()}`;
    }
    return 'Transaction failed. Please try again';
  }

  // Transaction timeout or expired
  if (messageLower.includes('timeout') || messageLower.includes('expired')) {
    return 'Transaction timed out. Please try again';
  }

  // Return original message if no specific pattern matches, but limit length
  return message.length > 200 ? `${message.substring(0, 200)}...` : message;
}
