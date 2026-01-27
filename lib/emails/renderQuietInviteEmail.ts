type QuietInviteCuration = {
  id: string;
  title?: string | null;
  excerpt?: string | null;
  rationale?: string | null;
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

type RenderQuietInviteEmailInput = {
  curation: QuietInviteCuration;
  pairing?: QuietInvitePairing | null;
  siteUrl: string;
};

type RenderQuietInviteEmailOutput = {
  subject: string;
  html: string;
};

export function renderQuietInviteEmail(
  input: RenderQuietInviteEmailInput,
): RenderQuietInviteEmailOutput {
  const { curation, pairing, siteUrl } = input;
  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const deepLink = `${normalizedSiteUrl}/login?redirect=/c/${curation.id}`;
  const title =
    firstNonEmpty(
      curation.title,
      curation.literature_title,
      curation.literature_work,
    ) || "Today's Quiet Curation";
  const excerpt =
    firstNonEmpty(
      curation.excerpt,
      curation.rationale,
      curation.summary,
      curation.literature_text,
    ) || "Open the app to read today's curation.";
  const dateLine = curation.pairing_date
    ? `For ${new Date(curation.pairing_date).toLocaleDateString()}`
    : "";

  const pairingSection = pairing ? renderPairingSection(pairing) : "";
  const subject = `Quiet Curation: ${title}`;

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f7f3ef;font-family:Helvetica,Arial,sans-serif;color:#2d2721;">
    <div style="max-width:640px;margin:0 auto;padding:28px;">
      <p style="margin:0 0 12px 0;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#8c7f76;">
        Quiet Curation
      </p>
      <h1 style="margin:0 0 8px 0;font-size:28px;line-height:1.25;color:#1f1a16;">
        ${escapeHtml(title)}
      </h1>
      ${
        dateLine
          ? `<p style="margin:0 0 16px 0;font-size:14px;color:#8c7f76;">${escapeHtml(dateLine)}</p>`
          : ""
      }
      <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#3a332c;">
        ${escapeHtml(excerpt)}
      </p>
      ${pairingSection}
      <a href="${deepLink}" style="display:inline-block;margin-top:24px;background-color:#1f1a16;color:#f7f3ef;text-decoration:none;padding:12px 18px;border-radius:999px;font-size:14px;letter-spacing:0.02em;">
        Open today's reading
      </a>
      <p style="margin:18px 0 0 0;font-size:12px;color:#8c7f76;line-height:1.4;">
        If the button doesn't work, paste this link into your browser:<br />
        <span style="color:#4a4038;">${escapeHtml(deepLink)}</span>
      </p>
    </div>
  </body>
</html>`;

  return { subject, html };
}

function renderPairingSection(pairing: QuietInvitePairing) {
  const verseReference = firstNonEmpty(
    pairing.verse_reference,
    pairing.canonical_ref,
  );
  const verseText = firstNonEmpty(pairing.verse_text);
  const translation = firstNonEmpty(pairing.translation);

  const literatureTitle = firstNonEmpty(
    pairing.literature_title,
    pairing.literature_work,
  );
  const literatureAuthor = firstNonEmpty(
    pairing.literature_author,
    pairing.literature_source,
  );
  const literatureText = firstNonEmpty(pairing.literature_text);
  const literatureLine = [literatureTitle, literatureAuthor]
    .filter(Boolean)
    .join(" · ");

  const blocks: string[] = [];

  if (verseReference || verseText) {
    blocks.push(`
      <div style="margin-bottom:16px;">
        <div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#8c7f76;margin-bottom:6px;">Verse</div>
        ${
          verseReference
            ? `<div style="font-size:15px;font-weight:600;margin-bottom:6px;color:#1f1a16;">${escapeHtml(
                verseReference,
              )}${translation ? ` (${escapeHtml(translation)})` : ""}</div>`
            : ""
        }
        ${
          verseText
            ? `<div style="font-size:14px;line-height:1.6;color:#3a332c;">${escapeHtml(
                verseText,
              )}</div>`
            : ""
        }
      </div>
    `);
  }

  if (literatureLine || literatureText) {
    blocks.push(`
      <div>
        <div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#8c7f76;margin-bottom:6px;">Reading</div>
        ${
          literatureLine
            ? `<div style="font-size:15px;font-weight:600;margin-bottom:6px;color:#1f1a16;">${escapeHtml(
                literatureLine,
              )}</div>`
            : ""
        }
        ${
          literatureText
            ? `<div style="font-size:14px;line-height:1.6;color:#3a332c;">${escapeHtml(
                literatureText,
              )}</div>`
            : ""
        }
      </div>
    `);
  }

  if (!blocks.length) {
    blocks.push(
      `<div style="font-size:14px;line-height:1.6;color:#3a332c;">Open the app for the full pairing.</div>`,
    );
  }

  return `
    <div style="margin-top:12px;border:1px solid #eadfd7;background-color:#fff7f1;border-radius:16px;padding:18px;">
      <h2 style="margin:0 0 12px 0;font-size:16px;letter-spacing:0.08em;text-transform:uppercase;color:#5a4d45;">
        Pairing
      </h2>
      ${blocks.join("")}
    </div>
  `;
}

function firstNonEmpty(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
