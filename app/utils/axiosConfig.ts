import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
} from 'axios';
import Cookies from 'js-cookie';

import { logger } from './logger';
import { getIdToken } from '../libraries/firebase';

function getCSRFToken(): string | undefined {
  return Cookies.get('csrftoken');
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 30000, // 30 second timeout
  proxy: false, // Disable proxy to prevent IPv6 resolution
  family: 4, // Force IPv4
  withCredentials: true, // Important for CORS with credentials
  responseType: 'json',
  transformResponse: [(data) => {
    // Try to parse string response as JSON
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  },]
});

// Request timing tracking
const pendingRequests = new Map<string, number>();

// Request interceptor to add auth token and track timing
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Initialize headers if they don't exist
    const headers = new AxiosHeaders(config.headers);
    
    // Only generate request ID if one doesn't exist
    let requestId = headers.get('X-Request-ID') as string;
    if (!requestId) {
      requestId = Math.random().toString(36).substring(7);
      headers.set('X-Request-ID', requestId);
      pendingRequests.set(requestId, Date.now());
    }

    // Only add tokens and origin on client side
    if (typeof window !== 'undefined') {
      try {
        // Add Origin header
        headers.set('Origin', window.location.origin);

        // Add CSRF token
        const csrfToken = getCSRFToken();
        if (csrfToken) {
          headers.set('X-CSRFToken', csrfToken);
        }

        // Add auth token
        const token = await getIdToken();
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        logger.error('Failed to get tokens', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    config.headers = headers;

    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      const fullUrl = new URL(config.url || '', config.baseURL).toString();
      logger.debug('API Request', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullUrl,
        requestId,
        headers: {
          ...Object.fromEntries(headers),
          Authorization: headers.get('Authorization') ? '[REDACTED]' : undefined
        },
        data: config.data
      });
    }

    return config;
  },
  (error: AxiosError) => {
    logger.error('Request interceptor error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic for rate limiting and AWS-specific error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestId = response.config.headers?.['X-Request-ID'] as string;
    const startTime = pendingRequests.get(requestId);
    
    if (startTime) {
      const duration = Date.now() - startTime;
      pendingRequests.delete(requestId);

      // Log response timing in development
      if (process.env.NODE_ENV === 'development') {
        logger.debug('API Response', {
          method: response.config.method?.toUpperCase(),
          url: new URL(response.config.url || '', response.config.baseURL).toString(),
          status: response.status,
          duration: `${duration}ms`,
          requestId,
          contentLength: response.headers['content-length']
        });
      }
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig | undefined;
    
    if (!originalRequest) {
      logger.error('No original request config in error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return Promise.reject(error);
    }

    const requestId = originalRequest.headers?.['X-Request-ID'] as string;
    if (requestId) {
      pendingRequests.delete(requestId);
    }

    // Log error details
    logger.error('API Error', {
      method: originalRequest.method?.toUpperCase(),
      url: originalRequest.url,
      status: error.response?.status,
      message: error.message,
      requestId,
      response: error.response?.data
    });

    // Handle AWS-specific error cases
    if (error.code === 'ECONNABORTED') {
      logger.error('Connection timeout', {
        url: originalRequest.url,
        timeout: originalRequest.timeout
      });
    }

    // Handle rate limiting and token refresh
    if (error.response?.status === 429 && !originalRequest._retry) {
      const retryAfter = error.response.headers['retry-after'];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 1000;
      
      // If retry delay is too long (> 10 seconds), return empty response instead of waiting
      if (delay > 10000) {
        logger.info(`Rate limit retry delay too long (${delay}ms), returning empty response`);
        return Promise.resolve({
          data: { programs: [] },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: originalRequest
        });
      }
      
      logger.info(`Rate limited. Retrying after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      originalRequest._retry = true;
      return axiosInstance(originalRequest);
    } else if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;

      try {
        logger.info('Attempting token refresh');
        const newToken = await getIdToken(true); // Force token refresh
        
        if (newToken) {
          const headers = new AxiosHeaders(originalRequest.headers);
          headers.set('Authorization', `Bearer ${newToken}`);
          originalRequest.headers = headers;
          logger.info('Token refresh successful');
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        logger.error('Token refresh failed', {
          error: refreshError instanceof Error ? refreshError.message : 'Unknown error',
          stack: refreshError instanceof Error ? refreshError.stack : undefined
        });
        
        // Dispatch auth error event
        window.dispatchEvent(new CustomEvent('auth-error', {
          detail: { 
            message: 'Your session has expired. Please sign in again.',
            error: refreshError
          }
        }));
      }
    }

    // Handle other common error cases
    const status = error.response?.status;
    if (status) {
      if (status === 403) {
        window.dispatchEvent(new CustomEvent('auth-error', {
          detail: { message: 'You do not have permission to perform this action.' }
        }));
      } else if (status === 404) {
        logger.warn('Resource not found', {
          url: originalRequest.url,
          method: originalRequest.method,
          params: originalRequest.params
        });
      } else if (status === 429) {
        logger.warn('Rate limit exceeded', {
          url: originalRequest.url,
          method: originalRequest.method,
          headers: error.response?.headers
        });
      } else if (status >= 500) {
        logger.error('Server error', {
          status,
          url: originalRequest.url,
          method: originalRequest.method,
          response: error.response?.data
        });
      }
    }

    return Promise.reject(error);
  }
);

// Add CSRF token to all non-GET requests
axiosInstance.interceptors.request.use(config => {
  if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers = config.headers || {};
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }
  return config;
});

// Add response type validation in development
if (process.env.NODE_ENV === 'development') {
  axiosInstance.interceptors.response.use(
    (response) => {
      // Log any unexpected response formats
      if (!response.data && response.status !== 204) {
        logger.warn('Empty response body', {
          url: response.config.url,
          method: response.config.method,
          status: response.status,
          headers: response.headers
        });
      }

      // Log large response sizes
      const contentLength = parseInt(response.headers['content-length'] || '0', 10);
      if (contentLength > 1024 * 1024) { // 1MB
        logger.warn('Large response detected', {
          url: response.config.url,
          method: response.config.method,
          size: `${(contentLength / (1024 * 1024)).toFixed(2)}MB`
        });
      }

      return response;
    }
  );
}

export default axiosInstance;
