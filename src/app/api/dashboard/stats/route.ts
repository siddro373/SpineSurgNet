import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const surgeonId = session.user.surgeonId;

  try {
    const totalConferences = await prisma.conference.count();

    if (!surgeonId) {
      return NextResponse.json({
        totalConferences,
        inSpecialty: 0,
        inState: 0,
        myConferencesCount: 0,
      });
    }

    const surgeon = await prisma.surgeon.findUnique({
      where: { id: surgeonId },
      select: { specialty: true, state: true },
    });

    if (!surgeon) {
      return NextResponse.json({
        totalConferences,
        inSpecialty: 0,
        inState: 0,
        myConferencesCount: 0,
      });
    }

    const [inSpecialty, inState, myConferencesCount] = await Promise.all([
      prisma.surgeon.count({ where: { specialty: surgeon.specialty } }),
      prisma.surgeon.count({ where: { state: surgeon.state } }),
      prisma.surgeonConference.count({ where: { surgeonId } }),
    ]);

    return NextResponse.json({
      totalConferences,
      inSpecialty,
      inState,
      myConferencesCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
