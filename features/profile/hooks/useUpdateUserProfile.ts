import { useAuthContext } from "features/auth/AuthProvider";
import { accountInfoQueryKey, userKey } from "features/queryKeys";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { routeToProfile } from "routes";
import { service, UpdateUserProfileData } from "service/index";
import { snakeToCamelKeysObject } from "service/user";
import { User } from "types/User.type";
import { SetMutationError } from "utils/types";

interface UpdateUserProfileVariables {
  profileData: UpdateUserProfileData;
  setMutationError: SetMutationError;
}

interface UpdateUserProfileErrorRes {
    error_messages: string[],
    errors: {string: string[]}[],
    status_code: number
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
  } = useMutation<User, UpdateUserProfileErrorRes, UpdateUserProfileVariables>(
    ({ profileData }): Promise<User> => service.user.updateProfile(profileData),
    {
      onError: (error, { setMutationError }) => {
        //TODO: make this error translatable and include specific problems
        setMutationError("Error in " + Object.keys(error.errors).join(', '));
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
