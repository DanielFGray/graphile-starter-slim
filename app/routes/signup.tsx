import {
  Layout,
  Card,
  Input,
  FormRow,
  Button,
  FormErrors,
  Legend,
  Container,
  Danger,
  SocialLogin,
} from "~/components";
import { Form, useLoaderData } from "@remix-run/react";
import { RegisterDocument, SharedLayoutDocument } from "~/generated";
import { loaders, forbidWhen, fromGraphQL } from "~/middleware";
import { ActionArgs, json, redirect } from "@remix-run/node";

export const loader = loaders(
  fromGraphQL(SharedLayoutDocument, {}),
  forbidWhen(auth => auth.LOGGED_IN),
);

export default function SignUp() {
  const data = useLoaderData<typeof loader>();
  return (
    <Layout user={data?.currentUser}>
      <Form method="post" className="mx-auto max-w-4xl">
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
              <FormErrors />
            </div>
          </Container>
        </Card>
      </Form>
    </Layout>
  );
}

export const action = async ({ request, context: { graphql } }: ActionArgs) => {
  const formdata = Object.fromEntries(await request.formData());
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const response = await graphql(RegisterDocument, formdata);
  console.log(response);
  if (!response.data?.register?.user.id) return json(response);
  throw redirect(params.redirectTo || "/");
};
