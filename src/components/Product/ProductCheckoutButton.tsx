"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { trpc } from "@/server/client";

import { Button } from "@/components/ui/button";

type Props = {
  productId: string;
};

export default function ProductCheckoutButton({
  productId,
}: Props) {
  const router = useRouter();

  const { mutate: createCheckoutSession } =
    trpc.order.createSession.useMutation({
      onSuccess: ({ url }) => {
        toast.success("Order created");
        if (url) router.push(url);
      },
    });

  function handleProductCheckout() {
    const productIdArray = [productId];
    createCheckoutSession({ productIds: productIdArray });
  }

  return (
    <Button onClick={handleProductCheckout}>
      Buy
    </Button>
  );
}
