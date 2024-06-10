import Link from "next/link";

import NavbarLinks from "./NavbarLinks";

import WrapperMaxWidth from "@/components/Shared/WrapperMaxWidth";
import NavbarUserOptions from "@/components/Shared/Navbar/NavbarUserOptions";

export default function Navbar() {
  return (
    <div className="sticky inset-x-0 top-0 z-50 h-16 bg-white">
      <header className="relative bg-white">
        <WrapperMaxWidth>
          <div className="flex justify-between p-4">
            <Link href="/" className="flex items-center">
              <p className="font-extralight text-3xl">LOGO</p>
            </Link>
            <div className="hidden lg:block">
              <NavbarLinks />
            </div>
            <div className="flex items-center">
              <NavbarUserOptions />
            </div>
          </div>
        </WrapperMaxWidth>
      </header>
    </div>
  );
}
