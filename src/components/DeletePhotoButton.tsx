import { trpc } from "@/server/client";
import React from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Photo } from "@prisma/client";

type Props = {
  Photo: Photo;
  onPhotoDeleted: () => void;
};

export default function DeletePhotoButton({ Photo, onPhotoDeleted }: Props) {
  const {
    mutate: deletePhoto,
    isLoading,
    isError,
    isSuccess,
  } = trpc.photo.deletePhoto.useMutation({
    onSuccess: () => {
      onPhotoDeleted();
    },
    onError: (err) => {
      toast.error(`Something went wrong.`);
    },
  });

  const onDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deletePhoto({
      photoId: Photo.id,
      photoKey: Photo.key,
    });
  };

  return (
    <div>
      <Button onClick={onDeleteButtonClick}>Delete image</Button>
    </div>
  );
}
