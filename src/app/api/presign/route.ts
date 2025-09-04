import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function decodeJwtNoVerify(jwt: string) {
  const [, payloadB64] = jwt.split(".");
  const json = Buffer.from(
    payloadB64.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString("utf8");
  return JSON.parse(json);
}

export async function POST(req: NextRequest) {
  const jwt = await getToken({ req, secureCookie: false });

  const access = (jwt as any)?.access_token;
  const id = (jwt as any)?.id_token;

  if (!access)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const claims = decodeJwtNoVerify(access);
  console.log("access_token claims >>>", {
    iss: claims.iss,
    aud: claims.aud ?? claims.client_id,
    token_use: claims.token_use,
    exp: claims.exp,
    scope: claims.scope,
    sub: claims.sub,
  });

  const body = await req.text();

  const r = await fetch(process.env.NEXT_PUBLIC_PRESIGN_API!, {
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
