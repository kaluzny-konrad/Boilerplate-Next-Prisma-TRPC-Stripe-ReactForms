import { PrismaClient } from "@prisma/client";

import { Products, Photos } from "./data.mjs";

const prisma = new PrismaClient();

const load = async () => {
try {
    

    // await prisma.product.createMany({
    //   data: Products,
    // });

    // await prisma.photo.createMany({
    //   data: Photos,
    // });

    console.log("Data loaded successfully");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

load();
