import { useMediaQuery } from "@material-ui/core";
import Alert from "components/Alert";
import Button from "components/Button";
import HtmlMeta from "components/HtmlMeta";
import PageTitle from "components/PageTitle";
import StyledLink from "components/StyledLink";
import TextField from "components/TextField";
import { useTranslation } from "i18n";
import { AUTH, GLOBAL } from "i18n/namespaces";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { loginRoute } from "routes";
import { service } from "service";
import { HttpError } from "service/http";
import { theme } from "theme";
import makeStyles from "utils/makeStyles";
import stringOrFirstString from "utils/stringOrFirstString";

interface PasswordResetFields {
  password: string;
  passwordConfirmation: string;
}

const useStyles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(0, 3),
  },
  form: {
    "& > * + *": {
      marginBlockStart: theme.spacing(1),
    },
  },
}));

export default function CompleteResetPassword() {
  const { t } = useTranslation([AUTH, GLOBAL]);
  const classes = useStyles();
  const isMdOrWider = useMediaQuery(theme.breakpoints.up("md"));

  const router = useRouter();
  const resetUID = stringOrFirstString(router?.query.uid) || "";
  const resetToken = stringOrFirstString(router?.query.token) || "";

  const {
    errors,
    getValues,
    handleSubmit,
    reset: resetForm,
    register,
  } = useForm<PasswordResetFields>({
    mode: "onBlur",
  });
  const onSubmit = handleSubmit(({ password }) => {
    completePasswordReset(password);
  });

  const {
    error: changePasswordError,
    isLoading,
    isSuccess,
    mutate: completePasswordReset,
  } = useMutation<void, HttpError, string>(
    async (password) =>
      service.account.completePasswordReset(resetUID, resetToken, password),
    {
      onSuccess: () => {
        resetForm();
      },
    }
  );

  const errorMessage = (changePasswordError?.error_messages || [])[0];

  return (
    <main className={classes.main}>
      <HtmlMeta title={t("auth:reset_password")} />
      <PageTitle>{t("auth:jail_set_password_form.title")}</PageTitle>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {isSuccess ? (
        <>
          <Alert severity="success">
            {t("auth:change_password_form.password_changed_success")}
          </Alert>
          <StyledLink href={loginRoute}>{t("auth:login_prompt")}</StyledLink>
        </>
      ) : (
        <form className={classes.form} onSubmit={onSubmit}>
          <TextField
            id="password"
            inputRef={register({ required: true })}
            label={t("auth:change_password_form.new_password")}
            name="password"
            type="password"
            fullWidth={!isMdOrWider}
          />
          <TextField
            id="passwordConfirmation"
            inputRef={register({
              validate: (value) =>
                value === getValues("password") ||
                t("auth:change_password_form.password_mismatch_error"),
            })}
            label={t("auth:change_password_form.confirm_password")}
            fullWidth={!isMdOrWider}
            name="passwordConfirmation"
            type="password"
            helperText={errors.passwordConfirmation?.message}
          />
          <Button fullWidth={!isMdOrWider} loading={isLoading} type="submit">
            {t("global:submit")}
          </Button>
        </form>
      )}
    </main>
  );
}
