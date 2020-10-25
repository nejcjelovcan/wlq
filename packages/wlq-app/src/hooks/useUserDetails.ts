import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useOvermind } from "../overmind";

export default function useUserDetails() {
  const {
    state: { user }
  } = useOvermind();

  const router = useRouter();
  useEffect(() => {
    if (!user.matches("Valid")) {
      router.replace(
        `/settings/?next=${encodeURIComponent(
          document.location.pathname + document.location.search
        )}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user.matches("Valid")) return user.details;

  return undefined;
}
