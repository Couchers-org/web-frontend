import { Typography } from "@material-ui/core";
import { User } from "api";
import Divider from "components/Divider";
import LabelAndText from "components/LabelAndText";
import Markdown from "components/Markdown";
import booleanConversion, {
  ABOUT_HOME,
  ACCEPT_CAMPING,
  ACCEPT_DRINKING,
  ACCEPT_KIDS,
  ACCEPT_PETS,
  ACCEPT_SMOKING,
  ADDITIONAL,
  HAS_HOUSEMATES,
  HOST_DRINKING,
  HOST_KIDS,
  HOST_PETS,
  HOST_SMOKING,
  HOSTING_PREFERENCES,
  HOUSE_RULES,
  LAST_MINUTE,
  LOCAL_AREA,
  MAX_GUESTS,
  MY_HOME,
  PARKING,
  PARKING_DETAILS,
  parkingDetailsLabels,
  SLEEPING_ARRANGEMENT,
  sleepingArrangementLabels,
  smokingLocationLabels,
  SPACE,
  UNSURE,
  WHEELCHAIR,
} from "features/profile/constants";
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

const getLabel = (
  labelsByKey: { [key: string]: string },
  key: string | null
): string => {
  if (key == null) {
    return UNSURE;
  }
  return labelsByKey[key];
};

interface HomeProps {
  user: User;
}

export default function Home({ user }: HomeProps) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <div className={classes.info}>
          <Typography variant="h1">{HOSTING_PREFERENCES}</Typography>
          <LabelAndText
            label={LAST_MINUTE}
            text={booleanConversion(user.lastMinute)}
          />
          <LabelAndText
            label={WHEELCHAIR}
            text={booleanConversion(user.wheelchairAccessible)}
          />
          <LabelAndText
            label={ACCEPT_CAMPING}
            text={booleanConversion(user.campingOk)}
          />
          <LabelAndText
            label={MAX_GUESTS}
            text={`${user.maxGuests || UNSURE}`}
          />
          <LabelAndText
            label={ACCEPT_KIDS}
            text={booleanConversion(user.acceptsKids)}
          />
          <LabelAndText
            label={ACCEPT_PETS}
            text={booleanConversion(user.acceptsPets)}
          />
          <LabelAndText
            label={ACCEPT_DRINKING}
            text={booleanConversion(user.drinkingAllowed)}
          />
          <LabelAndText
            label={ACCEPT_SMOKING}
            text={getLabel(smokingLocationLabels, user.smokingAllowed)}
          />
        </div>
        <div className={classes.info}>
          <Typography variant="h1">{MY_HOME}</Typography>
          <LabelAndText
            label={SPACE}
            text={getLabel(sleepingArrangementLabels, user.sleepingArrangement)}
          />
          <LabelAndText
            label={PARKING}
            text={booleanConversion(user.parking)}
          />
          <LabelAndText
            label={PARKING_DETAILS}
            text={getLabel(parkingDetailsLabels, user.parkingDetails)}
          />
          <LabelAndText
            label={HAS_HOUSEMATES}
            text={`${booleanConversion(user.hasHousemates)}${
              user.housemateDetails ? `, ${user.housemateDetails}` : ""
            }`}
          />
          <LabelAndText
            label={HOST_KIDS}
            text={`${booleanConversion(user.hasKids)}${
              user.kidDetails ? `, ${user.kidDetails}` : ""
            }`}
          />
          <LabelAndText
            label={HOST_PETS}
            text={`${booleanConversion(user.hasPets)}${
              user.petDetails ? `, ${user.petDetails}` : ""
            }`}
          />
          <LabelAndText
            label={HOST_DRINKING}
            text={booleanConversion(user.drinksAtHome)}
          />
          <LabelAndText
            label={HOST_SMOKING}
            text={booleanConversion(user.smokesAtHome)}
          />
        </div>
      </div>
      <Divider className={classes.marginTop3} />
      {user.aboutPlace && (
        <>
          <Typography variant="h1">{ABOUT_HOME}</Typography>
          <Markdown source={user.aboutPlace} />
          <Divider className={classes.marginTop3} />
        </>
      )}
      {user.area && (
        <>
          <Typography variant="h1">{LOCAL_AREA}</Typography>
          <Markdown source={user.area} />
          <Divider className={classes.marginTop3} />
        </>
      )}
      {user.sleepingDetails && (
        <>
          <Typography variant="h1">{SLEEPING_ARRANGEMENT}</Typography>
          <Markdown source={user.sleepingDetails} />
          <Divider className={classes.marginTop3} />
        </>
      )}
      {user.houseRules && (
        <>
          <Typography variant="h1">{HOUSE_RULES}</Typography>
          <Markdown source={user.houseRules} />
          <Divider className={classes.marginTop3} />
        </>
      )}
      {user.otherHostInfo && (
        <>
          <Typography variant="h1">{ADDITIONAL}</Typography>
          <Markdown source={user.otherHostInfo} />
        </>
      )}
    </>
  );
}
