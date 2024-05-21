"use client";

import { trpc } from "@/server/client";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {};

export default function Chats({}: Props) {
  const { data: chats, isLoading } = trpc.chat.getChats.useQuery();

  return (
    <div className="flex flex-col gap-8 m-4">
      {chats?.map((chat) => (
        <Link
          key={chat.id}
          href={`/chat/${chat.id}`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <h2>{chat.name}</h2>
        </Link>
      ))}
    </div>
  );
}
