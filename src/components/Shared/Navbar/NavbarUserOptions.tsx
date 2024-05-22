import { getAuthSession } from "@/lib/auth";
import NavbarLoggedOut from "./NavbarLoggedOut";
import NavbarLoggedIn from "./NavbarLoggedIn";

export default async function NavbarUserOptions() {
  const session = await getAuthSession();

  if (!session?.user) return <NavbarLoggedOut />;

  const user = session?.user;
  const email = user?.email;
  const image = user?.image;

  return (
    <NavbarLoggedIn
      user={{
        email: email,
        image: image,
      }}
    />
  );
}
