import { Container, Card, Layout } from "~/components";
import { VerifyEmailDocument } from "~/generated";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request, context: { graphql } }: LoaderFunctionArgs) {
  const searchParams = Object.fromEntries(new URL(request.url).searchParams);
  const result = await graphql(VerifyEmailDocument, searchParams);
  return json({
    errors: result.errors,
    data: {
      ...result.data?.verifyEmail?.query,
      message: result.data?.verifyEmail?.success
        ? "Thank you for verifying your email address. You may now close this window."
        : "Incorrect token, please check and try again",
    }
  });
}

export default function Verify() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <Card className="m-4">
        <Container className="items-center p-4">{data.message}</Container>
      </Card>
    </Layout>
  );
}
