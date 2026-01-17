"use client";

import React from "react";

type ListItemProps = {
  title: string;
  source: string;
  preview?: string;
  onOpen: () => void;
  className?: string;
};

const joinClassNames = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export function ListItem({
  title,
  source,
  preview,
  onOpen,
  className,
}: ListItemProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={joinClassNames("listItem", className)}
    >
      <span className="listItemTitle">{title}</span>
      <span className="listItemSource">{source}</span>
      {preview ? (
        <span className="listItemPreview">{preview}</span>
      ) : null}
    </button>
  );
}
