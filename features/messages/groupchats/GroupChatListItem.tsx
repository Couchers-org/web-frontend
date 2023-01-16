import { ListItem, ListItemAvatar, ListItemProps, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
import Avatar from "components/Avatar";
import { MuteIcon } from "components/Icons";
import { useAuthContext } from "features/auth/AuthProvider";
import { controlMessage, groupChatTitleText, isControlMessage, messageTargetId } from "features/messages/utils";
import useUsers from "features/userQueries/useUsers";
import { useTranslation } from "i18n";
import { MESSAGES } from "i18n/namespaces";
import { GroupChat } from "proto/conversations_pb";
import React from "react";
import { firstName } from "utils/names";

const useStyles = makeStyles((theme) => ({
  titlePadding: { marginInlineEnd: theme.spacing(1) },
  muteIcon: { verticalAlign: "middle" },
  unread: { fontWeight: "bold" },
}));

// FIXME: Use the correct interface here
export interface GroupChatListItemProps extends ListItemProps {
  groupChat: GroupChat.AsObject;
}

export default function GroupChatListItem({
  groupChat,
  className,
}: GroupChatListItemProps) {
  const { t } = useTranslation(MESSAGES);
  const classes = useStyles();
  const currentUserId = useAuthContext().authState.userId!;
  const latestMessageAuthorId = groupChat.latest_message?.user;
  const isUnreadClass =
    groupChat.lastSeenMessageId !== groupChat.latest_message?.id
      ? classes.unread
      : "";

  //It is possible the last message is sent by someone who has left
  //so include it just in case
  const groupChatMembersQuery = useUsers([
    ...groupChat.users,
    latestMessageAuthorId,
  ]);

  //the avatar is of the latest message author (if it's not the logged in user),
  //otherwise any user that's not the logged in user, otherwise logged in user
  const avatarUserId =
    latestMessageAuthorId !== null && latestMessageAuthorId !== currentUserId
      ? latestMessageAuthorId
      : groupChat.users.find((id) => id !== currentUserId) ??
      currentUserId;

  //title is the chat title, or all the member's names except current user joined together
  const title = groupChatTitleText(
    groupChat,
    groupChatMembersQuery,
    currentUserId
  );

  //text is the control message text or message text
  let text = "";
  const authorName = firstName(
    groupChatMembersQuery.data?.get(groupChat.latest_message?.user)?.name
  );

  if (groupChat.latest_message && isControlMessage(groupChat.latest_message)) {
    const targetName = firstName(
      groupChatMembersQuery.data?.get(messageTargetId(groupChat.latest_message))
        ?.name
    );
    text = controlMessage({
      user: authorName,
      target_user: targetName,
      t,
      message: groupChat.latest_message,
    });
  } else {
    text = `${authorName}: ${groupChat.latest_message?.text || ""}`;
  }

  return (
    <ListItem button className={className}>
      <ListItemAvatar>
        {groupChatMembersQuery.isLoading ? (
          <Skeleton />
        ) : (
          <Avatar
            user={groupChatMembersQuery.data?.get(avatarUserId)}
            isProfileLink={false}
          />
        )}
      </ListItemAvatar>
      {
        //When we want more than primary and secondary (host Request status, etc)
        //They can also take react nodes. But change typography component using props
      }
      <ListItemText
        primary={
          groupChatMembersQuery.isLoading ? (
            <Skeleton />
          ) : (
            <>
              <span className={classes.titlePadding}>{title}</span>
              {groupChat.muteInfo?.muted && (
                <MuteIcon className={classes.muteIcon} />
              )}
            </>
          )
        }
        secondary={groupChatMembersQuery.isLoading ? <Skeleton /> : text}
        primaryTypographyProps={{ noWrap: true, className: isUnreadClass }}
        secondaryTypographyProps={{ noWrap: true, className: isUnreadClass }}
      />
    </ListItem>
  );
}
