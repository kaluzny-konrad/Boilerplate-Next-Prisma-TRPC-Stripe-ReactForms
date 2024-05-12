import { db } from "@/db";
import { formatPrice } from "@/lib/utils";

type Props = {
  productId: string;
};

export default async function ProductInfo({ productId }: Props) {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  return (
    <div>
      <p>Product name: {product?.name}</p>
      {product?.price && <p>Product price: {formatPrice(product?.price)}</p>}
    </div>
  );
}
