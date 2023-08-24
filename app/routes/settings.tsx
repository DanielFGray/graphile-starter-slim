import React, { useState } from "react";
import {
  type EmailsForm_UserEmailFragment,
  ProfileSettingsDocument,
  ChangePasswordDocument,
  UpdateUserDocument,
  AddEmailDocument,
  ResendEmailVerificationDocument,
  MakeEmailPrimaryDocument,
  DeleteEmailDocument,
  RequestAccountDeletionDocument,
  ConfirmAccountDeletionDocument,
  UnlinkUserAuthenticationDocument,
} from "~/generated";
import {
  Layout,
  Card,
  Input,
  FormRow,
  Button,
  FormErrors,
  Danger,
  Container,
  Legend,
  SocialLogin,
} from "~/components";
import { forbidWhen } from "~/lib";
import { type ActionArgs, type LoaderArgs, json } from "@remix-run/node";
import { useSearchParams, Form, useActionData, useLoaderData } from "@remix-run/react";

export async function loader({ request, context: { graphql } }: LoaderArgs) {
  const { data } = await graphql(ProfileSettingsDocument, {});
  forbidWhen(auth => auth.LOGGED_OUT, data?.currentUser, request);
  return json(data);
}

export default function SettingsPage() {
  const [params] = useSearchParams();
  const deleteToken = params.get("delete_token");
  return (
    <Layout>
      <Container className="mx-auto mb-4 max-w-4xl">
        {deleteToken ? (
          <DeleteAccount token={deleteToken} />
        ) : (
          <>
            <UserProfile />
            <PasswordSettings />
            <EmailSettings />
            <LinkedAccounts />
            <DeleteAccount />
          </>
        )}
      </Container>
    </Layout>
  );
}

function UserProfile() {
  const data = useLoaderData<typeof loader>();
  return (
    <Form method="POST" action="/settings">
      <input type="hidden" name="id" value={data?.currentUser?.id} />
      <Card as="fieldset">
        <Legend>profile settings</Legend>
        <Container>
          <FormRow label="username:">
            <Input
              type="text"
              name="username"
              defaultValue={data?.currentUser?.username}
              placeholder="username [required]"
              required
            />
          </FormRow>
          <FormRow label="name:">
            <Input
              type="text"
              name="name"
              defaultValue={data?.currentUser?.name ?? undefined}
              placeholder="name"
            />
          </FormRow>
          <FormRow label="bio:">
            <Input
              type="textarea"
              name="bio"
              defaultValue={data?.currentUser?.bio}
              placeholder="bio"
              maxLength={4000}
            />
          </FormRow>
          <div>
            <Button type="submit" name="type" value="updateProfile">
              update
            </Button>
          </div>
        </Container>
        <FormErrors />
      </Card>
    </Form>
  );
}

function PasswordSettings() {
  // const [changePassword, changePasswordMutation] = ChangePasswordDocument();
  const data = useLoaderData<typeof loader>();
  const response = useActionData<typeof action>();
  return (
    <Form method="POST" action="/settings">
      <Card as="fieldset">
        <Legend>password settings</Legend>
        <Container>
          <FormRow
            label={<span>old password:</span>}
            className={data?.currentUser?.hasPassword ? "" : "hidden"}
          >
            <Input
              type="password"
              name="oldPassword"
              required={data?.currentUser?.hasPassword ?? false}
              minLength={6}
            />
          </FormRow>
          <FormRow label={<span>new password:</span>}>
            <Input type="password" name="newPassword" required minLength={6} />
          </FormRow>
          <FormRow label={<span>confirm password:</span>}>
            <Input type="password" name="confirmPassword" required minLength={6} />
          </FormRow>
          <div>
            <Button type="submit" name="type" value="changePassword">
              change password
            </Button>
          </div>
        </Container>
        <FormErrors errors={response?.errors} />
      </Card>
    </Form>
  );
}

function EmailSettings() {
  const data = useLoaderData<typeof loader>();
  return (
    <Card as="fieldset">
      <Legend>email settings</Legend>
      <Container>
        <div>
          <Container>
            {data?.currentUser?.userEmails.nodes.map(email => (
              <Email
                key={email.id}
                email={email}
                hasOtherEmails={Number(data?.currentUser?.userEmails.nodes.length) > 1}
              />
            ))}
          </Container>
          <FormErrors
            errors={
              data?.currentUser && data?.currentUser.isVerified
                ? null
                : `You do not have any verified email addresses, this will make account recovery impossible and may limit your available functionality within this application. Please complete email verification.`
            }
          />
        </div>
        <AddEmailForm />
      </Container>
    </Card>
  );
}

function Email({
  email,
  hasOtherEmails,
}: {
  email: EmailsForm_UserEmailFragment;
  hasOtherEmails: boolean;
}) {
  const canDelete = !email.isPrimary && hasOtherEmails;
  return (
    <li className="flex flex-row justify-between">
      <div>
        {`✉️ ${email.email} `}
        <div className="flex flex-row gap-2">
          <span
            title={
              email.isVerified
                ? "Verified"
                : "Pending verification (please check your inbox / spam folder"
            }
          >
            {email.isVerified ? "✅ " : <Danger as="small">(unverified)</Danger>}
          </span>
          Added {new Date(Date.parse(email.createdAt)).toLocaleString()}
        </div>
      </div>
      <Form method="post" className="space-x-2">
        <input type="hidden" name="emailId" value={email.id} />
        {email.isPrimary && (
          <span
            className="rounded-md bg-green-300 p-1 pb-1.5 text-sm font-bold text-green-900"
            key="primary_indicator"
          >
            Primary
          </span>
        )}
        {canDelete && (
          <Button variant="danger" type="submit" name="type" value="deleteEmail">
            Delete
          </Button>
        )}
        {!email.isVerified && (
          <Button variant="primary" name="type" value="resendValidation">
            Resend verification
          </Button>
        )}
        {email.isVerified && !email.isPrimary && (
          <Button name="type" value="makePrimary">
            Make primary
          </Button>
        )}
      </Form>
    </li>
  );
}

