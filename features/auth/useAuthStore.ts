import * as Sentry from "@sentry/nextjs";
import { userKey } from "features/queryKeys";
import { useTranslation } from "i18n";
import { GLOBAL } from "i18n/namespaces";
import { useCallback, useMemo, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { service } from "service";
import { SignupFlowRes } from "service/auth";
import isGrpcError from "utils/isGrpcError";
import isHttpError from "utils/isHttpError";

type StorageType = "localStorage" | "sessionStorage";

export interface SignupFlow {
  flowToken: string;
  needAccount: boolean;
  needFeedback: boolean;
  needAcceptCommunityGuidelines: boolean;
  isCompleted: boolean;
}

export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  storage: StorageType = "localStorage"
): [T | undefined, (value: T) => void, () => void] {
  //in ssr, window doesn't exist, just use default
  const saved =
    typeof window !== "undefined" ? window[storage].getItem(key) : null;
  const [_state, _setState] = useState<T | undefined>(
    saved !== null ? JSON.parse(saved) : defaultValue
  );
  const setState = useCallback(
    (value: T) => {
      if (value === undefined) {
        console.warn(`${key} can't be stored as undefined, casting to null.`);
      }
      const v = value === undefined ? null : value;
      window[storage].setItem(key, JSON.stringify(v));
      _setState(value);
    },
    [key, storage]
  );
  const clearState = useCallback(() => {
    window[storage].removeItem(key);
    _setState(undefined);
  }, [key, storage]);
  return [_state, setState, clearState];
}

export default function useAuthStore() {
  const [authenticated, setAuthenticated] = usePersistedState(
    "auth.authenticated",
    false
  );
  const [jailed, setJailed] = usePersistedState("auth.jailed", false);
  const [userId, setUserId] = usePersistedState<number | null>(
    "auth.userId",
    null
  );
  const [token, setToken] = usePersistedState<string | null>(
    "auth.token",
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flowState, setFlowState] = usePersistedState<SignupFlow | null>(
    "auth.flowState",
    null
  );

  //this is used to set the current user in the user cache
  //may as well not waste the api call since it is needed for userId
  const queryClient = useQueryClient();

  const { t } = useTranslation(GLOBAL);
  const fatalErrorMessage = useRef(t("error.fatal_message"));
  const authActions = useMemo(
    () => ({
      authError(message: string) {
        setError(message);
      },
      clearError() {
        setError(null);
      },
      async resetAuthState() {
        setAuthenticated(false);
        setUserId(null);
        setToken(null);
        window.sessionStorage.clear();
        Sentry.setUser(null);
      },
      async logout() {
        setError(null);
        setLoading(true);
        try {
          await service.user.logout().catch((e) => {
            const isTokenError = isHttpError(e) && e.status_code === 401;
            if (!isTokenError) throw e;
          });
        } catch (e) {
          Sentry.captureException(e, {
            tags: {
              component: "auth/useAuthStore",
              action: "logout",
            },
          });
          const errorMessage = isHttpError(e)
            ? (e.error_messages || [])[0]
            : fatalErrorMessage.current;
          setError(errorMessage);
        }

        this.resetAuthState();
        setLoading(false);
      },
      async passwordLogin({
        username,
        password,
      }: {
        username: string;
        password: string;
      }) {
        setError(null);
        setLoading(true);
        try {
          const auth = await service.user.passwordLogin(username, password);
          setToken(auth.auth_token);
          setUserId(auth.user_id);
          Sentry.setUser({ id: auth.user_id.toString() });

          //this must come after setting the userId, because calling setQueryData
          //will also cause that query to be background fetched, and it needs
          //userId to be set.
          setAuthenticated(true);
        } catch (e) {
          Sentry.captureException(e, {
            tags: {
              component: "auth/useAuthStore",
              action: "passwordLogin",
            },
          });
          const errorMessage = isHttpError(e)
            ? (e.error_messages || [])[0]
            : fatalErrorMessage.current;
          setError(errorMessage);
        }
        setLoading(false);
      },
      async updateSignupState(signupFlowRes: SignupFlowRes) {
        const state = {
          flowToken: signupFlowRes.flow_token,
          isCompleted: !!signupFlowRes.user_created,
          needAccount: !signupFlowRes.account_is_filled,
          needFeedback: !signupFlowRes.filled_feedback,
          needAcceptCommunityGuidelines:
            !signupFlowRes.accepted_current_community_guidelines,
        };
        setFlowState(state);
        if (state.isCompleted) {
          setFlowState(null);
          return;
        }
      },
      async updateJailStatus() {
        setError(null);
        setLoading(true);
        try {
          const res = await service.jail.getIsJailed();
          if (!res.isJailed) {
            setUserId(res.user.userId);
            Sentry.setUser({ id: res.user.userId.toString() });
            queryClient.setQueryData(userKey(res.user.userId), res.user);
          }
          setJailed(res.isJailed);
        } catch (e) {
          Sentry.captureException(e, {
            tags: {
              component: "auth/useAuthStore",
              action: "updateJailStatus",
            },
          });
          setError(isGrpcError(e) ? e.message : fatalErrorMessage.current);
        }
        setLoading(false);
      },
    }),
    //note: there should be no dependenices on the state or t, or
    //some useEffects will break. Eg. the token login in Login.tsx
    [
      setAuthenticated,
      setJailed,
      setUserId,
      setToken,
      setFlowState,
      queryClient,
    ]
  );

  return {
    authActions,
    authState: {
      authenticated,
      error,
      jailed,
      loading,
      userId,
      token,
      flowState,
    },
  };
}

export type AuthStoreType = ReturnType<typeof useAuthStore>;
