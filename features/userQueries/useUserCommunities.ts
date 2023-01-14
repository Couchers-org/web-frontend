import { userCommunitiesKey } from "features/queryKeys";
import { useInfiniteQuery } from "react-query";
import { service } from "service";
import { CommunityListRes } from "service/communities";
import { HttpError } from "service/http";

export default function useUserCommunities() {
  return useInfiniteQuery<CommunityListRes, HttpError>(
    userCommunitiesKey,
    ({ pageParam }) => service.communities.listUserCommunities(pageParam),
    {
      getNextPageParam: (lastPage) => {
        return (
          lastPage?.next &&
          Number(new URL(lastPage.next).searchParams.get("page"))
        );
      },
    }
  );
}
