import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const middleware = async () => {
  const session = await getAuthSession();
  const user = session?.user;

  if (!user || !user.id) throw new Error("Unauthorized");

  return { userId: user.id };
};

const onImageUploadComplete = async ({
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
    const uploadedFile = await db.image.create({
      data: {
        key: file.key,
        url: file.url,
      },
    });

    return { fileId: uploadedFile.id };
  } catch (error) {
    console.error(error);
  }
};

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onImageUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
