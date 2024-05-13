"use client";

import { db } from "@/db";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/server/client";
import Image from "next/image";
import { useEffect } from "react";

type Props = {
  productId: string;
};

export default function ProductInfo({ productId }: Props) {
  if (!productId) {
    return false;
  }

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = trpc.product.getProduct.useQuery({ productId });

  // try refech photo one time if was not loaded
  useEffect(() => {
    if (product?.Photos && product.Photos.length === 0) {
      const timeoutId = setTimeout(() => {
        refetch();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [refetch]);

  return (
    <div>
      <p>Product name: {product?.name}</p>
      {product?.price && <p>Product price: {formatPrice(product?.price)}</p>}
      {product?.Photos[0] && (
        <Image
          key={product?.Photos[0]?.url}
          src={`${product?.Photos[0]?.url}`}
          alt={product.name}
          width={400}
          height={400}
          className="h-auto w-auto"
          priority
        />
      )}
    </div>
  );
}
