"use client";

import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContextProvider";
import { trpc } from "@/server/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { Loader2Icon, MessageSquareIcon } from "lucide-react";
import { useIntersection } from "@mantine/hooks";
import { Skeleton } from "./ui/skeleton";
import ChatMessage from "./ChatMessage";

type Props = {
  chatId: string;
};

export default function ChatMessages({ chatId }: Props) {
  const { isLoading: isAiThinking } = useContext(ChatContext);

  const { data, isLoading, fetchNextPage } =
    trpc.chat.getMessages.useInfiniteQuery(
      {
        chatId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true,
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages) ?? [];

  const loadingMeessage = {
    createdAt: new Date(),
    id: "loading",
    isUserMessage: false,
    text: (
      <span className="flex items-center justify-center h-full">
        <Loader2Icon className="w-4 h-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMeessage] : []),
    ...messages,
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-2">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    );
  }

  if (!combinedMessages || combinedMessages.length === 0) {
    <div className="flex flex-col items-center justify-center flex-1 gap-2">
      <MessageSquareIcon className="w-8 h-8 text-blue-500" />
      <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
      <p className="text-sm text-zinc-500">
        Ask your first question to get started.
      </p>
    </div>;
  }

  return (
    <div>
      {combinedMessages.map((message, i) => {
        const isNextMessageSamePerson =
          combinedMessages[i - 1]?.isUserMessage === message.isUserMessage;

        if (i === combinedMessages.length - 1)
          return (
            <ChatMessage
              ref={ref}
              key={message.id}
              message={message}
              isNextMessageSamePerson={isNextMessageSamePerson}
            />
          );
        else
          return (
            <ChatMessage
              key={message.id}
              message={message}
              isNextMessageSamePerson={isNextMessageSamePerson}
            />
          );
      })}
    </div>
  );
}
