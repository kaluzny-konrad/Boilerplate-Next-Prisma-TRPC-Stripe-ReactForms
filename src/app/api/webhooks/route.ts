import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";

export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // handle the event
  if (evt.type === "user.created") {
    const email =
      evt.data.email_addresses.find(
        (e) => e.id === evt.data.primary_email_address_id
      )?.email_address ?? evt.data.email_addresses[0].email_address;

    let name = `${evt.data.first_name} ${evt.data.last_name}`;
    if (!name.trim()) {
      name = email.split("@")[0];
    }

    let username = evt.data.username;
    if (!username) {
      username = email.split("@")[0];
    }

    const user = await db.user.create({
      data: {
        id: evt.data.id,
        email: email,
        emailVerified: new Date(evt.data.created_at),
        name: name,
        image: evt.data.image_url,
        username: username,
      },
    });
  } else if (evt.type === "user.updated") {
    const email =
      evt.data.email_addresses.find(
        (e) => e.id === evt.data.primary_email_address_id
      )?.email_address ?? evt.data.email_addresses[0].email_address;

    let name = `${evt.data.first_name} ${evt.data.last_name}`;
    if (!name.trim()) {
      name = email.split("@")[0];
    }

    let username = evt.data.username;
    if (!username) {
      username = email.split("@")[0];
    }

    const user = await db.user.update({
      where: {
        id: evt.data.id,
      },
      data: {
        email: email,
        emailVerified: new Date(evt.data.updated_at),
        name: name,
        image: evt.data.image_url,
        username: username,
      },
    });
  } else if (evt.type === "user.deleted") {
    const user = await db.user.delete({
      where: {
        id: evt.data.id,
      },
    });
  }

  return new Response("", { status: 200 });
}
