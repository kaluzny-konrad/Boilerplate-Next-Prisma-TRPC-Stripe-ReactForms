import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { stripe } from "../lib/stripe";
import { Prisma } from "@prisma/client";
import {
  ProductCreateValidator,
  ProductEditValidator,
} from "@/lib/validators/product";
import { z } from "zod";

export const productRouter = router({
  getProducts: publicProcedure.query(async () => {
    const products = await db.product.findMany({
      include: {
        Photos: true,
      },
    });
    return products;
  }),

  getProduct: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { productId } = input;

      const product = await db.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          Photos: true,
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "product not found",
        });
      }

      return product;
    }),

  createProduct: privateProcedure
    .input(ProductCreateValidator)
    .mutation(async ({ input, ctx }) => {
      const { name } = input;
      const { user } = ctx;

      const price = new Prisma.Decimal(input.price);
      const prismaPrice = parseFloat(input.price.replace(",", ".")) * 100;

      const stripeProduct = await stripe.products.create({
        name: name,
        default_price_data: {
          currency: process.env.DEFAULT_CURRENCY ?? "PLN",
          unit_amount: prismaPrice,
        },
      });

      const product = await db.product.create({
        data: {
          name,
          price,
          priceId: stripeProduct.default_price as string,
          stripeProductId: stripeProduct.id,
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

      const defaultCurrency = process.env.DEFAULT_CURRENCY ?? "PLN";
      let existedPriceDefinition = previousStripePrices.data.find(
        (price) =>
          price.unit_amount === newPrismaPrice &&
          price.currency === defaultCurrency.toLowerCase(),
      );

      if (!existedPriceDefinition) {
        existedPriceDefinition = await stripe.prices.create({
          currency: defaultCurrency,
          unit_amount: newPrismaPrice,
          product: product.stripeProductId,
        });
      }

      const stripeProduct = await stripe.products.update(
        product.stripeProductId,
        {
          name: name,
          default_price: existedPriceDefinition.id,
        },
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

  deleteProduct: privateProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { productId } = input;

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

      await db.product.delete({
        where: {
          id: productId,
        },
      });

      await stripe.products.del(product.stripeProductId);

      return product;
    }),
});
