import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { getServerAccessToken } from "@/lib/server-token";
import { usersPageMetadata } from "@/config/site-metadata";

export const metadata = usersPageMetadata;

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

async function createUser(formData: FormData) {
  "use server";
  const token = await getServerAccessToken();
  if (!token) return;
  await apiRequest("/users", {
    method: "POST",
    token,
    body: {
      email: String(formData.get("email")),
      name: String(formData.get("name")),
      role: String(formData.get("role") || "user"),
    },
  });
  revalidatePath("/users");
}

async function deleteUser(formData: FormData) {
  "use server";
  const token = await getServerAccessToken();
  if (!token) return;
  await apiRequest(`/users/${String(formData.get("id"))}`, { method: "DELETE", token });
  revalidatePath("/users");
}

export default async function UsersPage() {
  const token = await getServerAccessToken();
  const users = token ? await apiRequest<User[]>("/users", { token }) : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create user</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createUser} className="grid gap-3 md:grid-cols-4">
            <Input name="email" placeholder="email@example.com" required />
            <Input name="name" placeholder="Full name" required />
            <Input name="role" placeholder="user | editor | admin" />
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded border p-3 text-sm">
              <div>
                <p className="font-medium">{user.name}</p>
                <p>{user.email}</p>
              </div>
              <form action={deleteUser}>
                <input type="hidden" name="id" value={user.id} />
                <Button variant="outline" size="sm" type="submit">
                  Delete
                </Button>
              </form>
            </div>
          ))}
          {users.length === 0 ? <p className="text-sm text-muted-foreground">No users yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
