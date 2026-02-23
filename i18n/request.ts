import { getRequestConfig } from "next-intl/server";
import enMessages from "../messages/en.json";
import koMessages from "../messages/ko.json";

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale === "ko" ? "ko" : "en";
  return {
    locale: resolvedLocale,
    messages: resolvedLocale === "ko" ? koMessages : enMessages,
  };
});
