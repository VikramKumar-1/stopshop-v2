import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin') || path.startsWith('/vendor')) {
    const token = request.cookies.get('stopshop_token')?.value;
    
    // Redirect to login if no token
    if (!token) {
      if (path.startsWith('/admin') && path !== '/admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      if (path.startsWith('/vendor') && path !== '/vendor/login' && path !== '/vendor/register') {
        return NextResponse.redirect(new URL('/vendor/login', request.url));
      }
    }
    
    // If token exists, do a basic decode to check role (Note: signature is verified in Node API routes)
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        let base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        if (pad) {
          base64 += new Array(5 - pad).join('=');
        }
        const decodedJson = atob(base64);
        const payload = JSON.parse(decodedJson);
        const role = payload?.role;
        
        // Admin routes protection
        if (path.startsWith('/admin')) {
          if (role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
          }
        }
        
        // Vendor routes protection
        if (path.startsWith('/vendor') && path !== '/vendor/login' && path !== '/vendor/register') {
          if (role !== 'vendor') {
            if (role === 'admin') {
              return NextResponse.redirect(new URL('/admin', request.url));
            }
            return NextResponse.redirect(new URL('/profile', request.url));
          }
        }

        // Redirect logged-in users away from login pages
        if (path === '/vendor/login' || path === '/vendor/register') {
           if (role === 'vendor') return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
           if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
           return NextResponse.redirect(new URL('/profile', request.url));
        }

      } catch(e) {
        // If parsing fails, let it pass through to the API or Client which will handle invalid tokens
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*'],
};
