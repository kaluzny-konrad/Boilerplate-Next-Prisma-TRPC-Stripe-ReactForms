import ProductEditForm from "@/components/Product/ProductEditForm";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: {
    id: string; // remember: same name like [id] folder
  };
};

export default function ProductCreatePage({ params }: Props) {
  const { id } = params;

  return (
    <div>
      <Link
        href={`/product/${id}`}
        className={buttonVariants({ variant: "ghost" })}
      >
        Back to course
      </Link>
      <ProductEditForm productId={id} />
    </div>
  );
}
