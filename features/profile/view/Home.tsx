import { Typography } from "@material-ui/core";
import Divider from "components/Divider";
import LabelAndText from "components/LabelAndText";
import Markdown from "components/Markdown";
import {
  booleanConversion,
  parkingDetailsLabels,
  sleepingArrangementLabels,
  smokingLocationLabels,
} from "features/profile/constants";
import { useTranslation } from "i18n";
import { GLOBAL, PROFILE } from "i18n/namespaces";
import { User } from "types/User.type";
import makeStyles from "utils/makeStyles";

const useStyles = makeStyles((theme) => ({
  info: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "50%",
  },
  root: {
    display: "flex",
    justifyContent: "space-between",
  },

  marginTop3: {
    marginTop: theme.spacing(3),
  },
}));

interface HomeProps {
  user: User;
}

export default function Home({ user }: HomeProps) {
  const { t } = useTranslation([GLOBAL, PROFILE]);
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <div className={classes.info}>
          <Typography variant="h1">
            {t("profile:home_info_headings.hosting_preferences")}
          </Typography>
          <LabelAndText
            label={t("profile:home_info_headings.last_minute")}
            text={booleanConversion(t, user.lastMinute)}
          />
          <LabelAndText
            label={t("profile:home_info_headings.wheelchair")}
            text={booleanConversion(t, user.wheelchairAccessible)}
          />
          <LabelAndText
            label={t("profile:edit_home_questions.accept_camping")}
            text={booleanConversion(t, user.campingOk)}
          />
          <LabelAndText
            label={t("profile:home_info_headings.max_guests")}
            text={`${user.maxGuests || t("profile:unspecified_info")}`}
          />
          <LabelAndText
            label={t("profile:edit_home_questions.accept_kids")}
            text={booleanConversion(t, user.acceptsKids)}
          />
          <LabelAndText
            label={t("profile:edit_home_questions.accept_pets")}
            text={booleanConversion(t, user.acceptsPets)}
          />
          <LabelAndText
            label={t("profile:edit_home_questions.accept_drinking")}
            text={booleanConversion(t, user.drinkingAllowed)}
          />
          <LabelAndText
            label={t("profile:edit_home_questions.accept_smoking")}
            text={`${smokingLocationLabels(t)[user.smokingAllowed]}`}
          />
        </div>
        <div className={classes.info}>
          <Typography variant="h1">
            {t("profile:home_info_headings.my_home")}
          </Typography>
          <LabelAndText
            label={t("profile:home_info_headings.space")}
            text={`${sleepingArrangementLabels(t)[user.sleepingArrangement]}`}
          />
          <LabelAndText
            label={t("profile:home_info_headings.parking")}
            text={booleanConversion(t, user.parking)}
          />
          <LabelAndText
            label={t("profile:home_info_headings.parking_details")}
            text={parkingDetailsLabels(t)[user.parkingDetails]}
          />
          <LabelAndText
            label={t("profile:home_info_headings.has_housemates")}
            text={`${booleanConversion(t, user.hasHousemates)}${
              user.housemateDetails
                ? `, ${user.housemateDetails}`
                : ""
            }`}
          />
          <LabelAndText
            label={t("profile:home_info_headings.host_kids")}
            text={`${booleanConversion(t, user.hasKids)}${
              user.kidDetails ? `, ${user.kidDetails}` : ""
            }`}
          />
          <LabelAndText
            label={t("profile:home_info_headings.host_pets")}
            text={`${booleanConversion(t, user.hasPets)}${
              user.petDetails ? `, ${user.petDetails}` : ""
            }`}
          />
          <LabelAndText
            label={t("profile:home_info_headings.host_drinking")}
            text={booleanConversion(t, user.drinksAtHome)}
          />
          <LabelAndText
            label={t("profile:home_info_headings.host_smoking")}
            text={booleanConversion(t, user.smokesAtHome)}
          />
        </div>
      </div>
      <Divider className={classes.marginTop3} />
      {user.aboutPlace && (
        <>
          <Typography variant="h1">
            {t("profile:home_info_headings.about_home")}
          </Typography>
          <Markdown source={user.aboutPlace} />
          <Divider className={classes.marginTop3} />
        </>
      )}
      {user.area && (
        <>
          <Typography variant="h1">
            {t("profile:home_info_headings.local_area")}
          </Typography>
          <Markdown source={user.area} />
          <Divider className={classes.marginTop3} />
        </>
      )}
      {user.sleepingDetails && (
        <>
          <Typography variant="h1">
            {t("profile:home_info_headings.sleeping_arrangement")}
          </Typography>
          <Markdown source={user.sleepingDetails} />
          <Divider className={classes.marginTop3} />
        </>
      )}
      {user.houseRules && (
        <>
          <Typography variant="h1">
            {t("profile:home_info_headings.house_rules")}
          </Typography>
          <Markdown source={user.houseRules} />
          <Divider className={classes.marginTop3} />
        </>
      )}
      {user.otherHostInfo && (
        <>
          <Typography variant="h1">
            {t("profile:heading.additional_information_section")}
          </Typography>
          <Markdown source={user.otherHostInfo} />
        </>
      )}
    </>
  );
}
