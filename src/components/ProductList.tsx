"use client";

import { trpc } from "@/server/client";
import { Skeleton } from "./ui/skeleton";
import ProductRow from "./ProductRow";

export default function ProductList() {
  const {
    data: products,
    isLoading,
    error,
  } = trpc.product.getProducts.useQuery();

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-full h-24 mt-4 rounded-lg" />
        <Skeleton className="w-full h-24 mt-4 rounded-lg" />
        <Skeleton className="w-full h-24 mt-4 rounded-lg" />
      </>
    );
  }

  if (error) {
    return <div>Failed to load products</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {products?.map((product) => (
        <ProductRow key={product.id} product={product} photo={product.Photo} />
      ))}
    </div>
  );
}
