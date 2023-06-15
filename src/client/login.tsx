import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { useLoginMutation } from "../generated";
import { Layout, Fieldset, Input, Form, Button, RenderErrors, Container } from "../components";

export default function Login(): JSX.Element {
  const [login] = useLoginMutation();
  const client = useApolloClient();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/";
  return (
    <Layout title="Log In" forbidWhen={auth => auth.LOGGED_IN}>
      <Form
        className="px-4"
        onSubmit={async (ev, { values }) => {
          await login({ variables: values });
          void client.resetStore();
          navigate(next);
        }}
      >
        {({ error }) => (
          <Fieldset>
            <legend>log in</legend>
            <Container>
              <Input
                type="text"
                name="username"
                placeholder="or email"
                required
                label={<span>username:</span>}
              />
              <Input
                type="password"
                name="password"
                placeholder="********"
                required
                label={<span>password:</span>}
              />
              <div>
                <Button type="submit">log in</Button>
              </div>
              <RenderErrors errors={error} />
              {error ? <Link to="/forgot">forgot your password?</Link> : null}
            </Container>
          </Fieldset>
        )}
      </Form>
    </Layout>
  );
}
