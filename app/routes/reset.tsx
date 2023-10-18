import { useState } from "react";
import { type LoaderFunctionArgs, type ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { Button, Card, Container, FormErrors, FormRow, Input, Layout, Legend } from "~/components";
import { ResetPasswordDocument, SharedLayoutDocument } from "~/generated";

export async function loader({ context: { graphql } }: LoaderFunctionArgs) {
  const result = await graphql(SharedLayoutDocument);
  return json(result);
}

export default function ResetPage() {
  const [params] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const [errors, setErrors] = useState<null | string>(null);

  const userId = params.get("userId");
  const token = params.get("token");

  return (
    <Layout>
      <div className="mx-auto max-w-4xl">
        {actionData && "message" in actionData ? (
          <Card className="mb-4 bg-red-100">
            <FormErrors errors={actionData.message} />
          </Card>
        ) : null}
        <Form
          method="post"
          onSubmit={ev => {
            const values = Object.fromEntries(new FormData(ev.currentTarget));
            if (values.password !== values.confirmPassword) {
              setErrors("passwords must match");
              return ev.preventDefault();
            }
            setErrors(null);
          }}
        >
          <Card as="fieldset">
            <Legend>Reset password:</Legend>
            <Container>
              <FormRow label="Choose a new passphrase:">
                <Input name="password" type="password" required autoComplete="new-password" />
              </FormRow>
              <FormRow label="Confirm passphrase">
                <Input
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                />
              </FormRow>
              <FormErrors errors={errors} />
              <Button variant="primary">Reset passphrase</Button>
            </Container>
          </Card>
          <Input name="token" type="hidden" value={token} />
          <Input name="userId" type="hidden" value={userId} />
        </Form>
      </div>
    </Layout>
  );
}

export async function action({ request, context: { graphql } }: ActionFunctionArgs) {
  const values = Object.fromEntries(await request.formData());
  const result = await graphql(ResetPasswordDocument, values);
  if (result.errors) {
    console.log(result.errors);
    return json({ message: "An error occurred" });
  }

  if (!result.data?.resetPassword?.success) {
    return json({ message: "Incorrect token, please check and try again" });
  }
  return json({ message: "Your password was reset; you can go and log in now" });
}
