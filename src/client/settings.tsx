import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  EmailsForm_UserEmailFragment,
  SettingsEmailsQuery,
  useChangePasswordMutation,
  useConfirmAccountDeletionMutation,
  useDeleteEmailMutation,
  useMakeEmailPrimaryMutation,
  useRequestAccountDeletionMutation,
  useResendEmailVerificationMutation,
  useSettingsEmailsQuery,
  useUpdateUserMutation,
  useAddEmailMutation,
} from "../generated";
import { extractError } from "../lib";
import {
  Layout,
  Fieldset,
  Input,
  Form,
  Button,
  RenderErrors,
  Danger,
  Container,
} from "../components";

export default function SingleSettingsPage() {
  const query = useSettingsEmailsQuery();
  return (
    <Layout title="Settings" forbidWhen={auth => auth.LOGGED_OUT}>
      {({ logout }) => (
        <div className="flex flex-col gap-4 px-4">
          <UserProfile data={query.data} />
          <PasswordSettings data={query.data} />
          <EmailSettings data={query.data} />
          <DeleteAccount logout={logout} />
        </div>
      )}
    </Layout>
  );
}

function UserProfile({ data }: { data: SettingsEmailsQuery }) {
  const [updateUser, updateMutation] = useUpdateUserMutation();
  return (
    <Form
      onSubmit={async (ev, { values }) => {
        await updateUser({
          variables: {
            id: data.currentUser?.id,
            patch: {
              username: values.username,
              name: values.name,
            },
          },
        });
      }}
    >
      {({ error }) => (
        <Fieldset>
          <legend>profile settings</legend>
          <Container>
            <Input
              type="text"
              name="username"
              defaultValue={data?.currentUser.username}
              placeholder="username [required]"
              required
              label={<span>username:</span>}
            />
            <Input
              type="text"
              name="name"
              defaultValue={data?.currentUser.name}
              placeholder="name"
              label={<span>name:</span>}
            />
            <div>
              <Button type="submit">update</Button>
              {updateMutation.data && "Success"}
            </div>
          </Container>
          <RenderErrors errors={error} />
        </Fieldset>
      )}
    </Form>
  );
}

function PasswordSettings({ data }: { data: SettingsEmailsQuery }) {
  const [changePassword, changePasswordMutation] = useChangePasswordMutation();
  return (
    <Form
      onSubmit={async (ev, { values, setError }) => {
        if (values["newPassword"] !== values["confirmPassword"]) {
          setError("passwords do not match");
          return;
        }
        await changePassword({
          variables: {
            oldPassword: values["oldPassword"],
            newPassword: values["newPassword"],
          },
        });
      }}
    >
      {({ error }) => (
        <Fieldset>
          <legend>password settings</legend>
          <Container>
            {data?.currentUser?.hasPassword ? (
              <Input
                type="password"
                name="oldPassword"
                required
                minLength={6}
                label={<span>old password:</span>}
              />
            ) : null}
            <Input
              type="password"
              name="newPassword"
              required
              minLength={6}
              label={<span>new password:</span>}
            />
            <Input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              label={<span>confirm password:</span>}
            />
            <div>
              <Button type="submit">change password</Button>
              {changePasswordMutation.loading && "Loading"}
              {changePasswordMutation.data && "Success"}
            </div>
          </Container>
          <RenderErrors errors={error} />
        </Fieldset>
      )}
    </Form>
  );
}

function EmailSettings({ data }: { data: SettingsEmailsQuery }) {
  return (
    <Fieldset>
      <legend>email settings</legend>
      <Container>
        {data?.currentUser.userEmails.nodes.map(email => (
          <Email
            key={email.id}
            email={email}
            hasOtherEmails={data.currentUser.userEmails.nodes.length > 1}
          />
        ))}
        <div>
          <Button type="submit">update emails</Button>
        </div>
        <AddEmailForm />
        <RenderErrors errors={data?.currentUser && data?.currentUser.isVerified ? null : `You do not have any verified email addresses, this will make account recovery impossible and may limit your available functionality within this application. Please complete email verification.`} />
      </Container>
    </Fieldset>
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
  const [deleteEmail] = useDeleteEmailMutation();
  const [resendEmailVerification] = useResendEmailVerificationMutation();
  const [makeEmailPrimary] = useMakeEmailPrimaryMutation();
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
      <div>
        {email.isPrimary && <span key="primary_indicator">Primary</span>}
        {canDelete && (
          <Button onClick={() => deleteEmail({ variables: { emailId: email.id } })}>Delete</Button>
        )}
        {!email.isVerified && (
          <Button onClick={() => resendEmailVerification({ variables: { emailId: email.id } })}>
            Resend verification
          </Button>
        )}
        {email.isVerified && !email.isPrimary && (
          <Button onClick={() => makeEmailPrimary({ variables: { emailId: email.id } })}>
            Make primary
          </Button>
        )}
      </div>
    </li>
  );
}

function AddEmailForm() {
  const [addEmail] = useAddEmailMutation();
  return (
    <Form
      className="flex flex-row gap-2"
      onSubmit={async (ev, { values }) => {
        await addEmail({ variables: values });
      }}
    >
      {({ error }) => (
        <>
          <Input type="email" name="newEmail" required label={<span>new email:</span>} />
          <Button type="submit" value="Add email" />
          <RenderErrors errors={error} />
        </>
      )}
    </Form>
  );
}

function DeleteAccount({ logout }: { logout: () => Promise<void> }) {
  const [requestAccountDeletion] = useRequestAccountDeletionMutation();
  const [confirmAccountDeletion] = useConfirmAccountDeletionMutation();
  const [errors, setErrors] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [itIsDone, setItIsDone] = useState(false);
  const [doingIt, setDoingIt] = useState(false);
  const [params] = useSearchParams();
  const token = params.get("token");
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
        await confirmAccountDeletion({ variables: { token } });
        // Display confirmation
        setDeleted(true);
        await logout();
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
    <form onSubmit={ev => ev.preventDefault()}>
      <Fieldset>
        <Danger as="legend">danger zone</Danger>
        {token ? (
          <div>
            <p>
              This is it. <b>Press this button and your account will be deleted.</b> We&apos;re
              sorry to see you go, please don&apos;t hesitate to reach out and let us know why you
              no longer want your account.
            </p>
            <p className="text-right">
              <Button
                className="bg-red-200 border-red-300 text-red-800"
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
            <Button
              className="bg-red-200 border-red-300 text-red-800"
              onClick={doIt}
              disabled={doingIt}
            >
              I want to delete my account
            </Button>
          </p>
        )}
        <RenderErrors errors={errors} />
      </Fieldset>
    </form>
  );
}
