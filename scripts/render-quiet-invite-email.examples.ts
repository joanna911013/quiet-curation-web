import { renderQuietInviteEmail } from "../lib/emails/renderQuietInviteEmail";

const withPairing = renderQuietInviteEmail({
  curation: {
    id: "curation-123",
    title: "A quiet morning",
    excerpt:
      "Begin the day with stillness and a short reflection on steady love.",
    pairing_date: "2026-01-21",
  },
  pairing: {
    canonical_ref: "Psalms 23:1",
    verse_text: "The Lord is my shepherd, I lack nothing.",
    translation: "NIV",
    literature_title: "Meditations",
    literature_author: "Anon",
    literature_text:
      "Love teaches us to rest, to observe, and to move with intention.",
  },
  siteUrl: "http://localhost:3000",
});

console.log("With pairing subject:", withPairing.subject);
console.log(withPairing.html);

const withoutPairing = renderQuietInviteEmail({
  curation: {
    id: "curation-456",
    title: "Evening grace",
    excerpt: "Close the day with gratitude and a gentle breath.",
  },
  siteUrl: "http://localhost:3000",
});

console.log("Without pairing subject:", withoutPairing.subject);
console.log(withoutPairing.html);
