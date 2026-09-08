import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/set-token
 *
 * Stores the backend JWT in a secure httpOnly cookie so it persists across
 * page refreshes and is not accessible to JavaScript (XSS protection).
 * Called immediately after a successful OTP verification.
 */
export async function POST(req: NextRequest) {
    const { token } = (await req.json()) as { token?: string };

    if (!token || typeof token !== "string") {
        return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });

    // 7-day cookie matching the backend JWT expiry
    res.cookies.set("crosspost_jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });

    return res;
}

/**
 * DELETE /api/set-token
 *
 * Clears the JWT cookie on sign-out.
 */
export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("crosspost_jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });
    return res;
}
