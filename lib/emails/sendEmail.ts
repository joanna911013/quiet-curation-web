type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export type SendEmailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

export async function sendEmail(
  params: SendEmailParams,
): Promise<SendEmailResult> {
  const provider = (process.env.EMAIL_PROVIDER ?? "dryrun").toLowerCase();
  const dryRun = provider === "dryrun" || process.env.EMAIL_DRY_RUN === "true";

  if (dryRun) {
    console.log("[email][dryrun]", {
      to: params.to,
      subject: params.subject,
      htmlLength: params.html.length,
    });
    return { ok: true, id: "dryrun" };
  }

  if (provider === "resend") {
    try {
      return await sendWithResend(params);
    } catch (error) {
      return { ok: false, error: normalizeError(error) };
    }
  }

  if (provider === "sendgrid") {
    try {
      return await sendWithSendGrid(params);
    } catch (error) {
      return { ok: false, error: normalizeError(error) };
    }
  }

  return { ok: false, error: `Unknown EMAIL_PROVIDER: ${provider}` };
}

async function sendWithResend(
  params: SendEmailParams,
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      ok: false,
      error: "Missing RESEND_API_KEY or RESEND_FROM/EMAIL_FROM",
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
      to: params.to,
      subject: params.subject,
      html: params.html,
    }),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    return {
      ok: false,
      error: message || `Resend error (${response.status}).`,
    };
  }

  const data = (await response.json().catch(() => null)) as
    | { id?: string }
    | null;

  return { ok: true, id: data?.id };
}

async function sendWithSendGrid(
  params: SendEmailParams,
): Promise<SendEmailResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM || process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      ok: false,
      error: "Missing SENDGRID_API_KEY or SENDGRID_FROM/EMAIL_FROM",
    };
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: params.to }] }],
      from: { email: from },
      subject: params.subject,
      content: [{ type: "text/html", value: params.html }],
    }),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    return {
      ok: false,
      error: message || `SendGrid error (${response.status}).`,
    };
  }

  return { ok: true };
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
