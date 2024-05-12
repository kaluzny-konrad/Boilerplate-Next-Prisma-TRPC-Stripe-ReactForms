import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { stripe } from "../lib/stripe";
import { Prisma } from "@prisma/client";
import {
  ProductCreateValidator,
  ProductEditValidator,
} from "@/lib/validators/product";

export const productRouter = router({
  getProducts: publicProcedure.query(async () => {
    const products = await db.product.findMany({
      include: {
        Photo: true,
      },
    });
    return products;
  }),

  createProduct: privateProcedure
    .input(ProductCreateValidator)
    .mutation(async ({ input, ctx }) => {
      const { name, photoId } = input;
      const { user } = ctx;

      const price = new Prisma.Decimal(input.price);
      const prismaPrice = parseFloat(input.price.replace(",", ".")) * 100;

      const stripeProduct = await stripe.products.create({
        name: name,
        default_price_data: {
          currency: "PLN",
          unit_amount: prismaPrice,
        },
      });

      const product = await db.product.create({
        data: {
          name,
          price,
          priceId: stripeProduct.default_price as string,
          stripeProductId: stripeProduct.id,
          photoId,
        },
      });

      return product;
    }),

  editProduct: privateProcedure
    .input(ProductEditValidator)
    .mutation(async ({ input, ctx }) => {
      const { name, productId } = input;
      const { user } = ctx;

      const newPrice = new Prisma.Decimal(input.price);
      const newPrismaPrice = parseFloat(input.price.replace(",", ".")) * 100;

      console.log("price", newPrice);

      const product = await db.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "product not found",
        });
      }

      const previousStripePrices = await stripe.prices.list({
        product: product.stripeProductId,
      });

      let defaultPrice = previousStripePrices.data.find(
        (price) =>
          price.unit_amount === newPrismaPrice && price.currency === "pln"
      );

      if (!defaultPrice) {
        defaultPrice = await stripe.prices.create({
          currency: "PLN",
          unit_amount: newPrismaPrice,
          product: product.stripeProductId,
        });
      }

      const stripeProduct = await stripe.products.update(
        product.stripeProductId,
        {
          name: name,
          default_price: defaultPrice.id,
        }
      );

      const updatedproduct = await db.product.update({
        where: {
          id: productId,
        },
        data: {
          name,
          price: newPrice,
          priceId: stripeProduct.default_price as string,
          stripeProductId: stripeProduct.id,
        },
      });

      return updatedproduct;
    }),
});
