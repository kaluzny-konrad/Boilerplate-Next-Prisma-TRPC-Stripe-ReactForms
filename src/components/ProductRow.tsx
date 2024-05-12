import Link from "next/link";
import Image from "next/image";
import { Photo, Product } from "@prisma/client";
import { BoxIcon } from "lucide-react";

type Props = {
  product: Product;
  photo: Photo | null;
};

export default function ProductRow({ product, photo }: Props) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="flex flex-col rounded-lg gap-8 items-center"
    >
      {photo ? (
        <Image
          src={photo.url}
          alt={product.name}
          width={600}
          height={400}
          priority
          className="rounded-xl"
        />
      ) : (
        <div className="h-24 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
          <BoxIcon size={40} />
        </div>
      )}

      <p>{product.name}</p>
    </Link>
  );
}
