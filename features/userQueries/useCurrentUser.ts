import { useAuthContext } from "features/auth/AuthProvider";
import { currentUserKey } from "features/queryKeys";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { loginRoute } from "routes";
import { service } from "service";
import { CurrentUser } from "types/CurrentUser.type";

interface UseCurrentUserRes {
    data: CurrentUser | undefined, 
    error: Error | null, 
    isError: boolean, 
    isFetching: boolean, 
    isLoading: boolean
}

export default function useCurrentUser(): UseCurrentUserRes {

  const authState = useAuthContext().authState;
  const {data, error, isError, isFetching, isLoading} = useQuery<CurrentUser, Error>(currentUserKey, service.user.getCurrentUser);
  const router = useRouter();
  if (!authState.userId) {
    console.error("No user id available to get current user.");
    if (typeof window !== "undefined") router.push(loginRoute);
  }
  
  return {
    data,
    error: error,
    isError,
    isFetching,
    isLoading,


    
};
}
