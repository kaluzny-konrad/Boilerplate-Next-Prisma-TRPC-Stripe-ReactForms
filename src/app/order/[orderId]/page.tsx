import OrderInfo from "@/components/OrderInfo";
import { getAuthSession } from "@/lib/auth";

type Props = {
  params: {
    orderId: string;
  };
};

export default async function OrderPage({ params }: Props) {
  const { orderId } = params;
  const session = await getAuthSession();

  return (
    <div>
      <h1>Order</h1>
      <OrderInfo orderId={orderId} userEmail={session?.user?.email} />
    </div>
  );
}
