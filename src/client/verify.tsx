import React, { useEffect } from "react";
import { Layout, Input, Button, FormErrors, Container, Form, Stringify } from "../components";
import { useSharedLayoutQuery, useVerifyEmailMutation } from "../generated";
import { useSearchParams } from "react-router-dom";

export default function Verify() {
  const query = useSharedLayoutQuery();
  const [params] = useSearchParams();
  const token = params.get("token");
  const id = params.get("id");
  const [verifyEmail, mutation] = useVerifyEmailMutation();

  async function sendRequest(variables) {
    console.log(await verifyEmail({ variables }));
  }

  useEffect(() => {
    if (token && id) {
      sendRequest({ token, id });
    }
  }, []);

  return (
    <Layout query={query}>
      <Container className="p-4 items-center">
        {!token ? (
          <Form className="space-y-4" onSubmit={({ values }) => sendRequest({ id, token: values.token })}>
            <p>Please enter your email verification code</p>
            <Input type="text" name="token" defaultValue={token ?? ""} className="max-w-sm" />
            <FormErrors />
            <Button variant="primary">Submit</Button>
          </Form>
        ) : mutation.data?.verifyEmail.success ? (
          <div className="bg-gray-100 p-8">Thank you for verifying your email address. You may now close this window.</div>
        ) : (
          null
        )}
      </Container>
    </Layout>
  );
}
