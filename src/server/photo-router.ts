import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import {
  PhotoAddToProductValidator,
  PhotoDeleteValidator,
} from "@/lib/validators/photo";
import { utapi } from "./uploadthing";

export const photoRouter = router({
  addPhotoToProduct: privateProcedure
    .input(PhotoAddToProductValidator)
    .mutation(async ({ input }) => {
      const { productId, photoId } = input;

      const photo = await db.photo.update({
        where: {
          id: photoId,
        },
        data: {
          isMainPhoto: true,
          Products: {
            connect: {
              id: productId,
            },
          },
        },
      });

      return photo;
    }),

  deletePhoto: privateProcedure
    .input(PhotoDeleteValidator)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const { user } = ctx;

      const photo = await db.photo.findFirst({
        where: {
          id,
        },
      });

      if (!photo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Photo not found",
        });
      }

      const isPhotoDeleted = await utapi.deleteFiles(photo.key);

      if (!isPhotoDeleted) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete photo",
        });
      }

      await db.photo.delete({
        where: {
          id,
        },
      });

      return {
        success: true,
      };
    }),
});
