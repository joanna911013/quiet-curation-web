import { renderQuietInviteEmail } from "./renderQuietInviteEmail";
import { sendEmail, type SendEmailResult } from "./sendEmail";

type QuietInviteRecipient = {
  id: string;
  email: string;
};

type QuietInviteCuration = {
  id: string;
  title?: string | null;
  excerpt?: string | null;
  rationale_short?: string | null;
  summary?: string | null;
  literature_text?: string | null;
  literature_title?: string | null;
  literature_work?: string | null;
  pairing_date?: string | null;
};

type QuietInvitePairing = {
  verse_reference?: string | null;
  canonical_ref?: string | null;
  verse_text?: string | null;
  translation?: string | null;
  literature_text?: string | null;
  literature_author?: string | null;
  literature_title?: string | null;
  literature_work?: string | null;
  literature_source?: string | null;
};

type SendInviteEmailInput = {
  recipient: QuietInviteRecipient;
  curation: QuietInviteCuration;
  pairing?: QuietInvitePairing | null;
  siteUrl: string;
};

type SendInviteEmailResult = SendEmailResult;

export async function sendInviteEmail(
  input: SendInviteEmailInput,
): Promise<SendInviteEmailResult> {
  const { recipient, curation, pairing, siteUrl } = input;
  const recipientEmail = recipient.email?.trim();

  if (!recipientEmail) {
    return { ok: false, error: "Recipient email is missing" };
  }
  const provider = (process.env.EMAIL_PROVIDER ?? "dryrun").toLowerCase();
  const logContext = {
    userId: recipient.id,
    email: recipientEmail,
    curationId: curation.id,
    provider,
  };

  try {
    console.log("[quiet-invite] send start:", logContext);
    const { subject, html } = renderQuietInviteEmail({
      curation,
      pairing,
      siteUrl,
    });
    const result = await sendEmail({
      to: recipientEmail,
      subject,
      html,
    });

    if (result.ok) {
      console.log("[quiet-invite] send success:", {
        ...logContext,
        id: result.id,
      });
      return result;
    }

    console.error("[quiet-invite] send failure:", {
      ...logContext,
      error: result.error,
    });
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    console.error("[quiet-invite] send failure:", {
      ...logContext,
      error: message,
    });
    return {
      ok: false,
      error: message,
    };
  }
}
