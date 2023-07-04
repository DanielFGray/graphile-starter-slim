import React, { useState } from "react";
import { useSearchParams, Routes, Route, NavLink } from "react-router-dom";
import {
  SettingsQuery,
  useChangePasswordMutation,
  useConfirmAccountDeletionMutation,
  useDeleteEmailMutation,
  useMakeEmailPrimaryMutation,
  useRequestAccountDeletionMutation,
  useResendEmailVerificationMutation,
  useSettingsQuery,
  useUpdateUserMutation,
  useAddEmailMutation,
  useUnlinkUserAuthenticationMutation,
} from "../generated";
import {
  Layout,
  Card,
  Input,
  Form,
  FormRow,
  Button,
  FormErrors,
  Danger,
  Container,
  Legend,
  SocialLogin,
  Spinner,
} from "../components";
import { useLogout } from "../lib";

export default function SettingsPage() {
  const query = useSettingsQuery();
  if (!query.data) return <Spinner />;
  return (
    <Layout query={query} title="Settings" forbidWhen={auth => auth.LOGGED_OUT}>
      <Container className="xl:flex-row">
        <ul className="items-middle flex flex-row justify-around gap-1 rounded bg-primary-100 p-4 dark:bg-primary-700 xl:w-1/4 xl:flex-col xl:justify-start xl:gap-4 xl:p-8">
          <li>
            <NavLink to="profile">profile</NavLink>
          </li>
          <li>
            <NavLink to="password">password</NavLink>
          </li>
          <li>
            <NavLink to="accounts">linked accounts</NavLink>
          </li>
          <li>
            <NavLink to="email">emails</NavLink>
          </li>
          <li>
            <NavLink to="delete">delete accounts</NavLink>
          </li>
        </ul>
        <div className="max-w-4xl flex-grow">
          <Routes>
            <Route path="profile" element={<UserProfile data={query.data} />} />
            <Route path="password" element={<PasswordSettings data={query.data} />} />
            <Route path="email" element={<EmailSettings data={query.data} />} />
            <Route path="accounts" element={<LinkedAccounts data={query.data} />} />
            <Route path="delete" element={<DeleteAccount />} />
            <Route
              index
              element={
                <>
                  <UserProfile data={query.data} />
                  <PasswordSettings data={query.data} />
                  <EmailSettings data={query.data} />
                  <LinkedAccounts data={query.data} />
                  <DeleteAccount />
                </>
              }
            />
          </Routes>
        </div>
      </Container>
    </Layout>
  );
}

function UserProfile({ data }: { data: SettingsQuery }) {
  const [updateUser, updateMutation] = useUpdateUserMutation();
  return (
    <Form
      onSubmit={async ({ values }) => {
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
      <Card as="fieldset">
        <Legend>profile settings</Legend>
        <Container>
          <FormRow label="username:">
            <Input
              type="text"
              name="username"
              defaultValue={data?.currentUser!.username}
              placeholder="username [required]"
              required
            />
          </FormRow>
          <FormRow label="name:">
            <Input
              type="text"
              name="name"
              defaultValue={data?.currentUser!.name ?? undefined}
              placeholder="name"
            />
          </FormRow>
          <div>
            <Button type="submit">update</Button>
            {updateMutation.data && "Success"}
          </div>
        </Container>
        <FormErrors />
      </Card>
    </Form>
  );
}

function PasswordSettings({ data }: { data: SettingsEmailsQuery }) {
  const [changePassword, changePasswordMutation] = useChangePasswordMutation();
  return (
    <Form
      onSubmit={async ({ values, setErrors }) => {
        if (values["newPassword"] !== values["confirmPassword"]) {
          setErrors("passwords do not match");
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
      <Card as="fieldset">
        <Legend>password settings</Legend>
        <Container>
          {data?.currentUser?.hasPassword ? (
            <FormRow label="old password:">
              <Input type="password" name="oldPassword" required minLength={6} />
            </FormRow>
          ) : null}
          <FormRow label={<span>new password:</span>}>
            <Input type="password" name="newPassword" required minLength={6} />
          </FormRow>
          <FormRow label={<span>confirm password:</span>}>
            <Input type="password" name="confirmPassword" required minLength={6} />
          </FormRow>
          <div>
            <Button type="submit">change password</Button>
            {changePasswordMutation.loading && "Loading"}
            {changePasswordMutation.data && "Success"}
          </div>
        </Container>
        <FormErrors />
      </Card>
    </Form>
  );
}

function EmailSettings({ data }: { data: SettingsEmailsQuery }) {
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
                hasOtherEmails={data?.currentUser?.userEmails.nodes.length > 1}
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
        {email.isPrimary && (
          <span
            className="rounded-md bg-green-300 p-1 text-sm font-bold text-green-900"
            key="primary_indicator"
          >
            Primary
          </span>
        )}
        {canDelete && (
          <Button onClick={() => deleteEmail({ variables: { emailId: email.id } })}>Delete</Button>
        )}
        {!email.isVerified && (
          <Button
            variant="primary"
            onClick={() => resendEmailVerification({ variables: { emailId: email.id } })}
          >
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
  const [showForm, setShowForm] = useState<boolean>(false);
  if (!showForm) {
    return (
      <div className="grow">
        <Button type="submit" onClick={() => setShowForm(true)}>
          Add email
        </Button>
      </div>
    );
  }
  return (
    <Form
      onSubmit={async ({ values }) => {
        await addEmail({ variables: values });
      }}
    >
      <FormRow label="new email:">
        <Input type="email" name="email" required />
      </FormRow>
      <div>
        <Button variant="primary" type="submit">Add email</Button>
      </div>
      <FormErrors />
    </Form>
  );
}

function UnlinkAccountButton({ id }: { id: string }) {
  const [doUnlink, { loading: deleting }] = useUnlinkUserAuthenticationMutation();
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
      <Button disabled={deleting} onClick={() => setModalOpen(true)}>
        Unlink
      </Button>
      <FormErrors errors={errors} />
    </div>
  );
}

function LinkedAccounts({ data }: { data: SettingsQuery }) {
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
      <SocialLogin next="/settings/accounts" label={service => `Link ${service} account`} />
    </Card>
  );
}

function DeleteAccount() {
  const [requestAccountDeletion] = useRequestAccountDeletionMutation();
  const [confirmAccountDeletion] = useConfirmAccountDeletionMutation();
  const [errors, setErrors] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [itIsDone, setItIsDone] = useState(false);
  const [doingIt, setDoingIt] = useState(false);
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
        await confirmAccountDeletion({ variables: { token } });
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
