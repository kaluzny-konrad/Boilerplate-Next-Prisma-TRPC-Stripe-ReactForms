"use server";

import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

export const getUser = async () => {
  const user = await currentUser();

  if (!user?.id || !user.primaryEmailAddress?.emailAddress) {
    throw new Error("Invalid user data");
  }

  
  const existingUser = await db.user.findFirst({
    where: { id: user.id },
  });
  
  if (!existingUser) {
    await db.user.create({
      data: {
        id: user.id,
        email: user.primaryEmailAddress.emailAddress,
        image: user.imageUrl,
        name: user.fullName,
        emailVerified: new Date(),
        username: user.username,
      },
    });
  }

  return { userId: user.id };
};
