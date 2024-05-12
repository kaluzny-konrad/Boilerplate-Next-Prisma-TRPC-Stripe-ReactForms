import { z } from "zod";

export const PhotoDeleteValidator = z.object({
    id: z.string().min(1, { message: "Photo id should be provided" }),
    key: z.string().min(1, { message: "Photo key should be provided" }),
});

export type PhotoDeleteRequest = z.infer<typeof PhotoDeleteValidator>;
