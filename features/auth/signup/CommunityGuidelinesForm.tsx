import Alert from "components/Alert";
import { useAuthContext } from "features/auth/AuthProvider";
import CommunityGuidelines from "features/auth/CommunityGuidelines";
import { useTranslation } from "i18n";
import { GLOBAL } from "i18n/namespaces";
import { useMutation } from "react-query";
import { service } from "service";
import { HttpError } from "service/http";
import isHttpError from "utils/isHttpError";

export default function CommunityGuidelinesForm() {
  const { t } = useTranslation(GLOBAL);
  const { authActions, authState } = useAuthContext();

  const mutation = useMutation<void, HttpError, boolean>(
    async (accept) => {
      const state = await service.auth.signupFlowCommunityGuidelines(
        authState.flowState!.flowToken,
        accept ? 1 : -1
      );
      authActions.updateSignupState(state);
    },
    {
      onMutate() {
        authActions.clearError();
      },
      onSettled() {
        window.scroll({ top: 0, behavior: "smooth" });
      },
    }
  );

  const errorMessage = isHttpError(mutation.error)
    ? mutation.error?.error_messages[0]
    : t("global:error.fatal_message");

  return (
    <>
      {mutation.error && <Alert severity="error">{errorMessage}</Alert>}
      <CommunityGuidelines
        onSubmit={(accept) => mutation.mutateAsync(accept)}
      />
    </>
  );
}
