import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { OrderStatus } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    const message = `Webhook Error: ${
      err instanceof Error ? err.message : "Unknown Error"
    }`;
    console.error(message);
    return new Response(message, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    return await handleCheckoutSessionCompletedEvent(event);
  }

  return new Response(null, { status: 200 });
}

async function handleCheckoutSessionCompletedEvent(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId) {
    const message = `Webhook - User is not Authorized`;
    console.error(message);
    return new Response(message, { status: 401 });
  }

  if (!session?.metadata?.orderId) {
    const message = `Webhook - Order was not found`;
    console.error(message);
    return new Response(message, { status: 400 });
  }

  const dbUser = await db.user.findFirst({
    where: { id: session?.metadata?.userId },
  });

  if (!dbUser) {
    const message = `Webhook Error: User not found in database`;
    console.error(message);
    return new Response(message, { status: 400 });
  }

  const dbOrder = await db.order.findFirst({
    where: { id: session?.metadata?.orderId },
  });

  if (!dbOrder) {
    const message = `Webhook Error: Order was not found`;
    console.error(message);
    return new Response(message, { status: 400 });
  }

  try {
    await db.order.update({
      where: { id: dbOrder.id },
      data: {
        status: OrderStatus.PAID,
      },
    });
  } catch (err) {
    const message = `Webhook Error: ${
      err instanceof Error ? err.message : "Unknown Error"
    }`;
    console.error(message);
    return new Response(message, { status: 400 });
  }

  return new Response(null, { status: 200 });
}
