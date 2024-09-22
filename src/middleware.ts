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

  // Set a cookie with the country information
  const response = NextResponse.next();
  response.cookies.set('user_country', country, { 
    httpOnly: false, 
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 1 day
  });

  // Redirect non-US users to the waitlist page
  if (country !== 'US' && !request.nextUrl.pathname.startsWith('/waitlist')) {
    console.log('Redirecting to waitlist: country is not US');
    return NextResponse.redirect(new URL('/waitlist', request.url));
  }

  console.log('Access allowed');
  return response;
}

export const config = {
  matcher: '/:path*',
};