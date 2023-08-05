import { Button, Container, Card, FormRow, Input, Layout, Legend, FormErrors } from "~/components";
import { type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { ForgotPasswordDocument, SharedLayoutDocument } from "~/generated";
import { Form, useActionData, useNavigation } from "@remix-run/react";

export async function loader({ context: { graphql } }: LoaderArgs) {
  const { data } = await graphql(SharedLayoutDocument);
  return data;
}

export default function ForgotPassword() {
  const actionData = useActionData();
  const navigation = useNavigation();
  if (actionData) console.log(actionData);
  return (
    <Layout forbidWhen={auth => auth.LOGGED_IN}>
      {navigation.state !== "idle" ? (
        <Card>
          We&apos;ve sent a link to your email. Please check your email and click the link and
          follow the instructions. If you don&apos;t receive the link, please ensure you entered the
          email address correctly, and check in your spam folder just in case.
        </Card>
      ) : (
        <Form method="post" className="mx-auto p-4 md:max-w-4xl">
          <Card as="fieldset">
            <Legend>forgot password</Legend>
            <Container>
              <FormRow label="email:">
                <Input name="email" type="email" required />
              </FormRow>
              <div>
                <Button type="submit">Reset Password</Button>
              </div>
              <FormErrors />
            </Container>
          </Card>
        </Form>
      )}
    </Layout>
  );
}
export async function action({ request, context: { graphql } }: ActionArgs) {
  const values = Object.fromEntries(await request.formData());
  console.log("received reset request for", values);
  const { data } = await graphql(ForgotPasswordDocument, values);
  console.log(data);
  return data;
}
