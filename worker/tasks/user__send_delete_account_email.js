/** @typedef { import("./send_email").SendEmailPayload } SendEmailPayload */
/** @typedef { import("graphile-worker").Task } Task */

/** @typedef {{
    email: string
    token: string
  }} UserSendAccountDeletionEmailPayload */

/** @type {Task} */
module.exports = async (inPayload, { addJob }) => {
  /** @type {UserSendAccountDeletionEmailPayload} */
  const payload = inPayload;
  const { email, token } = payload;

  /** @type {SendEmailPayload} */
  const sendEmailPayload = {
    options: {
      to: email,
      subject: "Confirmation required: really delete account?",
    },
    template: "delete_account.mjml",
    variables: {
      token,
      deleteAccountLink: `${process.env.RAZZLE_ROOT_URL}/settings/delete?token=${encodeURIComponent(
        token,
      )}`,
    },
  };
  await addJob("send_email", sendEmailPayload);
};
