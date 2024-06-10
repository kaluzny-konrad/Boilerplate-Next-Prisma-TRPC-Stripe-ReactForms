import { toast } from "sonner";
import { Photo } from "@prisma/client";
import { Loader2Icon, TrashIcon } from "lucide-react";

import { trpc } from "@/server/client";

import { Button } from "@/components/ui/button";

type Props = {
  Photo: Photo;
  onPhotoDeleted: () => void;
};

export default function PhotoDeleteButton({ Photo, onPhotoDeleted }: Props) {
  const {
    mutate: deletePhoto,
    error,
    isLoading,
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
      id: Photo.id,
    });
  };

  if (error) {
    toast.error("Error deleting photo, try again later");
    console.error(error);
  }

  return (
    <Button
      onClick={onDeleteButtonClick}
      variant={"destructive"}
      size={"icon"}
      className="button-default-size m-2"
      disabled={isLoading}
      data-test="photo-delete-button"
    >
      {isLoading ? (
        <Loader2Icon className="button-default-icon-size animate-spin" />
      ) : (
        <TrashIcon className="button-default-icon-size" />
      )}
    </Button>
  );
}
