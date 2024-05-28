import { SignUp } from "@clerk/nextjs";

export default function AuthSignUp() {
  return (
    <div className="mx-auto max-w-sm">
      <SignUp />
    </div>
  );
}
