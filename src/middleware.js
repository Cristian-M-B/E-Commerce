import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export default async function middleware(request) {
    const token = request.cookies.get('E-Commerce_token');

    if (request.nextUrl.pathname.includes('/profile')) {
        if (token === undefined) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_JWT))
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (request.nextUrl.pathname.includes('/userData')) {
        if (token === undefined) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_JWT))
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (request.nextUrl.pathname.includes('/shippingData')) {
        if (token === undefined) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_JWT))
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (request.nextUrl.pathname.includes('/shoppingHistory')) {
        if (token === undefined) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_JWT))
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (request.nextUrl.pathname.includes('/admin')) {
        if (token === undefined) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_JWT))
            if (payload.isAdmin === 'false') {
                return NextResponse.redirect(new URL('/', request.url))
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }
}
