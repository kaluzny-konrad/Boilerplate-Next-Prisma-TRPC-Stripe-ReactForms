"use client";

import { Photo, Product } from "@prisma/client";
import { toast } from "sonner";
import { Loader2Icon, PlusIcon } from "lucide-react";

import { useProductsOptimisticState } from "@/hooks/use-products-optimistic-state";
import { trpc } from "@/server/client";

import { Button } from "@/components/ui/button";

export default function ProductAddButton() {
  const { onProductAdd } = useProductsOptimisticState();

  const {
    mutate: createProduct,
    error,
    isLoading,
  } = trpc.product.createProduct.useMutation({
    onSuccess: (product) => {
      onProductAdd(product as Product & { Photos: Photo[] });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const onButtonClick = () => {
    createProduct({
      name: crypto.randomUUID(),
      price: "10",
    });
  };

  if (error) {
    toast.error("Error adding product, try again later");
  }

  return (
    <Button
      onClick={onButtonClick}
      variant={"default"}
      size={"icon"}
      className="h-8 w-8 lg:h-6 lg:w-6"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2Icon className="h-6 w-6 animate-spin lg:h-4 lg:w-4" />
      ) : (
        <PlusIcon className="h-6 w-6 lg:h-4 lg:w-4" />
      )}
    </Button>
  );
}
