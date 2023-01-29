import { Skeleton } from "@material-ui/lab";
import { CouchIcon } from "components/Icons";
import IconText from "components/IconText";
import { HostingStatus as Status, hostingStatusLabels } from "features/profile/constants";
import { useTranslation } from "i18n";
import { GLOBAL } from "i18n/namespaces";
import React from "react";
import makeStyles from "utils/makeStyles";

const useStyles = makeStyles({
  hostingAbilityContainer: {
    alignItems: "center",
    display: "flex",
  },
});

export interface HostingStatusProps {
  hostingStatus?: Status;
}

export default function HostingStatus({ hostingStatus }: HostingStatusProps) {
  const { t } = useTranslation([GLOBAL]);
  const classes = useStyles();

  return (
    <div className={classes.hostingAbilityContainer}>
      {hostingStatus ? (
        <IconText
          icon={CouchIcon}
          text={hostingStatusLabels(t)[hostingStatus]}
        />
      ) : (
        <Skeleton width={100} />
      )}
    </div>
  );
}
