import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Encode the secret for jose (Edge Runtime compatible)
function getSecret() {
  const secret = process.env.JWT_SECRET || "";
  return new TextEncoder().encode(secret);
}

/**
 * Verify JWT signature + expiry in Edge Runtime using `jose`.
 * Returns the decoded payload or null if invalid/expired/forged.
 */
async function verifyTokenEdge(token: string): Promise<{ userId: number; email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    // Token is invalid, expired, or signature doesn't match
    return null;
  }
}

export async function middleware(request: NextRequest) {
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
    
    // SECURITY: Verify JWT signature + expiry (not just base64 decode)
    if (token) {
      const payload = await verifyTokenEdge(token);

      if (!payload) {
        // Token is forged, expired, or tampered — clear it and redirect
        const response = path.startsWith('/admin')
          ? NextResponse.redirect(new URL('/admin', request.url))
          : NextResponse.redirect(new URL('/vendor/login', request.url));
        response.cookies.delete('stopshop_token');
        return response;
      }

      const role = payload.role;
        
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
         // Allow normal users to access both /vendor/login and /vendor/register 
         // so they can upgrade or switch to a different vendor account
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*'],
};
