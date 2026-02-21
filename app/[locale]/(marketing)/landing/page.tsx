import { notFound, redirect } from "next/navigation";
import LandingPage from "../../../(marketing)/landing/page";

type LocalizedLandingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedLandingPage({
  params,
}: LocalizedLandingPageProps) {
  const { locale } = await params;

  if (locale === "en") {
    redirect("/landing");
  }

  if (locale !== "ko") {
    notFound();
  }

  return <LandingPage />;
}
