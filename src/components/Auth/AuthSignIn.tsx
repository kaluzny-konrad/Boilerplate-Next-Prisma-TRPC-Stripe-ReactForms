import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AuthLogInGoogle from "./AuthLogInGoogle";

export default function AuthSignIn() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Use your Google account to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <AuthLogInGoogle />
        </div>
      </CardContent>
    </Card>
  );
}
