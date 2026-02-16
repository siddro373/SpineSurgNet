import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Check if NPI exists
    const existingNPI = await prisma.surgeon.findUnique({
      where: { npiNumber: data.npiNumber },
    });
    if (existingNPI) {
      return NextResponse.json({ error: "NPI number already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        hashedPassword,
        role: "surgeon",
        surgeon: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            npiNumber: data.npiNumber,
            specialty: data.specialty,
            subSpecialty: data.subSpecialty || null,
            boardCertified: data.boardCertified || false,
            fellowshipTrained: data.fellowshipTrained || false,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode || null,
            practiceName: data.practiceName || null,
            phone: data.phone || null,
            onboardingComplete: true,
            conferences: data.conferences?.length
              ? {
                  create: data.conferences.map((c: any) => ({
                    conferenceId: c.conferenceId,
                    role: c.role || null,
                  })),
                }
              : undefined,
          },
        },
      },
      include: { surgeon: true },
    });

    return NextResponse.json(
      { message: "Registration successful", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
