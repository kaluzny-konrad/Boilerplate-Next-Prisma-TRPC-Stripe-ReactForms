import { TRPCError, initTRPC } from "@trpc/server";
import { db } from "@/db";
import superjson from 'superjson';
import { auth, currentUser } from "@clerk/nextjs/server";

const t = initTRPC.create(
  {
    transformer: superjson,
  }
);

const middleware = t.middleware;

const isAuthorized = middleware(async (opts) => {
  const user = await currentUser()

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    console.error("Authorized User not found in database");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthorized);
