import { CircularProgress } from "@material-ui/core";
import * as Sentry from "@sentry/react";
import Alert from "components/Alert";
import HtmlMeta from "components/HtmlMeta";
import StyledLink from "components/StyledLink";
import { useTranslation } from "i18n";
import { AUTH, GLOBAL } from "i18n/namespaces";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { loginRoute } from "routes";
import { service } from "service";
import { ActivateUserReq, ActivateUserRes } from "service/auth";
import { HttpError } from "service/http";
import isHttpError from "utils/isHttpError";
import stringOrFirstString from "utils/stringOrFirstString";

export default function Activation() {
  const { t } = useTranslation([AUTH, GLOBAL]);

  const router = useRouter();
  const activationUID = stringOrFirstString(router.query.uid);
  const activationToken = stringOrFirstString(router.query.token);

  const {
    error,
    isLoading,
    isSuccess,
    mutate: activateUser,
  } = useMutation<ActivateUserRes, HttpError, ActivateUserReq>(
    ({ uid, token }) => service.auth.activateUser(uid, token),
    {
      onError: (error) => {
        Sentry.captureException(error, {
          tags: {
            component: "auth/signup/Activation",
          },
        });
      },
    }
  );

  useEffect(() => {
    if (activationUID && activationToken) {
      activateUser({ uid: activationUID, token: activationToken });
    }
  }, [activateUser, activationUID, activationToken]);

  const errorMessage = isHttpError(error)
    ? Object.values(error.errors || {}).flat()[0] || error.error_messages[0]
    : t("global:error.fatal_message");

  return (
    <>
      <HtmlMeta title={t("auth:user_activation")} />
      {isLoading ? (
        <CircularProgress />
      ) : isSuccess ? (
        <>
          <Alert severity="success">{t("auth:user_activation_success")}</Alert>
          <StyledLink href={loginRoute}>{t("auth:login_prompt")}</StyledLink>
        </>
      ) : error ? (
        <Alert severity="error">{errorMessage}</Alert>
      ) : (
        ""
      )}
    </>
  );
}
