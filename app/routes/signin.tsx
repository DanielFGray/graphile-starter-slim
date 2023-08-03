import React, { startTransition } from "react";
import { Form, Link, useNavigate, useSearchParams } from "@remix-run/react";
import { SharedLayoutDocument, LoginDocument } from "../generated";
import {
  Layout,
  Card,
  Input,
  FormRow,
  Button,
  FormErrors,
  Container,
  Legend,
  SocialLogin,
} from "../components";
import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";

export async function loader({ context: { graphql } }: LoaderArgs) {
  const { data } = await graphql(SharedLayoutDocument);
  return json(data);
}

export default function Login() {
  const [params] = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? undefined;
  return (
    <Layout forbidWhen={auth => auth.LOGGED_IN}>
      <Form method="post" className="mx-auto max-w-4xl">
        <Card as="fieldset">
          <Legend>log in</Legend>
          <div className="border-b border-primary-300 pb-4">
            <SocialLogin label="log in" redirectTo={redirectTo} />
          </div>
          <Container className="mt-4">
            <FormRow label={<span>username:</span>}>
              <Input type="text" name="username" placeholder="or email" required />
            </FormRow>
            <FormRow label={<span>password:</span>}>
              <Input type="password" name="password" placeholder="********" required />
            </FormRow>
            <div className="flex flex-col gap-4">
              <Button variant="primary" type="submit">
                log in
              </Button>
              <FormErrors />
              <Link to="/forgot">forgot your password?</Link>
            </div>
          </Container>
        </Card>
      </Form>
    </Layout>
  );
}
export async function action({ request, context: { graphql } }: ActionArgs) {
  const variables = Object.fromEntries(await request.formData());
  const searchParams = new URL(request.url).searchParams;
  const params = Object.fromEntries(searchParams);
  if (!("username" in variables)) throw new Error("missing username");
  if (!("password" in variables)) throw new Error("missing password");
  console.log({ params, searchParams });
  const { data, errors } = await graphql(LoginDocument, variables);
  if (errors) throw errors;
  if (!data?.login?.user.id) throw new Error("error in login?");
  return redirect(params.redirectTo || "/");
}
