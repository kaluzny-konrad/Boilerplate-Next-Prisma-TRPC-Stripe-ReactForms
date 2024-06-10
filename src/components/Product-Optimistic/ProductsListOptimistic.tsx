"use client";

import { useProductsOptimisticState } from "@/hooks/use-products-optimistic-state";
import { useEffect, useState } from "react";
import ProductAddButton from "./ProductAddButton";
import ProductDeleteModal from "./ProductDeleteModal";

export default function ProductsListOptimistic() {
  const { products } = useProductsOptimisticState();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div>
      {isMounted ? (
        <div>
          <div className="flex flex-col">
            {products.map((product) => (
              <div
                key={product.product.id}
                className="m-2 flex gap-2 rounded-lg border p-4"
              >
                {product.product.name}
                <ProductDeleteModal
                  productId={product.product.id}
                  disabled={product.disabled}
                />
              </div>
            ))}
          </div>
          <div>
            <ProductAddButton />
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
