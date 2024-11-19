import { NextRequest, NextResponse } from "next/server";

export default function AppMiddleware(req: NextRequest) {
	// for skip public route
	if (
		req.nextUrl.pathname.startsWith("/auth") ||
		req.nextUrl.pathname === "/" ||
		req.nextUrl.pathname === "/manifest.json" ||
		req.nextUrl.pathname.includes("_next/static") ||
		req.nextUrl.pathname === "/health/live" ||
		req.nextUrl.pathname === "/health/ready"
	) {
		return NextResponse.next();
	}
	const { cookies } = req;

	const cookieVal = cookies.get("isAuthenticated")?.value;

	const isAuthenticated = cookieVal === "true";
	if (!isAuthenticated) {
		return NextResponse.redirect(
			new URL(`${req.nextUrl.basePath || ""}/`, req.url),
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.*).*)"],
};
