// import { PrismaClient } from "@prisma/client";
// import { createSeedClient } from "@snaplet/seed";

// const prisma = new PrismaClient();

// const seed = async () => {
//   try {
//     const seed = await createSeedClient();

//     await seed.$resetDatabase();

//     console.log("Database reseted successfully!");
//   } catch (error) {
//     console.error(error);
//   } finally {
//     await prisma.$disconnect();
//     process.exit();
//   }
// };

// seed();
