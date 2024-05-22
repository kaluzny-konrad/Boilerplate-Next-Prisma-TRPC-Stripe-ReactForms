"use client";

import ChatNewInput from "./ChatNewInput";

export default function ChatNew() {
  return (
    <div className="relative flex flex-col justify-between min-h-full gap-2 pt-24 divide-y bg-zinc-50 divide-zinc-200 m-4">
      <div className="flex flex-col justify-between flex-1 mb-28"></div>
      <ChatNewInput />
    </div>
  );
}
