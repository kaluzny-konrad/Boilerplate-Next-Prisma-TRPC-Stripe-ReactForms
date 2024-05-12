import ProductCheckoutButton from "@/components/ProductCheckoutButton";
import ProductInfo from "@/components/ProductInfo";
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
      <ProductCheckoutButton productId={id} />
    </div>
  );
}
