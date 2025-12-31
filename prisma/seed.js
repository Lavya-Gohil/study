const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")

const prisma = new PrismaClient()

const users = [
  {
    name: "Super Admin",
    email: "superadmin@local.test",
    password: "SuperAdmin123!",
    role: "SUPER_ADMIN",
    subscriptionStatus: "premium",
  },
  {
    name: "Moderator",
    email: "moderator@local.test",
    password: "Moderator123!",
    role: "MODERATOR",
    subscriptionStatus: "premium",
  },
  {
    name: "Normal User",
    email: "user@local.test",
    password: "User123!",
    role: "USER",
    subscriptionStatus: "free",
  },
]

async function seed() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10)

    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashedPassword,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
      },
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
      },
    })

    await prisma.streak.upsert({
      where: { userId: dbUser.id },
      update: {},
      create: { userId: dbUser.id },
    })
  }
}

seed()
  .catch((error) => {
    console.error("Seed error:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
