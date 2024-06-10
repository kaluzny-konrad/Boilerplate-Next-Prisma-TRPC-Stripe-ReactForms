"use client";

import { toast } from "sonner";
import { OrderStatus } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

import { formatPrice, getPriceSum } from "@/lib/utils";
import { trpc } from "@/server/client";

import OrderPaymentStatus from "@/components/Product/OrderPaymentStatus";

type Props = {
  orderId: string;
  userEmail: string | null | undefined;
};

export default function OrderInfo({ orderId, userEmail }: Props) {
  const {
    data: order,
    error,
    isLoading,
  } = trpc.order.getOrder.useQuery({
    orderId,
  });

  if (error) {
    toast.error("Error loading order");
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
          <OrderPaymentStatus
            isPaid={order.status === OrderStatus.PAID}
            orderEmail={userEmail || ""}
            orderId={order.id}
          />

          <p className="text-lg mt-5 font-bold">Products in order:</p>
          <ul>
            {order.Products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Image
                  src={product.Photos[0]?.url || ""}
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
