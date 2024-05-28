"use client";

import { PropsWithChildren, useState } from "react";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/server/client";
import { absoluteUrl } from "@/lib/utils";
import React from "react";
import { RecoilRoot } from "recoil";
import superjson from "superjson";
import { ClerkProvider } from "@clerk/nextjs";

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: absoluteUrl("/api/trpc"),
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <React.StrictMode>
      <ClerkProvider>
        <RecoilRoot>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </trpc.Provider>
        </RecoilRoot>
      </ClerkProvider>
    </React.StrictMode>
  );
}
