import { User } from "@clerk/nextjs/server";

export const getUserEmail = (user: User | null) => {
  if (!user) return null;

  return (
    user.emailAddresses.find((e: any) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0].emailAddress
  );
};
