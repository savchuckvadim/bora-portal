import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { getServerAccessToken } from "@/lib/server-token";
import { postsPageMetadata } from "@/config/site-metadata";

export const metadata = postsPageMetadata;

type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

async function createPost(formData: FormData) {
  "use server";
  const token = await getServerAccessToken();
  if (!token) return;
  await apiRequest("/posts", {
    method: "POST",
    token,
    body: {
      authorId: String(formData.get("authorId")),
      title: String(formData.get("title")),
      content: String(formData.get("content")),
      visibility: "public",
    },
  });
  revalidatePath("/posts");
}

async function deletePost(formData: FormData) {
  "use server";
  const token = await getServerAccessToken();
  if (!token) return;
  await apiRequest(`/posts/${String(formData.get("id"))}`, { method: "DELETE", token });
  revalidatePath("/posts");
}

export default async function PostsPage() {
  const token = await getServerAccessToken();
  const posts = token ? await apiRequest<Post[]>("/posts", { token }) : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create post</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPost} className="grid gap-3">
            <Input name="authorId" placeholder="Author UUID" required />
            <Input name="title" placeholder="Post title" required />
            <Input name="content" placeholder="Post text" required />
            <Button type="submit" className="w-fit">
              Create
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="rounded border p-3 text-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium">{post.title}</p>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <Button variant="outline" size="sm" type="submit">
                    Delete
                  </Button>
                </form>
              </div>
              <p>{post.content}</p>
              <p className="mt-1 text-xs text-muted-foreground">Author: {post.authorId}</p>
            </div>
          ))}
          {posts.length === 0 ? <p className="text-sm text-muted-foreground">No posts yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
