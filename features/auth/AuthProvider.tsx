import { useTranslation } from "i18n";
import { AUTH } from "i18n/namespaces";
import React, { Context, ReactNode, useContext, useEffect } from "react";
import { loginRoute } from "routes";
import { setUnauthenticatedErrorHandler } from "service/http";
import useStablePush from "utils/useStablePush";

import useAuthStore, { AuthStoreType } from "./useAuthStore";

export const AuthContext = React.createContext<null | AuthStoreType>(null);

function useAppContext<T>(context: Context<T | null>) {
  const contextValue = useContext(context);
  if (contextValue === null) {
    throw Error("No context provided!");
  }
  return contextValue;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation(AUTH);
  const store = useAuthStore();

  const push = useStablePush();

  useEffect(() => {
    setUnauthenticatedErrorHandler(async () => {
      store.authActions.resetAuthState();
      store.authActions.authError(t("logged_out_message"));
      push(loginRoute);
    });

    return () => {
      setUnauthenticatedErrorHandler(async () => {});
    };
  }, [store.authActions, push, t]);

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useAppContext(AuthContext);
