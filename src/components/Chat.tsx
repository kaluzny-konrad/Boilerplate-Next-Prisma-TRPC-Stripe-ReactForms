"use client";

import { trpc } from "@/server/client";
import { ChatContextProvider } from "./ChatContextProvider";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { Loader2Icon } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  id: string;
};

export default function Chat({ id }: Props) {
  const { data: chat, isLoading } = trpc.chat.getChat.useQuery({ id });

  if (isLoading) {
    return (
      <div className="relative flex flex-col justify-between min-h-full gap-2 pt-24 divide-y bg-zinc-50 divide-zinc-200">
        <div className="flex flex-col items-center justify-center flex-1 mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
            <h3 className="text-xl font-semibold">Loading...</h3>
            <p className="text-sm text-zinc-500">
              We&apos;re preparing your chat.
            </p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );
  }

  if (!chat) {
    return notFound();
  }

  return (
    <ChatContextProvider chatId={id}>
      <div className="relative flex flex-col justify-between min-h-full gap-2 pt-24 divide-y bg-zinc-50 divide-zinc-200 m-4">
        <div className="flex flex-col justify-between flex-1 mb-28">
          <ChatMessages chatId={id} />
        </div>
        <ChatInput isDisabled={false} />
      </div>
    </ChatContextProvider>
  );
}
