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
  locale?: string | null;
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
  const rationale = firstNonEmpty(curation.rationale);
  const excerptCandidate = firstNonEmpty(
    curation.excerpt,
    curation.summary,
    curation.literature_text,
  );
  const fallbackExcerpt = firstNonEmpty(
    curation.literature_text,
    curation.summary,
  );
  const excerpt =
    rationale && excerptCandidate?.trim() === rationale.trim()
      ? fallbackExcerpt
      : excerptCandidate ?? "Open the app to read today's curation.";
  const isKo =
    typeof curation.locale === "string" &&
    curation.locale.toLowerCase().startsWith("ko");
  const headerTagline = isKo
    ? "오늘의 문학x성경 페어링으로 차분한 하루를 시작해보세요."
    : "Start your day with this calm daily pairing of literature and verse.";
  const headerDate = formatEmailDate(null, isKo);
  const rationaleHeading = isKo ? "연결고리 설명" : "Why this pairing?";

  const pairingSection = pairing ? renderPairingSection(pairing) : "";
  const rationaleSection = rationale
    ? `
      <div style="margin-top:18px;border:1px solid #eadfd7;background-color:#fffaf6;border-radius:14px;padding:16px;">
        <div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#8c7f76;margin-bottom:6px;">
          ${escapeHtml(rationaleHeading)}
        </div>
        <div style="font-size:14px;line-height:1.6;color:#3a332c;">
          ${escapeHtml(rationale)}
        </div>
      </div>
    `
    : "";
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
      <h1 style="margin:0 0 6px 0;font-size:28px;line-height:1.25;color:#1f1a16;">
        Quiet Curation
      </h1>
      <p style="margin:0 0 6px 0;font-size:14px;color:#8c7f76;">
        ${escapeHtml(headerTagline)}
      </p>
      <p style="margin:0 0 16px 0;font-size:13px;color:#8c7f76;">
        ${escapeHtml(headerDate)}
      </p>
      <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#3a332c;">
        ${escapeHtml(excerpt)}
      </p>
      ${pairingSection}
      ${rationaleSection}
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

  if (literatureLine || literatureText) {
    blocks.push(`
      <div style="margin-bottom:16px;">
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

  if (verseReference || verseText) {
    blocks.push(`
      <div>
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

function formatEmailDate(dateValue: string | null | undefined, isKo: boolean) {
  const date = dateValue ? new Date(dateValue) : new Date();
  const formatter = new Intl.DateTimeFormat(isKo ? "ko-KR" : "en-US", {
    year: "numeric",
    month: isKo ? "long" : "short",
    day: "numeric",
  });
  return formatter.format(date);
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
