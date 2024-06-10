"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { trpc } from "@/server/client";
import { Button } from "@/components/ui/button";
import { ChatCreateRequest, ChatCreateValidator } from "@/lib/validators/chat";

export default function ChatAddForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ChatCreateRequest>({
    resolver: zodResolver(ChatCreateValidator),
    defaultValues: {
      name: "New Chat",
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [key, value] of Object.entries(errors)) {
        toast.error(`Something went wrong: ${value.message}`);
      }
    }
  }, [errors]);

  async function onSubmit(data: ChatCreateRequest) {
    createChat(data);
  }

  const { mutate: createChat } = trpc.chat.createChat.useMutation({
    onSuccess: (res) => {
      router.push(`/chat/${res.id}`);
    },
    onError: (err) => {
      toast.error(`Something went wrong during chat creation.`);
    },
  });

  return (
    <form
      id="chat-add-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Button type="submit">Create chat</Button>
    </form>
  );
}
