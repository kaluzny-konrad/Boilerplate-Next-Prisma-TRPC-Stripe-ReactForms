import ProductCheckoutButton from "@/components/ProductCheckoutButton";
import ProductInfo from "@/components/ProductInfo";

type Props = {
  params: {
    productId: string;
  };
};

export default function page({ params }: Props) {
  const { productId } = params;

  return (
    <div className="p-4 bg-white rounded-xl min-h-96">
      <h2 className="mb-4 font-bold text-slate-600">Product info</h2>
      <ProductInfo productId={productId} />
      <ProductCheckoutButton productId={productId} />
    </div>
  );
}
