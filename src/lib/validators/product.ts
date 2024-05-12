import { z } from "zod";

export const ProductCreateValidator = z.object({
  name: z
    .string()
    .min(3, { message: "Title must be minimum 3 characters long" })
    .max(128, { message: "Title must be at least 128 characters" }),
  price: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Price must be a number",
    })
    .refine((val) => parseInt(val, 10) > 0, {
      message: "Price must be greater than 0",
    }),
  imageId: z.string().optional(),
});

export const ProductEditValidator = z.object({
  productId: z.string().min(1, { message: "Product id should be provided" }),
  name: z
    .string()
    .min(3, { message: "Title must be minimum 3 characters long" })
    .max(128, { message: "Title must be at least 128 characters" }),
  price: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Price must be a number",
    })
    .refine((val) => parseInt(val, 10) > 0, {
      message: "Price must be greater than 0",
    }),
  imageId: z.string().optional(),
});

export type ProductCreateRequest = z.infer<typeof ProductCreateValidator>;
export type ProductEditRequest = z.infer<typeof ProductEditValidator>;
