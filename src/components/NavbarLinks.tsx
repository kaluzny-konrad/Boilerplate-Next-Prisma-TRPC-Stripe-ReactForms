import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";

type Props = {};

export default function NavbarLinks({}: Props) {
  return (
    <>
      <Link href={"/product/create"} className={buttonVariants({ variant: "ghost" })}>
        Create Product
      </Link>
    </>
  );
}