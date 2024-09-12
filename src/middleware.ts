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
    
    // Create a custom HTML response
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>brokedash - Coming Soon</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-lightAccent min-h-screen flex flex-col justify-center items-center text-center p-4">
        <h1 class="text-4xl md:text-7xl font-bold mb-4 text-black">
          Sorry, brokedash is currently unavailable in your country
        </h1>
        <p class="text-base md:text-2xl mb-8 text-gray-800">
          But we'll be there soon!
        </p>
        <form id="waitlistForm" class="w-full max-w-md">
          <div class="relative">
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              class="w-full bg-white rounded-xl p-6 border-4 border-black text-center focus:outline-none focus:ring-0 focus:border-black"
              required
            />
          </div>
          <button type="submit" class="mt-4 bg-black border-2 border-black text-white text-xl py-3 px-6 rounded-full transition hover:scale-[1.02] hover:text-black hover:bg-white duration-300 shadow-[0px_4px_10px_rgba(0,0,0,0.5)]">
            Join our waitlist
          </button>
        </form>
        <script>
          document.getElementById('waitlistForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const response = await fetch('/api/waitlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, country: '${country}' })
            });
            if (response.ok) {
              alert('Thank you for joining our waitlist!');
            } else {
              alert('There was an error. Please try again.');
            }
          });
        </script>
      </body>
      </html>
    `;
    
    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  console.log('Access allowed: country is US or IN');
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};