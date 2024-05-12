import OrderInfo from "@/components/OrderInfo";
import { getAuthSession } from "@/lib/auth";

type Props = {
  params: {
    id: string; // remember: same name like [id] folder
  };
};

export default async function OrderPage({ params }: Props) {
  const { id } = params;
  const session = await getAuthSession();

  return (
    <div>
      <h1>Order</h1>
      <OrderInfo orderId={id} userEmail={session?.user?.email} />
    </div>
  );
}
