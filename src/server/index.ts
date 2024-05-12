import { router } from "./trpc";
import { testRouter } from "./test-router";
import { orderRouter } from "./order-router";
import { productRouter } from "./product-router";
import { photoRouter } from "./photo-router";

export const appRouter = router({
  test: testRouter,
  product: productRouter,
  order: orderRouter,
  photo: photoRouter,
});

export type AppRouter = typeof appRouter;
