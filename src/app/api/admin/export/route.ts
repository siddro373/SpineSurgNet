import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const surgeons = await prisma.surgeon.findMany({
      include: {
        user: { select: { email: true } },
        conferences: {
          include: { conference: true },
        },
      },
      orderBy: { lastName: "asc" },
    });

    // Build CSV
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "NPI Number",
      "Specialty",
      "Sub-Specialty",
      "Board Certified",
      "Fellowship Trained",
      "Practice Name",
      "Hospital Affiliation",
      "City",
      "State",
      "ZIP Code",
      "Phone",
      "Conferences",
      "Registration Date",
    ];

    const rows = surgeons.map((s) => [
      s.firstName,
      s.lastName,
      s.user.email,
      s.npiNumber,
      s.specialty,
      s.subSpecialty || "",
      s.boardCertified ? "Yes" : "No",
      s.fellowshipTrained ? "Yes" : "No",
      s.practiceName || "",
      s.hospitalAffiliation || "",
      s.city,
      s.state,
      s.zipCode || "",
      s.phone || "",
      s.conferences.map((c) => `${c.conference.name} (${c.role || "Member"})`).join("; "),
      new Date(s.createdAt).toISOString().split("T")[0],
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="spinesurgnet-surgeons-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
