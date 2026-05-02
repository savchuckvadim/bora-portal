"use client";

import { FormEvent, useMemo, useState } from "react";
import * as sdk from "matrix-js-sdk";
import { appConfig } from "@/lib/config";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type RoomSummary = { roomId: string; name: string };

export function MessengerClient({
  initialToken,
  initialUserId,
}: {
  initialToken: string;
  initialUserId: string;
}) {
  const [accessToken, setAccessToken] = useState(initialToken);
  const [userId, setUserId] = useState(initialUserId);
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const client = useMemo(() => {
    if (!accessToken || !userId) return null;
    return sdk.createClient({
      baseUrl: appConfig.matrixBaseUrl,
      accessToken,
      userId,
    });
  }, [accessToken, userId]);

  const connect = async () => {
    if (!client) return;
    await client.startClient({ initialSyncLimit: 20 });
    const currentRooms = client.getRooms().map((room) => ({
      roomId: room.roomId,
      name: room.name || room.roomId,
    }));
    setRooms(currentRooms);
    if (currentRooms[0]) setSelectedRoomId(currentRooms[0].roomId);
  };

  const openRoom = async (roomId: string) => {
    if (!client) return;
    const timeline = client.getRoom(roomId)?.timeline ?? [];
    setMessages(
      timeline
        .map((event) => event.getContent()?.body)
        .filter((body): body is string => typeof body === "string"),
    );
    setSelectedRoomId(roomId);
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client || !selectedRoomId || !message) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Matrix SDK event map typing
    await client.sendEvent(selectedRoomId, "m.room.message" as any, {
      msgtype: "m.text",
      body: message,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    setMessage("");
    await openRoom(selectedRoomId);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[300px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Matrix session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="@user:matrix.local" readOnly />
          <Input
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Matrix access token"
            readOnly
          />
          <Button onClick={connect} className="w-full">
            Connect
          </Button>
          <div className="space-y-2">
            {rooms.map((room) => (
              <button
                type="button"
                key={room.roomId}
                className="w-full rounded border px-2 py-1 text-left text-sm"
                onClick={() => openRoom(room.roomId)}
              >
                {room.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 h-80 space-y-2 overflow-auto rounded border p-3 text-sm">
            {messages.map((item, idx) => (
              <p key={`${item}-${idx}`}>{item}</p>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type message" />
            <Button type="submit">Send</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
