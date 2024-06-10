import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";

import { db } from "@/db";
import { openai } from "@/lib/openai";
import { SendMessageValidator } from "@/lib/validators/message";

export const POST = async (req: NextRequest) => {
  // endpoint for asking a question to chat
  const body = await req.json();

  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  
  const { id: userId } = user;

  const { chatId, message } = SendMessageValidator.parse(body);

  const chat = await db.chat.findFirst({ where: { id: chatId, userId } });
  if (!chat) return new Response("Not found", { status: 404 });

  const createdMessage = await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      chatId,
    },
  });

  const embeddings = new OpenAIEmbeddings();

  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    take: 6,
  });

  const formattedPrevMessages = prevMessages.map((message) => ({
    role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: message.text,
  }));

  const userContent = `Answer the users question in markdown format. 
            
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  USER INPUT: ${message}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Answer the users question in markdown format.",
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          chatId,
          userId,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};
