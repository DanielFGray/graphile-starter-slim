import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FormErrors, Layout, Post } from "~/components";
import { PostByIdDocument } from "~/generated";

export async function loader({ params, context: { graphql } }: LoaderFunctionArgs) {
  const result = await graphql(PostByIdDocument, { id: Number(params.id!) });
  return json(result, { status: result.data?.post ? 200 : 404 });
}

export default function PostPage() {
  const { data } = useLoaderData<typeof loader>()!;
  return (
    <Layout>
      <div className="m-4">
        {data?.post ? <Post {...data.post} /> : <FormErrors errors={"post not found"} />}
      </div>
    </Layout>
  );
}
