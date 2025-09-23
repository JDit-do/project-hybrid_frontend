import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "GraphQL API is disabled" },
    { status: 503 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "GraphQL API is disabled" },
    { status: 503 }
  );
}
