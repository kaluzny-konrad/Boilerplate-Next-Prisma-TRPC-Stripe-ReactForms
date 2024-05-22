import { trpc } from "@/server/client";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Photo } from "@prisma/client";
import { Loader2Icon } from "lucide-react";

type Props = {
  Photo: Photo;
  onPhotoDeleted: () => void;
};

export default function PhotoDeleteButton({ Photo, onPhotoDeleted }: Props) {
  const { mutate: deletePhoto, isLoading } = trpc.photo.deletePhoto.useMutation(
    {
      onSuccess: () => {
        onPhotoDeleted();
      },
      onError: (err) => {
        toast.error(`Something went wrong.`);
      },
    }
  );

  const onDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deletePhoto({
      id: Photo.id,
    });
  };

  return (
    <div>
      <Button
        onClick={onDeleteButtonClick}
        variant={"destructive"}
        disabled={isLoading}
      >
        {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
        Delete image
      </Button>
    </div>
  );
}
