import { Link as MuiLink, makeStyles, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import Alert from "components/Alert";
import Button from "components/Button";
import StyledLink from "components/StyledLink";
import useUserCommunities from "features/userQueries/useUserCommunities";
import { useTranslation } from "i18n";
import { DASHBOARD } from "i18n/namespaces";
import React from "react";
import { routeToCommunity } from "routes";

const useStyles = makeStyles((theme) => ({
  communityLink: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2, 0),
    borderBottom: `solid 1px ${theme.palette.divider}`,
    "&:first-child": {
      borderTop: `solid 1px ${theme.palette.divider}`,
    },
  },
  loadMoreButton: {
    marginTop: theme.spacing(2),
  },
}));

export default function CommunitiesList() {
  const { t } = useTranslation([DASHBOARD]);
  const classes = useStyles();
  const userCommunities = useUserCommunities();
  const communities = userCommunities;

  const hasAtLeastOnePage = (communities?.data?.pages || []).length > 0;

  return (
    <div>
      {communities.error && (
        <Alert severity="error">{communities.error.error_messages[0]}</Alert>
      )}
      {communities.isLoading ? (
        <div className={classes.communityLink}>
          <MuiLink variant="h2" component="span">
            <Skeleton width={100} />
          </MuiLink>
          <Typography variant="body2">
            <Skeleton width={100} />
          </Typography>
        </div>
      ) : (
        communities.data &&
        (hasAtLeastOnePage ? (
          <>
            {communities.data.pages
              .flatMap((page) => page.results)
              .map((community) => (
                <StyledLink
                  href={routeToCommunity(community.id, community.slug)}
                  key={`community-link-${community.id}`}
                  className={classes.communityLink}
                >
                  <Typography variant="h2" component="span">
                    {community.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {t("dashboard:member_count", {
                      count: community.user_count,
                    })}
                  </Typography>
                </StyledLink>
              ))}
            {communities.hasNextPage && (
              <Button
                onClick={() => communities.fetchNextPage()}
                loading={communities.isFetching}
                className={classes.loadMoreButton}
              >
                {t("dashboard:load_more")}
              </Button>
            )}
          </>
        ) : (
          <Typography variant="body1" color="textSecondary">
            {t("dashboard:no_community")}
          </Typography>
        ))
      )}
    </div>
  );
}
