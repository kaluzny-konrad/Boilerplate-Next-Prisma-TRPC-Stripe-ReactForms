import { db } from "@/db";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

type Props = {
  productId: string;
};

export default async function ProductInfo({ productId }: Props) {
  if (!productId) {
    return false;
  }

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      Photo: true,
    },
  });

  return (
    <div>
      <p>Product name: {product?.name}</p>
      {product?.price && <p>Product price: {formatPrice(product?.price)}</p>}
      {product?.photoId && (
        <Image
          src={`${product?.Photo?.url}`}
          alt={product.name}
          width={400}
          height={400}
          className="h-auto w-auto"
        />
      )}
    </div>
  );
}
