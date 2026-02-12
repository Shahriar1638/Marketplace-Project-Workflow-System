import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    const protectedPrefixes = ['/admin', '/buyer', '/solver', '/home'];
    const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

    if (isProtected) {
        if (!token) {
            const url = new URL('/', req.url);
            url.searchParams.set('callbackUrl', encodeURI(req.url));
            return NextResponse.redirect(url);
        }

        const role = token.role; 
        if (pathname.startsWith('/admin') && role !== 'Admin') {
            return NextResponse.redirect(new URL('/home', req.url));
        }

        if (pathname.startsWith('/buyer') && role !== 'Buyer') {
             return NextResponse.redirect(new URL('/home', req.url));
        }

        if (pathname.startsWith('/solver') && role !== 'Problem Solver') {
             return NextResponse.redirect(new URL('/home', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/buyer/:path*',
        '/solver/:path*',
        '/home/:path*'
    ],
};
