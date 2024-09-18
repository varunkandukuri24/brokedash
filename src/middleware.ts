import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'Unknown';
  const hostname = request.headers.get('host') || '';

  console.log('Middleware running. Hostname:', hostname, 'Country:', country);

  // Always allow access from localhost
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    console.log('Access allowed: localhost');
    return NextResponse.next();
  }

  // Allow access only from the US or India
  if (country !== 'US' && country !== 'IN') {
    console.log('Access denied: country not US or IN');
    return new NextResponse('Access denied', { status: 403 });
  }

  // Set a cookie with the country information
  const response = NextResponse.next();
  response.cookies.set('user_country', country, { 
    httpOnly: false, 
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 1 day
  });

  console.log('Access allowed: country is US or IN');
  return response;
}

export const config = {
  matcher: '/:path*',
};