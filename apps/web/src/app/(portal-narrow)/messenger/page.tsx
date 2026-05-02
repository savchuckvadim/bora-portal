import { apiRequest } from "@/lib/api";
import { getServerAccessToken } from "@/lib/server-token";
import { MessengerClient } from "@/components/messenger-client";
import { messengerPageMetadata } from "@/config/site-metadata";

export const metadata = messengerPageMetadata;

type MatrixSession = {
  userId: string;
  accessToken: string;
};

export default async function MessengerPage() {
  const token = await getServerAccessToken();
  const session = token
    ? await apiRequest<MatrixSession>("/matrix/session/me", { method: "POST", token })
    : { userId: "", accessToken: "" };

  return <MessengerClient initialToken={session.accessToken} initialUserId={session.userId} />;
}
