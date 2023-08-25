import { ActionArgs, json, type LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import {
  Button,
  Card,
  Container,
  FormErrors,
  Layout,
  PostList,
  Stringify,
  UserContent,
  Editor,
  Input,
} from "~/components";
import { UpdateUserDocument, User, UserProfileDocument, UserProfileQuery } from "~/generated";

export async function loader({ params, context: { graphql } }: LoaderArgs) {
  const { data } = await graphql(UserProfileDocument, { username: params.name! });
  return json(data, { status: data?.userByUsername ? 200 : 404 });
}

export default function UserProfile() {
  const data = useLoaderData<typeof loader>()!;
  if (!data.userByUsername)
    return (
      <Layout>
        <Card className="mx-4">
          <FormErrors errors="user not found" />
        </Card>
      </Layout>
    );
  const { posts, ...user } = data.userByUsername;
  return (
    <Layout>
      <Card className="mx-4 md:mx-auto max-w-2xl">
        <Container>
          <div className="flex flex-row gap-4 justify-between dark:text-primary-300">
            <div className="flex flex-row gap-4 items-center">
              {user.avatarUrl && <img src={user.avatarUrl} className="rounded-full max-w-[4em]" />}
              <div>
                <div className="font-extrabold tracking-tight">
                  <span className="text-4xl">{user.username}</span>
                  {user.role === "ADMIN" && (
                    <span className="rounded-md ml-2 bg-green-300 px-1 py-0.5 text-sm font-bold text-green-900">
                      {user.role.toLowerCase()}
                    </span>
                  )}
                  {!user.isVerified && (
                    <span className="rounded-md ml-2 bg-red-300 px-1 py-0.5 text-sm font-bold text-red-900">
                      unverified
                    </span>
                  )}
                </div>
                <div className="text-lg">{user.name}</div>
              </div>
            </div>
            <div className="text-sm text-light text-primary-300">
              {"first joined: "}
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
          {data.currentUser?.username === user.username ? (
            <ProfileEditor {...data.currentUser} bio={user.bio} />
          ) : (
            <UserContent text={user.bio} />
          )}
        </Container>
      </Card>
      <PostList posts={posts.nodes} />
    </Layout>
  );
}

function ProfileEditor({
  id,
  bio,
}: Pick<NonNullable<UserProfileQuery["userByUsername"]>, "bio"> & UserProfileQuery["currentUser"]) {
  const [newBio, setNewBio] = useState(bio);
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const showProfileEditor = params.get("showProfileEditor");
  return ! Boolean(Number(showProfileEditor)) ? (
    <UserContent editable text={bio} onClick={() => setParams({ showProfileEditor: "1" })} />
  ) : (
    <Form action={location.pathname} method="post">
      <Editor onChange={setNewBio} name="bio" defaultValue={bio} />
      <div className="flex flex-row mt-2 gap-2">
        <Button
          type="submit"
          name="type"
          value="updateProfile"
          variant="primary"
          onClick={() => setParams({ showProfileEditor: "0" })}
        >
          Save
        </Button>
        <Button type="reset" onClick={() => setParams({ showProfileEditor: "0" })}>
          Cancel
        </Button>
        <input type="hidden" name="bio" value={newBio} />
        <input type="hidden" name="id" value={id} />
      </div>
    </Form>
  );
}

export async function action({ request, context: { graphql } }: ActionArgs) {
  const { type, ...formdata } = Object.fromEntries(await request.formData());
  console.log({ type, ...formdata });
  try {
    switch (type) {
      case "updateProfile": {
        const { id, ...patch } = formdata;
        const result = await graphql(UpdateUserDocument, { id, patch });
        return json(result);
      }
      default: {
        throw new Error(`unknown settings action type: ${type}`);
      }
    }
  } catch (e) {
    console.error(e);
    if ("message" in e) return json({ errors: e.message });
  }
  return json({ errors: "unknown error" });
  console.log(formdata);
  return null;
}
