import { SignIn } from "@clerk/nextjs";

export default function AuthSignIn() {
  return (
    <div className="mx-auto max-w-sm">
      <SignIn />
    </div>
  );
}
