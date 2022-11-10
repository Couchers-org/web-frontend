import { InputLabel } from "@material-ui/core";
import Alert from "components/Alert";
import Button from "components/Button";
import TextField from "components/TextField";
import { useAuthContext } from "features/auth/AuthProvider";
import useAuthStyles from "features/auth/useAuthStyles";
import { useTranslation } from "i18n";
import { AUTH, GLOBAL } from "i18n/namespaces";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { service } from "service";
import { HttpError } from "service/http";
import {
  emailValidationPattern,
  lowercaseAndTrimField,
  nameValidationPattern,
  passwordValidationPattern,
} from "utils/validation";

type SignupBasicInputs = {
  name: string;
  email: string;
  password: string;
};

interface BasicFormProps {
  submitText?: string;
  successCallback?: () => void;
}

export default function BasicForm({
  submitText,
  successCallback,
}: BasicFormProps) {
  const { t } = useTranslation([AUTH, GLOBAL]);
  const { authActions } = useAuthContext();
  const authClasses = useAuthStyles();

  const { register, handleSubmit, errors } = useForm<SignupBasicInputs>({
    mode: "onBlur",
    shouldUnregister: false,
  });

  const mutation = useMutation<void, HttpError, SignupBasicInputs>(
    async (data) => {
      const sanitizedEmail = lowercaseAndTrimField(data.email);
      const { password } = data;
      const signupFlow = await service.auth.startSignup(
        data.name,
        sanitizedEmail,
        password
      );
      return authActions.updateSignupState(signupFlow);
    },
    {
      onSettled() {
        window.scroll({ top: 0, behavior: "smooth" });
      },
      onSuccess() {
        if (successCallback !== undefined) {
          successCallback();
        }
      },
    }
  );

  const onSubmit = handleSubmit((data: SignupBasicInputs) => {
    mutation.mutate(data);
  });

  const nameInputRef = useRef<HTMLInputElement>();

  const formSubmitErrors = Object.values(mutation.error?.errors || {})
    .flat()
    .map((message) => (
      <Alert severity="error" key={message}>
        {message}
      </Alert>
    ));

  return (
    <>
      {mutation.error && formSubmitErrors}
      <form className={authClasses.form} onSubmit={onSubmit}>
        <InputLabel className={authClasses.formLabel} htmlFor="name">
          {t("auth:basic_form.name.field_label")}
        </InputLabel>
        <TextField
          id="name"
          fullWidth
          className={authClasses.formField}
          name="name"
          variant="standard"
          inputRef={(el: HTMLInputElement | null) => {
            if (!nameInputRef.current) el?.focus();
            if (el) nameInputRef.current = el;
            register(el, {
              pattern: {
                message: t("auth:basic_form.name.empty_error"),
                value: nameValidationPattern,
              },
              required: t("auth:basic_form.name.required_error"),
            });
          }}
          helperText={errors?.name?.message ?? " "}
          error={!!errors?.name?.message}
        />
        <InputLabel className={authClasses.formLabel} htmlFor="email">
          {t("auth:basic_form.email.field_label")}
        </InputLabel>
        <TextField
          id="email"
          fullWidth
          className={authClasses.formField}
          name="email"
          variant="standard"
          inputRef={register({
            pattern: {
              message: t("auth:basic_form.email.empty_error"),
              value: emailValidationPattern,
            },
            required: t("auth:basic_form.email.required_error"),
          })}
          helperText={errors?.email?.message ?? " "}
          error={!!errors?.email?.message}
        />
        <InputLabel className={authClasses.formLabel} htmlFor="password">
          {t("auth:basic_form.password.field_label")}
        </InputLabel>
        <TextField
          id="password"
          fullWidth
          className={authClasses.formField}
          name="password"
          type="password"
          variant="standard"
          inputRef={register({
            pattern: {
              message: t("auth:basic_form.password.empty_error"),
              value: passwordValidationPattern,
            },
            required: t("auth:basic_form.password.required_error"),
          })}
          helperText={errors?.password?.message ?? " "}
          error={!!errors?.password?.message}
        />
        <Button
          classes={{
            label: authClasses.buttonText,
            root: authClasses.button,
          }}
          onClick={onSubmit}
          type="submit"
          loading={mutation.isLoading}
          fullWidth
        >
          {submitText || t("global:continue")}
        </Button>
      </form>
    </>
  );
}
