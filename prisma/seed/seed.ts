import { PrismaClient } from "@prisma/client";
import { createSeedClient } from "@snaplet/seed";

const prisma = new PrismaClient();

const seed = async () => {
  try {
    const seed = await createSeedClient({
      models: {
        photo: {
          data: {
            key: (ctx) => "fake-key",
            url: (ctx) =>
              "https://utfs.io/f/1aeaeeeb-37f2-4b4e-989f-ff5bbc6a2ebd-amfegj.jpg",
            isMainPhoto: (ctx) => true,
          },
        },
        product: {
          data: {
            price: (ctx) => 10,
            priceId: (ctx) => "price_1PFrcdF5tzy1eZfnffEWBKys",
            stripeProductId: (ctx) => "prod_Q63krustgB2jRo",
          },
        },
        user: {
          data: {
            role: (ctx) => "USER",
            image: (ctx) => "https://lh3.googleusercontent.com/a/ACg8ocLvtX027xliuLtkdSwaqsbXmvGlFMMLn3gcCREVKsXS_Id8pzuD=s96-c"
          },
        },
        order: {
          data: {
            currency: (ctx) => "PLN",
            total: (ctx) => 10,
          },
        },
      },
    });

    await seed.$resetDatabase();

    await seed.user((x) => x(1));
    await seed.photo((x) => x(3));
    await seed.product((x) => x(3));
    await seed.order((x) => x(1));

    const products = await prisma.product.findMany();
    const photos = await prisma.photo.findMany();
    const users = await prisma.user.findMany();
    const orders = await prisma.order.findMany();

    for (
      let index = 0;
      index < Math.min(photos.length, products.length);
      index++
    ) {
      const product = products[index];
      const photo = photos[index];
      await prisma.product.update({
        where: { id: product.id },
        data: {
          Photos: {
            connect: {
              id: photo.id,
            },
          },
        },
      });
    }

    for (
      let index = 0;
      index < Math.min(users.length, orders.length);
      index++
    ) {
      const user = users[index];
      const order = orders[index];
      await prisma.order.update({
        where: { id: order.id },
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          Products: {
            connect: {
              id: products[index].id,
            },
          },
        },
      });
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
};

seed();
