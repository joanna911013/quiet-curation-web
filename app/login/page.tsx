import { redirect } from "next/navigation";

type LoginRedirectProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function LoginRedirect({ searchParams }: LoginRedirectProps) {
  const params = new URLSearchParams();
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (Array.isArray(value)) {
        if (value.length > 0 && value[0] != null) {
          params.set(key, value[0]);
        }
      } else if (typeof value === "string") {
        params.set(key, value);
      }
    }
  }
  const query = params.toString();
  redirect(query ? `/?${query}` : "/");
}
