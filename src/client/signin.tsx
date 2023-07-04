import React, { startTransition } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { useSharedLayoutQuery, useLoginMutation } from "../generated";
import {
  Layout,
  Card,
  Input,
  FormRow,
  Form,
  Button,
  FormErrors,
  Container,
  Legend,
  SocialLogin,
} from "../components";

export default function Login() {
  const query = useSharedLayoutQuery();
  const [login] = useLoginMutation();
  const client = useApolloClient();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/";
  return (
    <Layout query={query} title="Log In" forbidWhen={auth => auth.LOGGED_IN}>
      <Form
        method="post"
        className="mx-auto max-w-4xl"
        onSubmit={async ({ values }) => {
          startTransition(() => {
            login({ variables: values })
              .then(() => client.resetStore())
              .then(() => navigate(next));
          });
        }}
      >
        {({ errors }) => (
          <Card as="fieldset">
            <Legend>log in</Legend>
            <div className="border-b border-primary-300 pb-4">
              <SocialLogin label="log in" />
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
                {errors ? <Link to="/forgot">forgot your password?</Link> : null}
              </div>
            </Container>
          </Card>
        )}
      </Form>
    </Layout>
  );
}
