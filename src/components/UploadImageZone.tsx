"use client";

import { UploadButton } from "@/lib/uploadthing";

type Props = {
  imageUploaded: (args: { imageId: string }) => void;
};

export default function UploadImageZone({ imageUploaded }: Props) {
  return (
    <div className="m-8 border-dashed border-2">
      <UploadButton
      className="w-full p-8"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (typeof res === "undefined") return;
          const fileId = res[0].serverData?.fileId;
          if (typeof fileId === "undefined") return;
          imageUploaded({ imageId: fileId });
        }}
        onUploadError={(error: Error) => {}}
      />
    </div>
  );
}
