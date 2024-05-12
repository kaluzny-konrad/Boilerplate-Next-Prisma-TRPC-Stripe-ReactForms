import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { PhotoDeleteValidator } from "@/lib/validators/photo";
import { utapi } from "./uploadthing";

export const photoRouter = router({
  deletePhoto: privateProcedure
    .input(PhotoDeleteValidator)
    .mutation(async ({ input, ctx }) => {
      const { id, key } = input;
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

      const isPhotoDeleted = await utapi.deleteFiles(key);

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
