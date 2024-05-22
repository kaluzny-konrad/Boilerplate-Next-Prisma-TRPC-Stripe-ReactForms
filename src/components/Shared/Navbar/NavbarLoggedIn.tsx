"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/Shared/UserAvatar";
import { signOut } from "next-auth/react";
import Link from "next/link";

type Props = {
  user: {
    email: string | null | undefined;
    image: string | null | undefined;
  };
};

export default function NavbarLoggedIn({ user }: Props) {
  return (
    <DropdownMenu data-testid="user-account-nav">
      <DropdownMenuTrigger className="flex items-center gap-2">
        <UserAvatar
          user={{
            name: user.email || null,
            image: user.image || null,
          }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event: any) => {
            event.preventDefault();
            signOut({ callbackUrl: `${window.location.origin}` });
          }}
          className="cursor-pointer"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
