import { User } from "api";
import { SetMutationError } from "features/connections/friends";
import AddFriendButton from "features/connections/friends/AddFriendButton";

import PendingFriendReqButton from "./PendingFriendReqButton";

interface FriendActionsProps {
  user: User;
  setMutationError: SetMutationError;
}

export default function FriendActions({
  user,
  setMutationError,
}: FriendActionsProps) {
  return null;
  /* @todo: uncomment when we load friends */
  // if (user.friends === User.FriendshipStatus.NOT_FRIENDS) {
  //   return (
  //     <AddFriendButton
  //       userId={user.userId}
  //       setMutationError={setMutationError}
  //     />
  //   );
  // } else if (
  //   user.pendingFriendRequest &&
  //   user.pendingFriendRequest.sent === false
  // ) {
  //   return (
  //     <PendingFriendReqButton
  //       friendRequest={user.pendingFriendRequest}
  //       setMutationError={setMutationError}
  //     />
  //   );
  // } else {
  //   return null;
  // }
}
