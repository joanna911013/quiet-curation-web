"use client";

import React from "react";
import { IconButton } from "./icon-button";

type ReadingContainerBaseProps = {
  title: string;
  authorOrSourceLine: string;
  meta: string;
  onToggleSave: () => void;
  saved?: boolean;
  onBack?: () => void;
};

type ReadingContainerProps =
  | (ReadingContainerBaseProps & { body: string; children?: never })
  | (ReadingContainerBaseProps & { body?: never; children: React.ReactNode });

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function ReadingContainer({
  title,
  authorOrSourceLine,
  meta,
  body,
  children,
  onToggleSave,
  saved = false,
  onBack,
}: ReadingContainerProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const content = body !== undefined ? (
    <p className="readingText">{body}</p>
  ) : (
    <div className="readingText">{children}</div>
  );

  return (
    <section className="readingContainer">
      <header className="readingHeader">
        <div className="readingHeaderInner">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="headerAction"
          >
            <BackIcon />
          </button>
          <IconButton
            ariaLabel={saved ? "Remove bookmark" : "Save"}
            isActive={saved}
            onClick={onToggleSave}
          />
        </div>
      </header>
      <div className="readingBody">
        <div className="readingContent">
          <h1 className="readingTitle">{title}</h1>
          <div className="readingMetaLine">{authorOrSourceLine}</div>
          {content}
          <div className="readingFootnote">{meta}</div>
        </div>
      </div>
    </section>
  );
}
