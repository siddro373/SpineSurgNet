import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const specialty = searchParams.get("specialty") || "";
  const state = searchParams.get("state") || "";
  const conference = searchParams.get("conference") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const where: any = {};

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" as const } },
      { lastName: { contains: search, mode: "insensitive" as const } },
      { npiNumber: { contains: search } },
    ];
  }

  if (specialty) {
    where.specialty = specialty;
  }

  if (state) {
    where.state = state;
  }

  if (conference) {
    where.conferences = {
      some: { conference: { name: conference } },
    };
  }

  try {
    const [surgeons, total] = await Promise.all([
      prisma.surgeon.findMany({
        where,
        include: {
          conferences: {
            include: { conference: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.surgeon.count({ where }),
    ]);

    return NextResponse.json({
      data: surgeons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching surgeons:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
