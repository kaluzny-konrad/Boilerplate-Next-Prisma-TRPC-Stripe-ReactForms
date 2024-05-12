"use client";

import { formatPrice, getDecimalPrice, getPriceSum } from "@/lib/utils";
import { trpc } from "@/server/client";
import { toast } from "sonner";
import PaymentStatus from "./PaymentStatus";
import { Product, OrderStatus } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  orderId: string;
  userEmail: string | null | undefined;
};

export default function OrderInfo({ orderId, userEmail }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  const {
    data: order,
    error,
    isLoading,
  } = trpc.order.getOrder.useQuery({
    orderId,
  });

  if (error) {
    toast.error("Error loading order");
    console.error(error);
  }

  useEffect(() => {
    if (order) {
      const products: Product[] = order.Products.map((product) => {
        return {
          ...product,
          price: product.price,
        };
      });

      setProducts(products);
    }
  }, [order]);

  const orderTotal = getPriceSum(products.map((product) => product.price));

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : order ? (
        <>
          <p>{order.id}</p>
          <ul>
            {products.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
          <p>Total: {formatPrice(orderTotal)}</p>
          <PaymentStatus
            isPaid={order.status === OrderStatus.PAID}
            orderEmail={userEmail || ""}
            orderId={order.id}
          />

          <p className="text-lg mt-5 font-bold">Products in order:</p>
          <ul>
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                {product.name}
              </Link>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
