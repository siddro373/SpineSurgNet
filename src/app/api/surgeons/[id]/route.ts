import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateSurgeonSchema } from "@/lib/validators";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const surgeon = await prisma.surgeon.findUnique({
      where: { id },
      include: {
        conferences: {
          include: { conference: true },
        },
        user: {
          select: { email: true, createdAt: true },
        },
      },
    });

    if (!surgeon) {
      return NextResponse.json({ error: "Surgeon not found" }, { status: 404 });
    }

    return NextResponse.json(surgeon);
  } catch (error) {
    console.error("Error fetching surgeon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  if ((session.user as any).surgeonId !== id && (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = updateSurgeonSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const surgeon = await prisma.surgeon.update({
      where: { id },
      data: parsed.data,
      include: {
        conferences: {
          include: { conference: true },
        },
      },
    });

    return NextResponse.json(surgeon);
  } catch (error) {
    console.error("Error updating surgeon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
