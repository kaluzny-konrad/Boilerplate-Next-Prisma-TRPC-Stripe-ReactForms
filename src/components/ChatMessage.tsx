import { ExtendedMessage } from "@/types/message";
import React, { forwardRef } from "react";
import { Icons } from "./Icons";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
};

const ChatMessage = forwardRef<HTMLDivElement, Props>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex h-6 w-6 aspect-square items-center justify-center rounded-sm",
            {
              "order-2 bg-blue-600": message.isUserMessage,
              "order-1 bg-zinc-800": !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="w-3/4 fill-zinc-200 text-zinc-200 h-3/4" />
          ) : (
            <Icons.logo className="w-3/4 fill-zinc-300 h-3/4" />
          )}
        </div>

        <div
          className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("px-4 py-2 rounded-lg inline-block", {
              "bg-blue-600 text-zinc-50": message.isUserMessage,
              "bg-zinc-200 text-zinc-900": !message.isUserMessage,
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn("prose", {
                  "text-zinc-50": message.isUserMessage,
                })}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id !== "loading" ? (
              <div
                className={cn("text-xs select-none mt-2 w-full text-right", {
                  "text-zinc-500": !message.isUserMessage,
                  "text-blue-300": message.isUserMessage,
                })}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

ChatMessage.displayName = "Message";

export default ChatMessage;
