import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import enMessages from "../../messages/en.json";
import koMessages from "../../messages/ko.json";
import "../globals.css";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (locale === "en") {
    return (
      <NextIntlClientProvider
        locale="en"
        messages={enMessages}
        timeZone="UTC"
        now={new Date()}
        formats={{}}
      >
        {children}
      </NextIntlClientProvider>
    );
  }

  if (locale === "ko") {
    return (
      <NextIntlClientProvider
        locale="ko"
        messages={koMessages}
        timeZone="UTC"
        now={new Date()}
        formats={{}}
      >
        {children}
      </NextIntlClientProvider>
    );
  }

  notFound();
}
