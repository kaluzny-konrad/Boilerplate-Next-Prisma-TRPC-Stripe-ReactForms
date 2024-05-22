"use client";

import { trpc } from "@/server/client";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

type Props = {};

export default function Chats({}: Props) {
  const { data: chats, isLoading } = trpc.chat.getChats.useQuery();

  return (
    <div
      className={cn(
        "flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto",
        "scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      )}
    >
      {isLoading ? (
        <div className="flex flex-col w-full gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <>
          {chats?.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <h2>{chat.name}</h2>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
