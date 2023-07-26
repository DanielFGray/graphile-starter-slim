import { useState } from "react";
import { json, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { Layout, Card, Legend, Container, Input, FormErrors, Button } from "~/components";
import { CreatePostDocument, LatestPostsDocument } from "~/generated";
import { Post } from "./post";
import { fromGraphQL } from "~/middleware";

export async function loader({ context: { graphql } }: LoaderArgs) {
  const { data } = await graphql(LatestPostsDocument);
  return json(data);
}

export default function Index() {
  const [showForm, setShowForm] = useState(false);
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  console.log(navigation);
  return (
    <Layout>
      {data?.currentUser && showForm ? (
        <Form method="post" className="max-w-2xl mx-auto">
          <Card as="fieldset">
            <Legend>new post</Legend>
            <Container>
              <Input placeholder="title" type="text" name="title" required />
              <Input placeholder="body" type="textarea" name="body" required />
              <div className="flex flex-row gap-4 [&>*]:grow">
                <Button variant="primary" type="submit">
                  send
                </Button>
                <Button type="reset">cancel</Button>
              </div>
            </Container>
            <FormErrors />
          </Card>
        </Form>
      ) : data?.currentUser ? (
        <div className="text-center">
          <Button
            variant="primary"
            className="text-2xl font-bold px-4"
            disabled={navigation.state !== "idle"}
            onClick={() => setShowForm(true)}
          >
            create post
          </Button>
        </div>
      ) : null}
      <div className="flex flex-row flex-wrap gap-4 shrink-0">
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
