import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { homePageMetadata } from "@/config/site-metadata";

export const metadata = homePageMetadata;

export default function HomePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unified workspace</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>Portal API: users/posts CRUD on NestJS.</p>
        <p>Messenger: Matrix client integrated into Next.js interface.</p>
        <p>Auth: OIDC through Keycloak with shared access tokens.</p>
      </CardContent>
    </Card>
  );
}
