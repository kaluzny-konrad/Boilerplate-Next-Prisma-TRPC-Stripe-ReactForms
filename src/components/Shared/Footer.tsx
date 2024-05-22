"use client";

import WrapperMaxWidth from "./WrapperMaxWidth";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex-grow-0 bg-white">
      <WrapperMaxWidth>
        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>

          <div className="flex items-center justify-center mt-4 md:mt-0">
            <div className="flex space-x-8">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </WrapperMaxWidth>
    </footer>
  );
}
