/**
 * Normalizes unknown thrown values (including Internet Identity/agent errors 
 * and authorization Runtime.trap messages) into a user-facing English string.
 */
export function normalizeErrorMessage(error: unknown): string {
  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle objects with message property
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  // Handle agent errors (common in Internet Computer calls)
  if (error && typeof error === 'object') {
    // Check for reject_message (common in IC agent errors)
    if ('reject_message' in error) {
      const rejectMsg = (error as { reject_message: unknown }).reject_message;
      if (typeof rejectMsg === 'string') {
        return rejectMsg;
      }
    }

    // Check for error_message
    if ('error_message' in error) {
      const errorMsg = (error as { error_message: unknown }).error_message;
      if (typeof errorMsg === 'string') {
        return errorMsg;
      }
    }
  }

  // Fallback to generic message
  return 'An unexpected error occurred. Please try again.';
}
