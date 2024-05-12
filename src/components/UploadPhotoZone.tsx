"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { Photo } from "@prisma/client";
import { toast } from "sonner";

type Props = {
  handlePhotoUploaded: (photo: Photo | undefined) => void;
};

export default function UploadPhotoZone({ handlePhotoUploaded }: Props) {
  return (
    <UploadDropzone
      className="w-full p-8"
      endpoint="photoUploader"
      onClientUploadComplete={(res: any) => {
        if (typeof res === "undefined") return;
        const photo = res[0].serverData?.photo;
        if (typeof photo === "undefined") return;
        handlePhotoUploaded(photo);
      }}
      onUploadError={(error: Error) => {
        if (typeof error.message === "string") {
          if ((error.message = "Invalid config: FileSizeMismatch")) {
            toast.error("File size too large. Please upload a smaller file.");
            return;
          }
        }
        toast.error(`Something went wrong.`);
      }}
    >
    </UploadDropzone>
  );
}
