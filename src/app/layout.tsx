import { Inter } from "next/font/google";
import "./globals.css";
import WrapperProviders from "@/components/Shared/WrapperProviders";
import { cn, constructMetadata } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

      <html lang="en" className="h-full">
        <body
          className={cn("font-sans antialiased bg-gray-100", inter.className)}
        >
          <WrapperProviders>{children}</WrapperProviders>
        </body>
      </html>
  );
}
