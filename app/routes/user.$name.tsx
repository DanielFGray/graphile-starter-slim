import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Container, FormErrors, Layout, PostList, Stringify, UserContent } from "~/components";
import { UserProfileDocument } from "~/generated";

export async function loader({ params, context: { graphql } }: LoaderArgs) {
  const { data } = await graphql(UserProfileDocument, { username: params.name! });
  return json(data, { status: data?.userByUsername ? 200 : 404 });
}

export default function PostPage() {
  const { userByUsername } = useLoaderData<typeof loader>()!;
  if (!userByUsername)
    return (
      <Layout>
        <Card className="mx-4">
          <FormErrors errors="user not found" />
        </Card>
      </Layout>
    );
  const { posts, ...user } = userByUsername;
  return (
    <Layout>
      <Card className="mx-4">
        <Container>
          <div className="flex flex-row gap-4 justify-between font-medium">
            <div className="flex flex-row gap-4 items-center">
              {user.avatarUrl && <img src={user.avatarUrl} className="rounded-full max-w-[4em]" />}
              <div>
                <div className="text-4xl font-extrabold tracking-tight">
                  {user.username}
                  {!user.isVerified && (
                    <span className="rounded-md ml-2 bg-red-300 px-1 py-0.5 text-sm font-bold text-red-900">
                      unverified
                    </span>
                  )}
                  {user.role === "ADMIN" && (
                    <span className="rounded-md ml-2 bg-green-300 px-1 py-0.5 text-sm font-bold text-green-900">
                      {user.role.toLowerCase()}
                    </span>
                  )}
                </div>
                <div className="text-lg">{user.name}</div>
              </div>
            </div>
            <div className="text-sm">
              first joined: {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
          {user.bio && <UserContent text={user.bio} />}
        </Container>
      </Card>
      <PostList posts={posts.nodes} />
    </Layout>
  );
}
