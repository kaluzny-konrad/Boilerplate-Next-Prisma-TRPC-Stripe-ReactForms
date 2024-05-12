import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";

export default function NavbarLoggedOut() {
  return (
    <Link href="/sign-in" className={buttonVariants()}>
      Sign In
    </Link>
  );
}
