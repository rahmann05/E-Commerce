import prisma from "../src/backend/prisma/client";
import { hashPassword, isPasswordHashed } from "../src/backend/auth/password";

async function main() {
  const users = await prisma.user.findMany({
    where: {
      password: {
        not: null,
      },
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  let migrated = 0;
  for (const user of users) {
    if (!user.password || isPasswordHashed(user.password)) {
      continue;
    }

    const hashedPassword = await hashPassword(user.password);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    migrated += 1;
    console.log(`Migrated password hash for ${user.email}`);
  }

  console.log(`Password backfill completed. Migrated users: ${migrated}`);
}

main()
  .catch((error) => {
    console.error("Password backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
