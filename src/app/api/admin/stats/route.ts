import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalSurgeons, newThisWeek, newThisMonth, surgeons, conferenceData] =
      await Promise.all([
        prisma.surgeon.count(),
        prisma.surgeon.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.surgeon.count({ where: { createdAt: { gte: monthAgo } } }),
        prisma.surgeon.findMany({
          select: { specialty: true, state: true },
        }),
        prisma.surgeonConference.findMany({
          include: { conference: true },
        }),
      ]);

    // Aggregate by specialty
    const specialtyMap = new Map<string, number>();
    surgeons.forEach((s) => {
      specialtyMap.set(s.specialty, (specialtyMap.get(s.specialty) || 0) + 1);
    });
    const bySpecialty = Array.from(specialtyMap.entries())
      .map(([specialty, count]) => ({ specialty, count }))
      .sort((a, b) => b.count - a.count);

    // Aggregate by state
    const stateMap = new Map<string, number>();
    surgeons.forEach((s) => {
      stateMap.set(s.state, (stateMap.get(s.state) || 0) + 1);
    });
    const byState = Array.from(stateMap.entries())
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);

    // Aggregate by conference
    const confMap = new Map<string, number>();
    conferenceData.forEach((sc) => {
      confMap.set(sc.conference.name, (confMap.get(sc.conference.name) || 0) + 1);
    });
    const byConference = Array.from(confMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      totalSurgeons,
      newThisWeek,
      newThisMonth,
      bySpecialty,
      byState,
      byConference,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
