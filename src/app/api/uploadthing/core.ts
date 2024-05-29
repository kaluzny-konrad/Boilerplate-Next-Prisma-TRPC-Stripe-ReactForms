import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const middleware = async () => {
  console.log("middleware");
  const { userId } = auth();
  console.log("user", userId);

  if (!userId) throw new Error("Unauthorized");

  return { userId };
};

const onPhotoUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  try {
    const uploadedFile = await db.photo.create({
      data: {
        key: file.key,
        url: file.url,
      },
    });

    return { uploadedFile };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const ourFileRouter = {
  photoUploader: f({ image: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onPhotoUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
