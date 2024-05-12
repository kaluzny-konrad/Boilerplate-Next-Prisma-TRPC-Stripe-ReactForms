"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { Photo } from "@prisma/client";
import { toast } from "sonner";
import { ClientUploadedFileData } from "uploadthing/types";

type Props = {
  onClientUploadComplete: (photo: Photo) => void;
  onBeforeUploadBegin: () => void;
};

export default function UploadPhotoZone({
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