function AddEmailForm() {
  const [params] = useSearchParams();
  const [showForm, setShowForm] = useState<boolean>(Boolean(params.get("showAddEmail") ?? false));
  if (!showForm) {
    return (
      <form
        onSubmit={ev => {
          ev.preventDefault();
          setShowForm(true);
        }}
      >
        <Button type="submit" name="showAddEmail" value="1">
          Add email
        </Button>
      </form>
    );
  }
  return (
    <Form method="post">
      <FormRow label="new email:">
        <Input type="email" name="email" required />
      </FormRow>
      <div>
        <Button type="submit" name="type" value="addEmail">
          Add email
        </Button>
      </div>
      <FormErrors />
    </Form>
  );
}

function LinkedAccounts() {
  const data = useLoaderData<typeof loader>();
  return (
    <Card as="fieldset">
      <Legend>manage linked accounts</Legend>
      {data?.currentUser?.authentications.map(auth => (
        <div key={auth.id}>
          <strong>{auth.service}</strong>
          <div>Added {new Date(Date.parse(auth.createdAt)).toLocaleString()}</div>
          <UnlinkAccountButton key="unlink" id={auth.id} />
        </div>
      ))}
      <SocialLogin redirectTo="/settings" label={service => `Link ${service} account`} />
    </Card>
  );
}

function UnlinkAccountButton({ id }: { id: string }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      {modalOpen ? (
        <Form method="post">
          <b>Are you sure?</b>
          <p>
            If you unlink this account you won&apos;t be able to log in with it any more; please
            make sure your email is valid.
          </p>
          <div>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" name="type" value="unlinkUserAuth">
              Unlink
            </Button>
          </div>
          <input type="hidden" name="id" value={id} />
        </Form>
      ) : (
        <Button onClick={() => setModalOpen(true)}>Unlink</Button>
      )}
    </div>
  );
}

function DeleteAccount({ token }: { token?: string }) {
  const actionData = useActionData();
  return (
    <Card as="fieldset">
      <Legend className="bg-red-700 text-red-100">danger zone</Legend>
      {token ? (
        <Form method="post">
          <p>
            This is it. <b>Press this button and your account will be deleted.</b> We&apos;re sorry
            to see you go, please don&apos;t hesitate to reach out and let us know why you no longer
            want your account.
          </p>
          <p className="text-right">
            <Button
              variant="danger"
              className="font-bold"
              name="type"
              value="confirmAccountDeletion"
            >
              PERMANENTLY DELETE MY ACCOUNT
            </Button>
            <input type="hidden" name="token" value={token} />
          </p>
        </Form>
      ) : actionData?.data?.requestAccountDeletion?.success ? (
        <div>
          You&apos;ve been sent an email with a confirmation link in it, you must click it to
          confirm that you are the account holder so that you may continue deleting your account.
        </div>
      ) : (
        <Form method="post" className="text-right">
          <Button variant="danger" name="type" value="requestAccountDeletion">
            I want to delete my account
          </Button>
        </Form>
      )}
      <FormErrors errors={actionData?.data?.requestAccountDeletion?.errors} />
    </Card>
  );
}

export async function action({ request, context: { graphql } }: ActionArgs) {
  const { type, ...formdata } = Object.fromEntries(await request.formData());
  try {
    switch (type) {
      case "updateProfile": {
        const { id, ...patch } = formdata;
        const result = await graphql(UpdateUserDocument, { id, patch });
        return json(result);
      }
      case "changePassword": {
        const result = await graphql(ChangePasswordDocument, formdata);
        return json(result);
      }
      case "addEmail": {
        const result = await graphql(AddEmailDocument, formdata);
        return json(result);
      }
      case "makePrimary": {
        const result = await graphql(MakeEmailPrimaryDocument, formdata);
        return json(result);
      }
      case "resendValidation": {
        const result = await graphql(ResendEmailVerificationDocument, formdata);
        return json(result);
      }
      case "deleteEmail": {
        const result = await graphql(DeleteEmailDocument, formdata);
        return json(result);
      }
      case "unlinkUserAuth": {
        const result = await graphql(UnlinkUserAuthenticationDocument, formdata)
        return json(result)
      }
      case "requestAccountDeletion": {
        const result = await graphql(RequestAccountDeletionDocument);
        return json(result);
      }
      case "confirmAccountDeletion": {
        const result = await graphql(ConfirmAccountDeletionDocument, formdata);
        return json(result);
      }
      default: {
        throw new Error(`unknown settings action type: ${type}`);
      }
    }
  } catch (e) {
    console.error(e);
    if ("message" in e) return json({ errors: e.message });
  }
  return json({ errors: "unknown error" });
}
