import { Container, Card, Layout } from "~/components";
import { VerifyEmailDocument } from "~/generated";
import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request, context: { graphql } }: LoaderArgs) {
  const searchParams = Object.fromEntries(new URL(request.url).searchParams);
  const result = await graphql(VerifyEmailDocument, searchParams);
  console.log(result);
  return json({
    ...result.data?.verifyEmail?.query,
    message: result.data?.verifyEmail?.success
      ? "Thank you for verifying your email address. You may now close this window."
      : "Incorrect token, please check and try again",
  });
}

export default function Verify() {
  const { message } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <Card className="m-4">
        <Container className="items-center p-4">{message}</Container>
      </Card>
    </Layout>
  );
}
