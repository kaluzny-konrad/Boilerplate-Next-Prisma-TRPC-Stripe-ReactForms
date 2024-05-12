import Image from "next/image";
import { User } from "@prisma/client";
import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { UserIcon } from "lucide-react";

interface Props extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

export default function UserAvatar({ user, ...props }: Props) {
  return (
    <Avatar {...props} data-testid="user-avatar">
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <UserIcon className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
