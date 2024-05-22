import ProductCheckoutButton from "@/components/Product/ProductCheckoutButton";
import ProductInfo from "@/components/Product/ProductInfo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string; // remember: same name like [id] folder
  };
};

export default function ProductIdPage({ params }: Props) {
  const { id } = params;

  if (!id) {
    return notFound();
  }

  return (
    <div className="p-4 bg-white rounded-xl min-h-96">
      <h2 className="mb-4 font-bold text-slate-600">Product info</h2>
      <ProductInfo productId={id} />
      <div className="flex gap-4 m-4">
        <ProductCheckoutButton productId={id} />
        <Link
          href={`/product/${id}/edit`}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Edit product
        </Link>
      </div>
    </div>
  );
}
