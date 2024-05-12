"use client";

import { formatPrice, getDecimalPrice, getPriceSum } from "@/lib/utils";
import { trpc } from "@/server/client";
import { toast } from "sonner";
import PaymentStatus from "./PaymentStatus";
import { Product, OrderStatus } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

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

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : order ? (
        <>
          <p>{order.id}</p>
          <ul>
            {order.Products.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
          <p>
            Total:{" "}
            {formatPrice(
              getPriceSum(order.Products.map((product) => product.price))
            )}
          </p>
          <PaymentStatus
            isPaid={order.status === OrderStatus.PAID}
            orderEmail={userEmail || ""}
            orderId={order.id}
          />

          <p className="text-lg mt-5 font-bold">Products in order:</p>
          <ul>
            {order.Products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Image
                  src={product.Photo?.url || ""}
                  alt={product.name}
                  width={100}
                  height={100}
                />
                {product.name}
              </Link>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
