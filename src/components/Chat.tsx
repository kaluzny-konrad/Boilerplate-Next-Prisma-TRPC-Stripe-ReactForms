"use client";

import { trpc } from "@/server/client";
import { ChatContextProvider } from "./ChatContextProvider";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

type Props = {
  id: string;
};

export default function Chat({ id }: Props) {
  const { data: chat, isLoading } = trpc.chat.getChat.useQuery({ id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!chat) {
    return <div>Chat not found</div>;
  }

  return (
    <ChatContextProvider chatId={id}>
      <div className="relative flex flex-col justify-between min-h-full gap-2 pt-24 divide-y bg-zinc-50 divide-zinc-200">
        <div className="flex flex-col justify-between flex-1 mb-28">
          <ChatMessages chatId={id} />
        </div>
        <ChatInput isDisabled={false} />
      </div>
    </ChatContextProvider>
  );
}
