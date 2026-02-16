import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CONFERENCES = [
  { name: "NASS", fullName: "North American Spine Society", description: "The leading multidisciplinary medical organization dedicated to the advancement of spine care." },
  { name: "CNS", fullName: "Congress of Neurological Surgeons", description: "Professional association of neurosurgeons focused on education and scientific discovery." },
  { name: "AANS", fullName: "American Association of Neurological Surgeons", description: "Scientific and educational association for neurosurgeons worldwide." },
  { name: "Eurospine", fullName: "Spine Society of Europe", description: "European spine society promoting research, prevention and treatment of spine diseases." },
  { name: "SRS", fullName: "Scoliosis Research Society", description: "International organization dedicated to the education, research and treatment of spinal deformity." },
  { name: "CSRS", fullName: "Cervical Spine Research Society", description: "Society devoted to the study and advancement of knowledge of the cervical spine." },
  { name: "IMAST", fullName: "International Meeting on Advanced Spine Techniques", description: "Annual meeting focused on cutting-edge spine surgery techniques." },
  { name: "SMISS", fullName: "Society for Minimally Invasive Spine Surgery", description: "Organization dedicated to advancing minimally invasive spine surgery." },
];

async function main() {
  console.log("Seeding database...");

  // Seed conferences
  for (const conf of CONFERENCES) {
    await prisma.conference.upsert({
      where: { name: conf.name },
      update: { fullName: conf.fullName, description: conf.description },
      create: conf,
    });
  }
  console.log(`Seeded ${CONFERENCES.length} conferences`);

  // Create admin user
  const adminEmail = "admin@spinesurgnet.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        hashedPassword,
        role: "admin",
      },
    });
    console.log("Created admin user: admin@spinesurgnet.com / admin123");
  } else {
    console.log("Admin user already exists");
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
