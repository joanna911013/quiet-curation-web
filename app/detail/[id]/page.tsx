import { redirect } from "next/navigation";

type DetailRedirectProps = {
  params: {
    id: string;
  };
};

export default function DetailRedirect({ params }: DetailRedirectProps) {
  redirect(`/c/${params.id}`);
}
