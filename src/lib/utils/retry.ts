import { z } from 'zod';

interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff?: number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = { maxAttempts: 3, delay: 1000, backoff: 2 }
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt === options.maxAttempts) break;
      
      const delay = options.delay * Math.pow(options.backoff || 1, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error(`All ${options.maxAttempts} attempts failed. Last error: ${lastError?.message}`);
} 