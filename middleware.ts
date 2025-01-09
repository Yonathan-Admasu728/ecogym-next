import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-skip-local-api',
        'Access-Control-Max-Age': '86400',
      },
    });
    return response;
  }

  // Redirect /dashboard to home page
  if (request.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if the request is for the backend API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Create a new URL for the backend
    const pathname = request.nextUrl.pathname;
    const backendUrl = new URL(pathname, 'http://127.0.0.1:8000');
    
    // Add trailing slash if missing
    if (!backendUrl.pathname.endsWith('/')) {
      backendUrl.pathname += '/';
    }
    
    // Copy search params
    backendUrl.search = request.nextUrl.search;
    
    // Log the URL being forwarded to
    console.log('Forwarding request to:', backendUrl.toString());
    
    // Forward the request to the backend
    const response = NextResponse.rewrite(backendUrl, {
      headers: {
        'Host': '127.0.0.1:8000',
        'Origin': 'http://localhost:3001',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
    return response;
  }

  // For non-API routes, just add CORS headers
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export const config = {
  matcher: [
    '/dashboard',
    '/api/:path*'  // Apply middleware to all API routes
  ],
};
