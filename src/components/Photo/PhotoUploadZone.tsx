"use client";

import { Photo } from "@prisma/client";
import { toast } from "sonner";

import { UploadButton } from "@/lib/uploadthing";

type Props = {
  onClientUploadComplete: (photo: Photo) => void;
  onBeforeUploadBegin: () => void;
};

export default function PhotoUploadZone({
  onClientUploadComplete,
  onBeforeUploadBegin,
}: Props) {
  return (
    <UploadButton
      className="w-full p-8"
      endpoint="photoUploader"
      onBeforeUploadBegin={(files: File[]) => {
        onBeforeUploadBegin();
        return files;
      }}
      onClientUploadComplete={(res: any) => {
        if (typeof res === "undefined") return;
        const photo = res[0].serverData?.uploadedFile as Photo;
        if (typeof photo === "undefined") return;
        onClientUploadComplete(photo);
      }}
      onUploadError={(error: Error) => {
        if (typeof error.message === "string") {
          if (error.message === "Invalid config: FileSizeMismatch") {
            toast.error("File size too large. Please upload a smaller file.");
            return;
          }
        }
        toast.error(`Something went wrong.`);
      }}
    ></UploadButton>
  );
}
