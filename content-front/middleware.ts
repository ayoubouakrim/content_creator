import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/signin"];
const ROOT_ROUTE = "/";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    
    // Get token from cookies (cookies are available in middleware)
    const token = req.cookies.get("auth_token")?.value;

    const isPublic = PUBLIC_ROUTES.some(route => pathname === route);
    const isRoot = pathname === ROOT_ROUTE;

    // Not logged in + trying to access a protected route
    if (!token && !isPublic && !isRoot) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Already logged in + trying to access auth pages (not root)
    if (token && isPublic) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:png|jpg|jpeg|svg|webp|ico)).*)",
    ],
};