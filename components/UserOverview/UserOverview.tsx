import { Card, CardActions, Typography } from "@material-ui/core";
import Avatar from "components/Avatar";
import BarWithHelp from "components/Bar/BarWithHelp";
import Divider from "components/Divider";
import { CouchIcon, LocationIcon } from "components/Icons";
import IconText from "components/IconText";
import {
  hostingStatusLabels,
  meetupStatusLabels,
} from "features/profile/constants";
import { useTranslation } from "i18n";
import { GLOBAL, PROFILE } from "i18n/namespaces";
import { HostingStatus, MeetupStatus } from "proto/api_pb";
import React from "react";
import makeStyles from "utils/makeStyles";

import { useProfileUser } from "../../features/profile/hooks/useProfileUser";
import {
  ReferencesLastActiveLabels,
  ResponseRateLabel,
} from "../../features/profile/view/userLabels";
import { HTML_SYMBOLS } from "../constants";

const useStyles = makeStyles((theme) => ({
  card: {
    flexShrink: 0,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      marginBottom: theme.spacing(1),
      width: "100%",
    },
  },

  info: {
    marginTop: theme.spacing(0.5),
  },

  intro: {
    wordBreak: "break-word",
    overflowWrap: "break-word",
  },

  wrapper: {
    marginTop: theme.spacing(2),
    "& h1": {
      marginBottom: theme.spacing(0.5),
    },
  },

  cardActions: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    padding: "0px",
    "& > *": {
      margin: theme.spacing(0.5),
    },
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(0.5),
      marginTop: theme.spacing(1.5),
    },
    "& > button": {
      fontWeight: "bold",
      padding: theme.spacing(1.6),
    },
  },

  avatarContainer: {
    maxWidth: "75%",
    margin: "0 auto",
  },
}));

type UserOverviewProps = {
  showHostAndMeetAvailability: boolean;
  actions?: React.ReactNode;
};

export default function UserOverview({
  showHostAndMeetAvailability,
  actions,
}: UserOverviewProps) {
  const { t } = useTranslation([GLOBAL, PROFILE]);
  const classes = useStyles();
  const user = useProfileUser();
  const { username, name, city } = user;

  return (
    <Card className={classes.card}>
      <div className={classes.avatarContainer}>
        <Avatar user={user} grow />
      </div>

      <div className={classes.wrapper}>
        <Typography variant="h1" className={classes.intro} align={"left"}>
          {name}
        </Typography>
        <Typography
          color={"textSecondary"}
        >{`${HTML_SYMBOLS["@"]}${username}`}</Typography>
      </div>

      <Divider />

      <Typography color={"primary"} variant="body1" className={classes.intro}>
        {city}
      </Typography>

      <Divider />

      {showHostAndMeetAvailability && (
        <>
          <IconText
            icon={CouchIcon}
            text={
              hostingStatusLabels(t)[
                user.hostingStatus || HostingStatus.HOSTING_STATUS_UNKNOWN
              ]
            }
          />
          <IconText
            icon={LocationIcon}
            text={
              meetupStatusLabels(t)[
                user.meetupStatus || MeetupStatus.MEETUP_STATUS_UNKNOWN
              ]
            }
          />
        </>
      )}

      {Boolean(showHostAndMeetAvailability || actions) && (
        <Divider spacing={2} />
      )}

      {actions && (
        <>
          <CardActions className={classes.cardActions}>{actions}</CardActions>
          <Divider spacing={2} />
        </>
      )}

      {process.env.NEXT_PUBLIC_IS_VERIFICATION_ENABLED && (
        <>
          <BarWithHelp
            value={user.communityStanding || 0}
            label={t("global:community_standing")}
            description={t("global:community_standing_description")}
          />
          <BarWithHelp
            value={user.verification || 0}
            label={t("global:verification_score")}
            description={t("global:verification_score_description")}
          />
          <Divider spacing={2} />
        </>
      )}
      <div className={classes.info}>
        <ReferencesLastActiveLabels user={user} />
        <ResponseRateLabel user={user} />
      </div>
    </Card>
  );
}
