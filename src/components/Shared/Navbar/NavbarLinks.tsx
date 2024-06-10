import Link from "next/link";
import React from "react";

import { checkRole } from "@/utils/roles";

import { buttonVariants } from "@/components/ui/button";

type Props = {};

export default function NavbarLinks({}: Props) {
  const isAdmin = checkRole("admin");

  return (
    <>
      <Link href={"/product"} className={buttonVariants({ variant: "ghost" })}>
        Products
      </Link>
      {isAdmin && (
        <Link
          href={"/product/create"}
          className={buttonVariants({ variant: "ghost" })}
        >
          Create Product
        </Link>
      )}

      <Link href={"/chat"} className={buttonVariants({ variant: "ghost" })}>
        Chat OpenAI
      </Link>
    </>
  );
}
