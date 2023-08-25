import { json, type ActionArgs, type LoaderArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { Layout, Card, Legend, Container, Input, FormErrors, Button, PostList } from "~/components";
import { CreatePostDocument, LatestPostsDocument } from "~/generated";

export async function loader({ context: { graphql } }: LoaderArgs) {
  const { data } = await graphql(LatestPostsDocument);
  return json(data);
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  return (
    <Layout>
      {!data?.currentUser ? null : (
        <Form method="post" className="mx-auto max-w-3xl px-4">
          <Card as="fieldset">
            <Legend>new post</Legend>
            <Container>
              <Input placeholder="title" type="text" name="title" required />
              <Input placeholder="body" type="textarea" name="body" required />
              <div className="flex flex-row gap-4 [&>*]:grow">
                <Button variant="primary" disabled={navigation.state !== "idle"} type="submit">
                  send
                </Button>
                <Button type="reset">cancel</Button>
              </div>
            </Container>
            <FormErrors />
          </Card>
        </Form>
      )}
      <PostList posts={data?.posts?.nodes} />
    </Layout>
  );
}

export async function action({ request, context: { graphql } }: ActionArgs) {
  const variables = Object.fromEntries(await request.formData());
  variables.tags = ["test"];
  const { data, errors } = await graphql(CreatePostDocument, variables);
  if (errors) throw errors[0];
  return redirect(`/post/${data?.createPost?.post?.id}`);
}
