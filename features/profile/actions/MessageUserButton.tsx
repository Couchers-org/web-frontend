import { UserDetail } from "api";
import Button from "components/Button";
import { MESSAGE } from "features/profile/constants";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { routeToCreateMessage, routeToGroupChat } from "routes";
import { service } from "service";

export default function MessageUserButton({
  user,
  setMutationError,
}: {
  user: UserDetail;
  setMutationError: (value: string) => void;
}) {
  const router = useRouter();
  const { mutate, isLoading } = useMutation<number | false, Error>(
    () => service.conversations.getDirectMessage(user.id),
    {
      onMutate() {
        setMutationError("");
      },
      onError(e) {
        setMutationError(e.message);
      },
      onSuccess(data) {
        if (!data) {
          //no existing thread
          if (user.username) {
            router.push(routeToCreateMessage(user.username));
          }
        } else {
          //has thread
          router.push(routeToGroupChat(data));
        }
      },
    }
  );

  return (
    <Button loading={isLoading} onClick={() => mutate()}>
      {MESSAGE}
    </Button>
  );
}
