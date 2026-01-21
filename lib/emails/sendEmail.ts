type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

type SendEmailSuccess = {
  ok: true;
  provider: string;
  id?: string;
};

type SendEmailFailure = {
  ok: false;
  provider: string;
  error: string;
};

export type SendEmailResult = SendEmailSuccess | SendEmailFailure;

export async function sendEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const provider =
    (process.env.EMAIL_PROVIDER ?? "resend").toLowerCase().trim();

  try {
    if (provider === "resend") {
      return await sendWithResend(input);
    }
    if (provider === "sendgrid") {
      return await sendWithSendGrid(input);
    }
    return {
      ok: false,
      provider,
      error: "Unsupported email provider.",
    };
  } catch (error) {
    return {
      ok: false,
      provider,
      error: normalizeError(error),
    };
  }
}

async function sendWithResend(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      ok: false,
      provider: "resend",
      error: "Missing RESEND_API_KEY or RESEND_FROM.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    return {
      ok: false,
      provider: "resend",
      error: message || `Resend error (${response.status}).`,
    };
  }

  const data = (await response.json().catch(() => null)) as
    | { id?: string }
    | null;

  return { ok: true, provider: "resend", id: data?.id };
}

async function sendWithSendGrid(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM || process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      ok: false,
      provider: "sendgrid",
      error: "Missing SENDGRID_API_KEY or SENDGRID_FROM.",
    };
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: input.to }] }],
      from: { email: from },
      subject: input.subject,
      content: [{ type: "text/html", value: input.html }],
    }),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    return {
      ok: false,
      provider: "sendgrid",
      error: message || `SendGrid error (${response.status}).`,
    };
  }

  return { ok: true, provider: "sendgrid" };
}

async function readErrorMessage(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return response.text().catch(() => "");
  }
  const data = (await response.json().catch(() => null)) as
    | { message?: string }
    | { errors?: Array<{ message?: string }> }
    | null;

  if (!data) {
    return "";
  }
  if ("message" in data && data.message) {
    return data.message;
  }
  if ("errors" in data && Array.isArray(data.errors)) {
    return data.errors.map((item) => item.message).filter(Boolean).join("; ");
  }
  return "";
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Unknown email error.";
}
