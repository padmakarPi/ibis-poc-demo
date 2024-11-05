import { NextRequest, NextResponse } from "next/server";

export default function AppMiddleware(req: NextRequest) {
	// for skip public route
	if (
		req.nextUrl.pathname.startsWith("/auth") ||
		req.nextUrl.pathname === "/" ||
		req.nextUrl.pathname === "/manifest.json" ||
		req.nextUrl.pathname.includes("_next/static")
	) {
		return NextResponse.next();
	}
	const { cookies } = req;

	const cookieVal = cookies.get("isAuthenticated")?.value;

	const isAuthenticated = cookieVal === "true";
	if (!isAuthenticated) {
		console.log("appliction not run");
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.*).*)"],
};
