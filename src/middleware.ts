import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
  const session = cookies().get('appwrite-session');

  if (request.nextUrl.pathname.startsWith('/sign-in') && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!session && !request.nextUrl.pathname.startsWith('/sign')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|icons).*)',
};
