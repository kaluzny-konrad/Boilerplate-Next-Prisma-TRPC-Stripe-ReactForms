"use client";

import { Photo } from "@prisma/client";
import { toast } from "sonner";

import { UploadDropzone } from "@/lib/uploadthing";

type Props = {
  onClientUploadCompleted: (photo: Photo) => void;
  onBeforeUploadBegined: () => void;
};

export default function PhotoUploadZone({
  onClientUploadCompleted,
  onBeforeUploadBegined,
}: Props) {
  return (
    <UploadDropzone
      className="ut-label:hidden"
      endpoint="photoUploader"
      config={{
        mode: 'auto'
      }}
      onBeforeUploadBegin={(files: File[]) => {
        onBeforeUploadBegined();
        return files;
      }}
      onClientUploadComplete={(res: any) => {
        if (typeof res === "undefined") return;
        const photo = res[0].serverData?.uploadedFile as Photo;
        if (typeof photo === "undefined") return;
        onClientUploadCompleted(photo);
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
    />
  );
}
