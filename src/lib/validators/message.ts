import { z } from "zod";

export const SendMessageValidator = z.object({
  chatId: z.string(),
  message: z.string(),
});
