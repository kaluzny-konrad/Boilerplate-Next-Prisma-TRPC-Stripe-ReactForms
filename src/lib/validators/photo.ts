import { z } from "zod";

export const PhotoDeleteValidator = z.object({
  id: z.string().min(1, { message: "Photo id should be provided" }),
});

export const PhotoAddToProductValidator = z.object({
  productId: z.string().min(1, { message: "Product id should be provided" }),
  photoId: z.string().min(1, { message: "Photo id should be provided" }),
});

export type PhotoDeleteRequest = z.infer<typeof PhotoDeleteValidator>;
export type PhotoAddToProductRequest = z.infer<typeof PhotoAddToProductValidator>;