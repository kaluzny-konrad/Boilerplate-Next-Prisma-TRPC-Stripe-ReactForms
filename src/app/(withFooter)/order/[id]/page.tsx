import { currentUser } from "@clerk/nextjs/server";

import { getUserEmail } from "@/utils/session-emails";

import OrderInfo from "@/components/Product/OrderInfo";

type Props = {
  params: {
    id: string; // remember: same name like [id] folder
  };
};

export default async function OrderPage({ params }: Props) {
  const { id } = params;
  const user = await currentUser();

  return (
    <div>
      <h1>Order</h1>
      <OrderInfo orderId={id} userEmail={getUserEmail(user)} />
    </div>
  );
}
