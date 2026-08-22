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

const SUSPICIOUS_PATTERNS = [
  /<script/gi,
  /javascript:/gi,
  /UNION\s+SELECT/gi,
  /DROP\s+TABLE/gi,
  /EXEC\s*\(/gi,
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const urlString = decodeURIComponent(request.url);

  const baseUrl = request.nextUrl.origin;
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'Unknown IP';

  // SEO-friendly checkout URL rewrite: /checkout/product-slug-12345 → /checkout?productId=12345
  if (path.startsWith('/checkout/') && path !== '/checkout/success' && path !== '/checkout/failure') {
    const slug = path.replace('/checkout/', '');
    const lastDash = slug.lastIndexOf('-');
    if (lastDash !== -1) {
      const idStr = slug.substring(lastDash + 1);
      const productId = parseInt(idStr);
      if (!isNaN(productId) && productId > 0) {
        const rewriteUrl = new URL('/checkout', request.url);
        rewriteUrl.searchParams.set('productId', String(productId));
        // Preserve qty param if present
        const qty = request.nextUrl.searchParams.get('qty');
        if (qty) rewriteUrl.searchParams.set('qty', qty);
        return NextResponse.rewrite(rewriteUrl);
      }
    }
  }



  // 2. WAF: Check for malicious payloads in URL (XSS / SQLi)
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(urlString)) {
      
      // Fire and forget teleport log (will trigger auto-ban in telemetry API)
      fetch(`${baseUrl}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'MALICIOUS_PAYLOAD',
          level: 'CRITICAL',
          message: `Malicious WAF Payload Detected: ${pattern.toString()}`,
          details: { ip, url: request.url, pattern: pattern.toString() }
        })
      }).catch(() => {});
      
      return NextResponse.json({ error: 'Blocked by Web Application Firewall (WAF)' }, { status: 403 });
    }
  }
  
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
        
      // Vendor routes protection (Allow both vendor and admin to access vendor dashboard)
      if (path.startsWith('/vendor') && path !== '/vendor/login' && path !== '/vendor/register') {
        if (role !== 'vendor' && role !== 'admin') {
          return NextResponse.redirect(new URL('/profile', request.url));
        }
      }

      // Redirect logged-in vendor/admin away from login page to dashboard
      if (path === '/vendor/login') {
        if (role === 'vendor' || role === 'admin') {
          return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
        }
      }
    }
  }

  const response = NextResponse.next();
  // Pass full URL path + query to layout for dynamic canonical tag
  const fullPath = request.nextUrl.pathname + (request.nextUrl.search || "");
  response.headers.set("x-current-path", fullPath);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/telemetry (to avoid infinite loops)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/telemetry|_next/static|_next/image|favicon.ico).*)',
  ],
};
