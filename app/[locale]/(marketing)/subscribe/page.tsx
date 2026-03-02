import { notFound, redirect } from "next/navigation";
import SubscribePage from "../../../(marketing)/subscribe/page";

type LocalizedSubscribePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedSubscribePage({
  params,
}: LocalizedSubscribePageProps) {
  const { locale } = await params;

  if (locale === "en") {
    redirect("/subscribe");
  }

  if (locale !== "ko") {
    notFound();
  }

  return <SubscribePage locale="ko" />;
}
