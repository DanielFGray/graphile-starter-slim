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
import { useLogout } from "~/lib";
import { type ActionArgs, type LoaderArgs, redirect, json } from "@remix-run/node";
import { useSearchParams, Form, useActionData, useLoaderData, useNavigate } from "@remix-run/react";

export async function loader({ context: { graphql } }: LoaderArgs) {
  const { data } = await graphql(ProfileSettingsDocument, {});
  if (data?.currentUser == null) throw redirect("/signin?redirectTo=/settings");
  return json(data);
}

export default function SettingsPage() {
  return (
    <Layout>
      <Container className="mx-auto mb-4 max-w-4xl">
        <UserProfile />
        <PasswordSettings />
        <EmailSettings />
        <LinkedAccounts />
        <DeleteAccount />
      </Container>
    </Layout>
  );
}

function UserProfile() {
  // const [updateUser, updateMutation] = UpdateUserDocument();
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

function UnlinkAccountButton({ id }: { id: string }) {
  // const [doUnlink, { loading: deleting }] = UnlinkUserAuthenticationDocument();
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState();

  async function handleUnlink() {
    setModalOpen(false);
    try {
      await doUnlink({ variables: { id } });
    } catch (e) {
      setErrors(e);
    }
  }

  return (
    <div>
      {modalOpen ? (
        <div>
          <b>Are you sure?</b>
          <p>
            If you unlink this account you won&apos;t be able to log in with it any more; please
            make sure your email is valid.
          </p>
          <div>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleUnlink}>
              Unlink
            </Button>
          </div>
        </div>
      ) : null}
      <Button onClick={() => setModalOpen(true)}>Unlink</Button>
      <FormErrors errors={errors} />
    </div>
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

function DeleteAccount() {
  // const [requestAccountDeletion] = RequestAccountDeletionDocument();
  // const [confirmAccountDeletion] = ConfirmAccountDeletionDocument();
  const [errors, setErrors] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [itIsDone, setItIsDone] = useState(false);
  const [doingIt, setDoingIt] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const logout = useLogout();
  const token = params.get("delete_token");
  function doIt() {
    setErrors(null);
    setDoingIt(true);
    void (async () => {
      try {
        const result = await requestAccountDeletion();
        if (!result) {
          setErrors("Result expected");
        }
        const { data, errors } = result;
        if (!data || !data.requestAccountDeletion || !data.requestAccountDeletion.success) {
          console.dir(errors);
          setErrors("Requesting deletion failed");
        }
        setItIsDone(true);
      } catch (e) {
        setErrors(e instanceof Error ? e.message : e);
      }
      setDoingIt(false);
    })();
  }
  function confirmDeletion() {
    if (deleting || !token) {
      return;
    }
    setErrors(null);
    setDeleting(true);
    void (async () => {
      try {
        // await confirmAccountDeletion({ variables: { token } });
        // Display confirmation
        setDeleted(true);
        logout();
      } catch (e) {
        setErrors(e);
      }
      setDeleting(false);
    })();
  }
  if (deleted) {
    navigate("/");
    return null;
  }
  return (
    <Card as="fieldset">
      <Legend className="bg-red-700 text-red-100">danger zone</Legend>
      {token ? (
        <div>
          <p>
            This is it. <b>Press this button and your account will be deleted.</b> We&apos;re sorry
            to see you go, please don&apos;t hesitate to reach out and let us know why you no longer
            want your account.
          </p>
          <p className="text-right">
            <Button
              variant="danger"
              className="font-bold"
              onClick={confirmDeletion}
              disabled={deleting}
            >
              PERMANENTLY DELETE MY ACCOUNT
            </Button>
          </p>
        </div>
      ) : itIsDone ? (
        <div>
          You&apos;ve been sent an email with a confirmation link in it, you must click it to
          confirm that you are the account holder so that you may continue deleting your account.
        </div>
      ) : (
        <p className="text-right">
          <Button variant="danger" onClick={doIt} disabled={doingIt}>
            I want to delete my account
          </Button>
        </p>
      )}
      <FormErrors errors={errors} />
    </Card>
  );
}

export async function action({ request, context: { graphql } }: ActionArgs) {
  const { type, ...formdata } = Object.fromEntries(await request.formData());
  // RequestAccountDeletionDocument,
  // UnlinkUserAuthenticationDocument,
  // ConfirmAccountDeletionDocument,
  try {
    switch (type) {
      case "updateProfile": {
        const { id, ...patch } = formdata;
        const result = await graphql(UpdateUserDocument, { id, patch });
        return result;
      }
      case "changePassword": {
        const result = await graphql(ChangePasswordDocument, formdata);
        return result;
      }
      case "addEmail": {
        const result = await graphql(AddEmailDocument, formdata);
        return result;
      }
      case "makePrimary": {
        const result = await graphql(MakeEmailPrimaryDocument, formdata);
        return result;
      }
      case "resendValidation": {
        const result = await graphql(ResendEmailVerificationDocument, formdata);
        return result;
      }
      case "deleteEmail": {
        const result = await graphql(DeleteEmailDocument, formdata);
        return result;
      }
      default: {
        throw new Error(`unknown settings action type: ${type}`);
      }
    }
  } catch (e) {
    console.log("error changing password:", e);
    if ("message" in e) {
      return json({ error: e.message });
    }
  }
  return json("unknown error");
}
