import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";

const conferenceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fullName: z.string().min(1, "Full name is required"),
  description: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const conferences = await prisma.conference.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { surgeons: true } },
      },
    });
    return NextResponse.json(conferences);
  } catch (error) {
    console.error("Error fetching conferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = conferenceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const existing = await prisma.conference.findUnique({
      where: { name: parsed.data.name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A conference with this name already exists" },
        { status: 409 }
      );
    }

    const conference = await prisma.conference.create({
      data: {
        name: parsed.data.name,
        fullName: parsed.data.fullName,
        description: parsed.data.description || null,
        website: parsed.data.website || null,
      },
    });

    return NextResponse.json(conference, { status: 201 });
  } catch (error) {
    console.error("Error creating conference:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Conference ID is required" }, { status: 400 });
    }

    await prisma.conference.delete({ where: { id } });

    return NextResponse.json({ message: "Conference deleted" });
  } catch (error) {
    console.error("Error deleting conference:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
