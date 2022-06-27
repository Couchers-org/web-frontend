import { PatchedUser } from "api";
import { useAuthContext } from "features/auth/AuthProvider";
import { accountInfoQueryKey, userKey } from "features/queryKeys";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { routeToProfile } from "routes";
import client from "service/rest/client";
import { SetMutationError } from "utils/types";

interface UpdateUserProfileVariables {
  profileData: PatchedUser;
  setMutationError: SetMutationError;
}

export default function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const userId = useAuthContext().authState.userId;
  const {
    mutate: updateUserProfile,
    reset,
    isLoading,
    isError,
    status,
  } = useMutation<PatchedUser, Error, UpdateUserProfileVariables>(
    ({ profileData }) => {
      return client.users.usersMePartialUpdate({
        patchedUser: profileData,
      });
    },
    {
      onError: (error, { setMutationError }) => {
        setMutationError(error.message);
      },
      onMutate: ({ setMutationError }) => {
        setMutationError(null);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(userKey(userId ?? 0));
        queryClient.invalidateQueries(accountInfoQueryKey);
        router.push(routeToProfile("about"));
      },
    }
  );

  return { reset, updateUserProfile, isLoading, isError, status };
}
