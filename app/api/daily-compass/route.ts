import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../../utils/auth';
import { logger } from '../../utils/logger';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function handleError(error: unknown) {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.detail || error.message;
    
    logger.error('Daily Compass API error:', {
      status,
      message,
      error: {
        config: error.config,
        response: error.response?.data,
        message: error.message,
        stack: error.stack
      }
    });

    return NextResponse.json(
      { error: message },
      { status }
    );
  }

  logger.error('Unexpected error in Daily Compass API:', error);
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const token = await getAuthToken();
    const pathSegment = request.nextUrl.pathname.split('/daily-compass/')[1] || '';
    const apiEndpoint = pathSegment.endsWith('/') ? pathSegment : `${pathSegment}/`;

    logger.debug('Daily Compass API request:', {
      method: 'GET',
      endpoint: apiEndpoint,
      hasToken: !!token,
      url: `${BACKEND_URL}/api/daily-compass/${apiEndpoint}`,
      headers: {
        Authorization: token ? 'Bearer [REDACTED]' : undefined,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': '127.0.0.1:8000',
        'Origin': 'http://localhost:3001'
      }
    });

    const response = await axios.get(`${BACKEND_URL}/api/daily-compass/${apiEndpoint}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': '127.0.0.1:8000',
        'Origin': 'http://localhost:3001'
      },
      proxy: false,
      family: 4 // Force IPv4
    });

    logger.debug('Daily Compass API response:', {
      endpoint: apiEndpoint,
      status: response.status,
      data: response.data,
      headers: response.headers
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('Daily Compass API error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        },
        stack: error.stack
      });
    } else {
      logger.error('Unexpected error:', error);
    }
    return handleError(error);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = await getAuthToken();
    const pathSegment = request.nextUrl.pathname.split('/daily-compass/')[1] || '';
    const body = await request.json();
    const apiEndpoint = pathSegment.endsWith('/') ? pathSegment : `${pathSegment}/`;

    logger.debug('Daily Compass API request:', {
      method: 'POST',
      endpoint: apiEndpoint,
      hasToken: !!token,
      bodyKeys: Object.keys(body),
      url: `${BACKEND_URL}/api/daily-compass/${apiEndpoint}`,
      headers: {
        Authorization: token ? 'Bearer [REDACTED]' : undefined,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': '127.0.0.1:8000',
        'Origin': 'http://localhost:3001'
      }
    });

    const response = await axios.post(
      `${BACKEND_URL}/api/daily-compass/${apiEndpoint}`,
      body,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Host': '127.0.0.1:8000',
          'Origin': 'http://localhost:3001'
        },
        proxy: false,
        family: 4 // Force IPv4
      }
    );

    logger.debug('Daily Compass API response:', {
      endpoint: apiEndpoint,
      status: response.status,
      data: response.data,
      headers: response.headers
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('Daily Compass API error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        },
        stack: error.stack
      });
    } else {
      logger.error('Unexpected error:', error);
    }
    return handleError(error);
  }
}
