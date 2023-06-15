import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { useRegisterMutation } from "../generated";
import {
  Layout,
  Fieldset,
  Input,
  Form,
  Button,
  RenderErrors,
  Container,
  Danger,
} from "../components";

export default function SignUp(): JSX.Element {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [register, registerMutation] = useRegisterMutation();
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/";

  return (
    <Layout title="Register" forbidWhen={auth => auth.LOGGED_IN}>
      <Form
        className="px-4"
        onSubmit={async (ev, { values, setError }) => {
          if (values["confirmPassword"] !== values.password) {
            setError("passwords do not match");
            return;
          }

          await register({ variables: values });
          // resetWebsocketConnection()
          await client.resetStore();
          navigate(next);
        }}
      >
        {({ error }) => (
          <Fieldset>
            <legend>sign up</legend>
            <Container>
              <Input
                type="email"
                name="email"
                autoCapitalize="false"
                required
                label={
                  <span>
                    email<Danger>*</Danger>:
                  </span>
                }
              />
              <Input
                type="text"
                name="username"
                autoCapitalize="false"
                autoComplete="false"
                required
                label={
                  <span>
                    username<Danger>*</Danger>:
                  </span>
                }
              />
              <Input
                type="password"
                name="password"
                required
                minLength={6}
                label={
                  <span>
                    password<Danger>*</Danger>:
                  </span>
                }
              />
              <Input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                label={
                  <span>
                    confirm password<Danger>*</Danger>:
                  </span>
                }
              />
              <Input type="text" name="name" label={<span>your name:</span>} />
              <div>
                <Button type="submit">register</Button>
                {registerMutation.loading && "Loading"}
                {registerMutation.data && "Success"}
              </div>
              <RenderErrors errors={error} />
            </Container>
          </Fieldset>
        )}
      </Form>
    </Layout>
  );
}
