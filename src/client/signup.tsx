import React, { startTransition } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { useSharedLayoutQuery, useRegisterMutation } from "../generated";
import {
  Layout,
  Card,
  Input,
  Form,
  FormRow,
  Button,
  FormErrors,
  Legend,
  Container,
  Danger,
  SocialLogin,
} from "../components";

export default function SignUp() {
  const query = useSharedLayoutQuery();
  const client = useApolloClient();
  const navigate = useNavigate();
  const [register, registerMutation] = useRegisterMutation();
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/";

  return (
    <Layout query={query} title="Register" forbidWhen={auth => auth.LOGGED_IN}>
      <Form
        className="mx-auto max-w-4xl"
        onSubmit={async ({ values, setErrors }) => {
          if (values["confirmPassword"] !== values.password) {
            setErrors("passwords do not match");
            return;
          }

          startTransition(() => {
            register({ variables: values })
              .then(() => client.resetStore())
              .then(() => {
                // resetWebsocketConnection()
                navigate(next);
              });
          });
        }}
      >
        <Card as="fieldset">
          <Legend>sign up</Legend>
          <div className="border-b border-primary-300 pb-4">
            <SocialLogin label="sign up" />
          </div>
          <Container className="mt-4">
            <FormRow
              label={
                <>
                  email<Danger as="small">*</Danger>:
                </>
              }
            >
              <Input type="email" name="email" autoCapitalize="false" required />
            </FormRow>
            <FormRow
              label={
                <>
                  username<Danger as="small">*</Danger>:
                </>
              }
            >
              <Input
                type="text"
                name="username"
                autoCapitalize="false"
                autoComplete="false"
                required
              />
            </FormRow>
            <FormRow
              label={
                <>
                  password<Danger as="small">*</Danger>:
                </>
              }
            >
              <Input type="password" name="password" required minLength={6} />
            </FormRow>
            <FormRow
              label={
                <>
                  confirm password<Danger as="small">*</Danger>:
                </>
              }
            >
              <Input type="password" name="confirmPassword" required minLength={6} />
            </FormRow>
            <FormRow label={<span>your name:</span>}>
              <Input type="text" name="name" />
            </FormRow>
            <div>
              <Button type="submit">register</Button>
              {registerMutation.loading && "Loading"}
              {registerMutation.data && "Success"}
              <FormErrors />
            </div>
          </Container>
        </Card>
      </Form>
    </Layout>
  );
}
