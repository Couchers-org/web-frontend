import { User } from "api";
import LabelAndText from "components/LabelAndText";
import {
  AGE_GENDER,
  EDUCATION,
  HOMETOWN,
  JOINED,
  LANGUAGES_FLUENT,
  LANGUAGES_FLUENT_FALSE,
  LAST_ACTIVE,
  LAST_ACTIVE_FALSE,
  LOCAL_TIME,
  OCCUPATION,
  REFERENCES,
} from "features/profile/constants";
import { useLanguages } from "features/profile/hooks/useLanguages";
import { responseRateKey } from "features/queryKeys";
import { useTranslation } from "i18n";
import { COMMUNITIES, GLOBAL } from "i18n/namespaces";
import { useQuery } from "react-query";
import { service } from "service";
import { dateTimeFormatter } from "utils/date";
import dayjs from "utils/dayjs";
import { hourMillis, lessThanHour, timeAgo } from "utils/timeAgo";

interface Props {
  user: User;
}

export const ReferencesLastActiveLabels = ({ user }: Props) => {
  /* @todo: fetch the num references using endpoint or whenever it's added to `user` */
  const numReferences = 0;
  /* @todo: read lastActive from user when it's made available */
  const lastActive = new Date();
  return (
    <>
      <LabelAndText label={REFERENCES} text={`${numReferences || 0}`} />
      <LabelAndText
        label={LAST_ACTIVE}
        text={
          lastActive
            ? timeAgo(lastActive, {
                millis: hourMillis,
                text: lessThanHour,
              })
            : LAST_ACTIVE_FALSE
        }
      />
    </>
  );
};

export const ResponseRateLabel = ({ user }: Props) => {
  const { t } = useTranslation("profile");
  const query = useQuery(responseRateKey(user.id), () =>
    service.requests.getResponseRate(user.id)
  );

  let rateText = undefined;
  let timeText = undefined;

  if (query?.data?.insufficientData) {
    rateText = t("response_rate_text_insufficient");
  } else if (query?.data?.low) {
    rateText = t("response_rate_text_low");
  } else if (query?.data?.some) {
    rateText = t("response_rate_text_some");
    timeText = t("response_time_text_some", {
      p33: dayjs
        .duration(query.data.some.responseTimeP33!.seconds, "second")
        .humanize(),
    });
  } else if (query?.data?.most) {
    rateText = t("response_rate_text_most");
    timeText = t("response_time_text_most", {
      p33: dayjs
        .duration(query.data.most.responseTimeP33!.seconds, "second")
        .humanize(),
      p66: dayjs
        .duration(query.data.most.responseTimeP66!.seconds, "second")
        .humanize(),
    });
  } else if (query?.data?.almostAll) {
    rateText = t("response_rate_text_almost_all");
    timeText = t("response_time_text_almost_all", {
      p33: dayjs
        .duration(query.data.almostAll.responseTimeP33!.seconds, "second")
        .humanize(),
      p66: dayjs
        .duration(query.data.almostAll.responseTimeP66!.seconds, "second")
        .humanize(),
    });
  }

  return (
    <>
      <LabelAndText label={t("response_rate_label")} text={rateText ?? ""} />
      {timeText && (
        <LabelAndText label={t("response_time_label")} text={timeText} />
      )}
    </>
  );
};

export const AgeGenderLanguagesLabels = ({ user }: Props) => {
  const { languages } = useLanguages();

  return (
    <>
      <LabelAndText
        label={AGE_GENDER}
        text={`${user.age || "-"} / ${user.gender} ${
          user.pronouns ? `(${user.pronouns})` : ""
        }`}
      />
      {/* @todo: fetch languages */}
      {/* {languages && (
        <LabelAndText
          label={LANGUAGES_FLUENT}
          text={
            user.languageAbilitiesList
              .map((ability) => languages[ability.code])
              .join(", ") || LANGUAGES_FLUENT_FALSE
          }
        />
      )} */}
    </>
  );
};

export const RemainingAboutLabels = ({ user }: Props) => {
  const {
    i18n: { language: locale },
  } = useTranslation([GLOBAL, COMMUNITIES]);

  return (
    <>
      {user.hometown && <LabelAndText label={HOMETOWN} text={user.hometown} />}
      {user.occupation && (
        <LabelAndText label={OCCUPATION} text={user.occupation} />
      )}
      {user.education && (
        <LabelAndText label={EDUCATION} text={user.education} />
      )}
      {user.createdAt && (
        <LabelAndText
          label={JOINED}
          text={
            user.createdAt
              ? dateTimeFormatter(locale).format(new Date(user.createdAt))
              : ""
          }
        />
      )}
      {user.timezoneArea && (
        <LabelAndText
          label={LOCAL_TIME}
          text={dayjs().tz(user.timezoneArea).format("LT")}
        />
      )}
    </>
  );
};
