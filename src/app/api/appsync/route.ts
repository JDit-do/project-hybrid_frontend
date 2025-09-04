import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const jwt = await getToken({ req, secureCookie: false });

  const access = (jwt as any)?.access_token;

  if (!access)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.text();
  const r = await fetch(process.env.APP_SYNC_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
    body,
  });
  const hdrs = Object.fromEntries(r.headers.entries());
  const bodyText = await r.text();
  console.log("GW status:", r.status, hdrs, bodyText);

  return new NextResponse(bodyText, {
    status: r.status,
    headers: { "content-type": hdrs["content-type"] ?? "application/json" },
  });
}
