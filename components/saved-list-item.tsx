import Link from "next/link";

type SavedListItemProps = {
  href: string;
  title: string;
  sourceLine: string;
  verseText: string;
  literatureLine?: string;
  savedAt?: string;
};

export function SavedListItem({
  href,
  title,
  sourceLine,
  verseText,
  literatureLine,
  savedAt,
}: SavedListItemProps) {
  return (
    <Link href={href} className="listItem">
      <span className="listItemTitle">{title}</span>
      <span className="listItemSource">{sourceLine}</span>
      <span className="listItemPreview">{verseText}</span>
      {literatureLine ? (
        <span className="listItemPreview">{literatureLine}</span>
      ) : null}
      {savedAt ? (
        <span className="text-xs text-neutral-400">Saved {savedAt}</span>
      ) : null}
    </Link>
  );
}
