"use client";

import { useProductsOptimisticState } from "@/hooks/use-products-optimistic-state";
import { useEffect, useState } from "react";
import ProductAddButton from "./ProductAddButton";
import ProductDeleteModal from "./ProductDeleteModal";
import { trpc } from "@/server/client";

export default function ProductsListOptimistic() {
  const [isMounted, setIsMounted] = useState(false);
  const { products, initProductsState } = useProductsOptimisticState();

  const {
    data: initialProducts,
    error,
    isLoading,
  } = trpc.product.getProducts.useQuery();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (initialProducts) {
      initProductsState(initialProducts);
    }
  }, [initialProducts]);

  if (error) {
    return <div>Error loading products</div>;
  }

  if (isLoading || !isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col">
        {products.map((product) => (
          <div
            key={product.product.id}
            className="m-2 flex gap-2 rounded-lg border p-4"
          >
            {product.product.name}
            <ProductDeleteModal
              product={product.product}
              disabled={product.disabled}
            />
          </div>
        ))}
      </div>
      <div>
        <ProductAddButton />
      </div>
    </div>
  );
}
