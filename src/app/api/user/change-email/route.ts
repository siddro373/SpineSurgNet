import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { changeEmailSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = changeEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { newEmail, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) {
      return NextResponse.json(
        { error: "Password is incorrect" },
        { status: 400 }
      );
    }

    // Check if the new email is already in use
    const existing = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This email address is already in use" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail },
    });

    return NextResponse.json({ message: "Email updated successfully" });
  } catch (error) {
    console.error("Error changing email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
