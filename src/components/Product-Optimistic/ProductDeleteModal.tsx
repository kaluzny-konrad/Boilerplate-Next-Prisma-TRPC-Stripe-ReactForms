"use client";

import { Photo, Product } from "@prisma/client";
import { toast } from "sonner";
import { Loader2Icon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

type Props = {
  product: Product & { Photos: Photo[] };
  disabled?: boolean;
};

export default function ProductDeleteModal({ product, disabled }: Props) {
  const { onProductDelete, onProductAdd } = useProductsOptimisticState();
  const [initialProduct, setInitialProduct] = useState(product);

  const {
    mutate: deleteProduct,
    error,
    isLoading,
  } = trpc.product.deleteProduct.useMutation({
    onSuccess: (product) => {},
    onError: (err) => {
      toast.error("Error deleting product, try again later");
      onProductAdd(initialProduct);
    },
  });

  const onButtonClick = () => {
    closeDialogButtonRef.current?.click();
    onProductDelete(initialProduct.id);
    deleteProduct({
      productId: initialProduct.id,
    });
  };

  useEffect(() => {
    if (product) {
      setInitialProduct(product);
    }
  }, [product]);

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
          {isLoading ? (
            <Loader2Icon className="button-default-icon-size animate-spin" />
          ) : (
            <TrashIcon className="button-default-icon-size" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button
            onClick={onButtonClick}
            disabled={disabled}
            variant={"destructive"}
          >
            Delete product
          </Button>
          <DialogClose asChild ref={closeDialogButtonRef}>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
