import { db } from "@/db";
import {
  AuthCreateNewAccountValidator,
  AuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcrypt";

export const authRouter = router({
  signUp: publicProcedure
    .input(AuthCreateNewAccountValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const user = await db.user.findFirst({
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (user !== null) {
        throw new TRPCError({ code: "CONFLICT" });
      }

      const saltRounds = 10;

      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      const token = crypto.randomUUID();

      const internalAccount = await db.internalAccount.create({
        data: {
          email,
          password: hash,
          passwordSalt: salt,
          token,
          user: {
            create: {
              email,
              username: email,
            },
          },
        },
      });

      return { success: true, internalAccount };
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;
      const internalAccount = await db.internalAccount.findUnique({
        where: { token: token },
        include: { user: true },
      });

      if (!internalAccount) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await db.user.update({
        where: { id: internalAccount.user.id },
        data: { emailVerified: new Date() },
      });

      return { success: true };
    }),

  signIn: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const internalAccount = await db.internalAccount.findFirst({
        where: {
          email: email,
        },
      });

      if (!internalAccount) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const valid = bcrypt.compareSync(password, internalAccount.password);

      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return { token: internalAccount.token };
    }),
});
