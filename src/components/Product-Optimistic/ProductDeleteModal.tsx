"use client";

import { Photo, Product } from "@prisma/client";
import { toast } from "sonner";
import { Loader2Icon, TrashIcon } from "lucide-react";

import { useProductsOptimisticState } from "@/hooks/use-products-optimistic-state";
import { trpc } from "@/server/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useRef } from "react";

type Props = {
  productId: string;
  disabled?: boolean;
};

export default function ProductDeleteModal({ productId, disabled }: Props) {
  const { onProductDelete } = useProductsOptimisticState();

  const {
    mutate: deleteProduct,
    error,
    isLoading,
  } = trpc.product.deleteProduct.useMutation({
    onSuccess: (product) => {
      onProductDelete(product as Product & { Photos: Photo[] });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const onButtonClick = () => {
    deleteProduct({
      productId,
    });
  };

  const closeDialogButtonRef = useRef<HTMLButtonElement>(null);

  if (error) {
    toast.error("Error adding product, try again later");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"destructive"}
          size={"icon"}
          className="h-8 w-8 lg:h-6 lg:w-6"
          disabled={disabled}
        >
          <TrashIcon className="h-6 w-6 lg:h-4 lg:w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete review</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button
            onClick={onButtonClick}
            disabled={disabled}
            variant={"destructive"}
          >
            Delete review
          </Button>
          <DialogClose asChild ref={closeDialogButtonRef}>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
