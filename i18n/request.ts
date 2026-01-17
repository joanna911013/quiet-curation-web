import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import enMessages from "../messages/en.json";
import koMessages from "../messages/ko.json";

export default getRequestConfig(async ({ locale }) => {
  if (locale === "en") {
    return { locale, messages: enMessages };
  }

  if (locale === "ko") {
    return { locale, messages: koMessages };
  }

  notFound();
});
