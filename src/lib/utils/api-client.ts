import axios from 'axios';
import axiosRetry from 'axios-retry';
import { z } from 'zod';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty'
  }
});

// Create axios instance with default config
export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add retry logic
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // exponential backoff
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx responses
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           error.response?.status === 429 || // Rate limit
           error.response?.status === 503;    // Service unavailable
  },
  onRetry: (retryCount, error, requestConfig) => {
    logger.warn(
      `Retrying request to ${requestConfig.url} (attempt ${retryCount})`
    );
  }
});

// Add response interceptor for logging
apiClient.interceptors.response.use(
  response => response,
  error => {
    logger.error({
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      error: error.message
    }, 'API request failed');
    return Promise.reject(error);
  }
);

// Type-safe API response handler
export async function fetchWithValidation<T>(
  url: string, 
  schema: z.ZodType<T>,
  config = {}
): Promise<T> {
  const response = await apiClient.get(url, config);
  return schema.parse(response.data);
} 