import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { db } from "@/db";
import {
  ChatCreateValidator,
  GetChatValidator,
  GetMessagesValidator,
} from "@/lib/validators/chat";
import { TRPCError } from "@trpc/server";

export const chatRouter = router({
  getChats: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return db.chat.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
  }),

  createChat: privateProcedure
    .input(ChatCreateValidator)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const { name } = input;

      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      console.log("Creating chat", name);

      return db.chat.create({
        data: {
          name: name,
          userId: user.id,
        },
      });
    }),

  getChat: privateProcedure.input(GetChatValidator).query(async ({ input }) => {
    return db.chat.findFirst({
      where: {
        id: input.id,
      },
    });
  }),

  getMessages: privateProcedure
    .input(GetMessagesValidator)
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { cursor, chatId } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;
      const chat = await db.chat.findFirst({
        where: { id: chatId, userId },
      });
      if (!chat) throw new TRPCError({ code: "NOT_FOUND" });
      const messages = await db.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "desc" },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        select: {
          id: true,
          createdAt: true,
          text: true,
          isUserMessage: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      if (nextCursor) {
        return {
          messages: messages,
          nextCursor,
        };
      } else {
        return {
          messages: messages,
        };
      }
    }),
});
