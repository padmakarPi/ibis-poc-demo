import { NextRequest, NextResponse } from "next/server";

export default function AppMiddleware(req: NextRequest) {
	// for skip public route
	if (
		req.nextUrl.pathname.startsWith("/auth") ||
		req.nextUrl.pathname === "/"
	) {
		console.log("skiped", req.nextUrl.pathname);
		return NextResponse.next();
	}
	const { cookies } = req;
	const cookieVal = cookies.get("isAuthenticated")?.value;
	const isAuthenticated = cookieVal === "true";
	console.log("checked", req.nextUrl.pathname);
	if (!isAuthenticated) {
		return NextResponse.redirect(new URL("/", req.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.*).*)"],
};
