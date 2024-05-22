import React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { ChatContext } from "./ChatContextProvider";

type Props = {
  isDisabled: boolean;
};

export default function ChatInput({ isDisabled }: Props) {
  const { addMessage, handleInputChange, isLoading, message } =
    React.useContext(ChatContext);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="flex flex-row max-w-3xl gap-3 mx-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:">
        <div className="relative flex items-stretch flex-1 h-full md:flex-col">
          <div className="relative flex flex-col flex-grow w-full p-4">
            <div className="relative">
              <Textarea
                rows={1}
                maxRows={4}
                autoFocus
                placeholder="Enter your question..."
                ref={textareaRef}
                onChange={handleInputChange}
                value={message}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    addMessage(message);
                    textareaRef.current?.focus();
                  }
                }}
                className={cn(
                  "resize-none pr-12 text-base py-3",
                  "scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                )}
              />

              <Button
                disabled={isDisabled || isLoading}
                aria-label="send message"
                className="absolute bottom-1.5 right-[8px]"
                onClick={() => {
                  addMessage(message);
                  textareaRef.current?.focus();
                }}
              >
                <SendIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
