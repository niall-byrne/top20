import { useSession, signIn, signOut } from "next-auth/react";
import { getPersistedUseState } from "../../../hooks/utility/local.storage";
import type {
  AuthVendorHookInterface,
  AuthServiceType,
} from "../../../types/clients/auth/vendor.types";
import type { Session } from "next-auth";

const useNextAuth = (): AuthVendorHookInterface => {
  const [oauth, setOauth] = getPersistedUseState()<{
    type: string | null;
  }>("oauth", {
    type: null,
  });
  const { data, status } = useSession();

  const mapStatus = {
    authenticated: "authenticated" as const,
    loading: "processing" as const,
    unauthenticated: "unauthenticated" as const,
  };

  const mapSession = (session: Session | null) => {
    if (status !== "authenticated") return null;
    return {
      name: session?.user?.name ? session?.user?.name : undefined,
      email: session?.user?.email ? session?.user?.email : undefined,
      image: session?.user?.image ? session?.user?.image : undefined,
      group: session?.group ? (session?.group as string) : undefined,
      oauth: oauth.type as AuthServiceType,
    };
  };

  const signInWithOauth = (oauthService: AuthServiceType) => {
    setOauth({ type: oauthService });
    signIn(oauthService);
  };

  const signOutWithOauth = () => {
    setOauth({ type: null });
    signOut();
  };

  return {
    signIn: signInWithOauth,
    signOut: signOutWithOauth,
    status: mapStatus[status],
    user: mapSession(data),
  };
};

export default useNextAuth;
