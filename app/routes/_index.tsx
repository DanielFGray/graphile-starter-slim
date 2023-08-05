import { useState } from "react";
import { json, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { Layout, Card, Legend, Container, Input, FormErrors, Button } from "~/components";
import { CreatePostDocument, LatestPostsDocument } from "~/generated";
import { Post } from "./post";

export async function loader({ context: { graphql } }: LoaderArgs) {
  const { data } = await graphql(LatestPostsDocument);
  return json(data);
}

export default function Index() {
  const [params] = useSearchParams();
  const [showForm, setShowForm] = useState<boolean>(Boolean(params.get("showForm") ?? false));
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  return (
    <Layout>
      {data?.currentUser && showForm ? (
        <Form method="post" className="mx-auto max-w-2xl" onReset={() => setShowForm(false)}>
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
      ) : data?.currentUser ? (
        <form
          className="text-center"
          onSubmit={ev => {
            ev.preventDefault();
            setShowForm(true);
          }}
        >
          <Button variant="primary" className="px-4 text-2xl font-bold" name="showForm" value="1">
            create post
          </Button>
        </form>
      ) : null}
      <div className="flex shrink-0 flex-row flex-wrap gap-4 p-4">
        {data?.posts?.nodes.map(post => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </Layout>
  );
}

export async function action({ request, context: { graphql } }: ActionArgs) {
  const variables = Object.fromEntries(await request.formData());
  variables.tags = ["test"];
  try {
    const { data, errors } = await graphql(CreatePostDocument, variables);
    if (errors) throw errors[0];
    return json(data);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
