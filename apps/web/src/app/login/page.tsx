import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginPageMetadata } from "@/config/site-metadata";

export const metadata = loginPageMetadata;

export default function LoginPage() {
  return (
    <div className="mx-auto mt-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Sign in with Keycloak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600">
            Unified SSO login for portal API and Matrix access provisioning.
          </p>
          <a href="/api/auth/login">
            <Button className="w-full">Continue</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
