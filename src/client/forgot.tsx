import React, { useState } from "react";
import {
  Button,
  Container,
  Danger,
  Fieldset,
  Form,
  FormRow,
  Input,
  Layout,
  Legend,
  FormErrors,
} from "../components";
import { useSharedLayoutQuery, useForgotPasswordMutation } from "../generated";

export const path = "/forgot";

export default function ForgotPassword() {
  const query = useSharedLayoutQuery()
  const [forgotPassword] = useForgotPasswordMutation();
  const [successfulEmail, setSuccessfulEmail] = useState<string | null>(null);
  return (
    <Layout query={query} forbidWhen={auth => auth.LOGGED_IN}>
      {successfulEmail ? (
        <p>
          We&apos;ve sent an email reset link to &lsquo;{successfulEmail}&rsquo;; click the link and
          follow the instructions. If you don&apos;t receive the link, please ensure you entered the
          email address correctly, and check in your spam folder just in case.
        </p>
      ) : (
        <Form
          onSubmit={async ({ values }) => {
            await forgotPassword({ variables: values });
            setSuccessfulEmail(email);
          }}
        >
          <Fieldset>
            <Legend>forgot password</Legend>
            <Container>
              <FormRow label="email:">
                <Input name="email" type="email" required />
              </FormRow>
              <div>
                <Button type="submit" children="reset password" />
              </div>
              <FormErrors />
            </Container>
          </Fieldset>
        </Form>
      )}
    </Layout>
  );
}
