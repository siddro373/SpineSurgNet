import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const conferences = await prisma.conference.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(conferences);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
