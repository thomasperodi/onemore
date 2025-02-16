import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretkey');

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/auth')) {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        const dashboardPath = payload.role === 'admin' ? '/admin/dashboard' : '/pr/dashboard';
        return NextResponse.redirect(new URL(dashboardPath, req.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/pr/dashboard', req.url));
    }
    if (pathname.startsWith('/pr') && payload.role !== 'pr') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/pr/:path*', '/auth/:path*']
};
