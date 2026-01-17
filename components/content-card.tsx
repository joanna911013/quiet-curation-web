"use client";

import React from "react";
import { IconButton } from "./icon-button";

type ContentCardProps = {
  title: string;
  preview: string;
  source: string;
  meta?: string;
  saved?: boolean;
  onOpen: () => void;
  onToggleSave?: () => void;
  className?: string;
};

const joinClassNames = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export function ContentCard({
  title,
  preview,
  source,
  meta,
  saved = false,
  onOpen,
  onToggleSave,
  className,
}: ContentCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  const handleToggleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleSave?.();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      className={joinClassNames("card", className)}
    >
      <div className="cardHeader">
        <div className="cardTitle">{title}</div>
        {onToggleSave ? (
          <IconButton
            ariaLabel={saved ? "Remove bookmark" : "Save"}
            isActive={saved}
            ariaPressed={saved}
            onClick={handleToggleSave}
          />
        ) : null}
      </div>
      <div className="cardPreview">{preview}</div>
      <div className="cardSourceRow">
        <div className="cardSource">{source}</div>
        {meta ? <div className="cardMeta">{meta}</div> : null}
      </div>
    </article>
  );
}
