import Link from "next/link";
import React from "react";
import { buttonVariants } from "@/components/ui/button";

type Props = {};

export default function NavbarLinks({}: Props) {
  return (
    <>
      <Link
        href={"/product"}
        className={buttonVariants({ variant: "ghost" })}
      >
        Products
      </Link>
      <Link
        href={"/product/create"}
        className={buttonVariants({ variant: "ghost" })}
      >
        Create Product
      </Link>
      <Link
        href={"/chat"}
        className={buttonVariants({ variant: "ghost" })}
      >
        Chat OpenAI
      </Link>
    </>
  );
}
