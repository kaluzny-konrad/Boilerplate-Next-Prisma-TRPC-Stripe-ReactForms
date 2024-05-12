import { privateProcedure, publicProcedure, router } from "./trpc";

export const testRouter = router({
  getTest: publicProcedure.query(async () => {
    return "Test text from trpc server";
  }),
  getPrivateTest: privateProcedure.query(async () => {
    return "Test text from trpc server";
  }),
});
