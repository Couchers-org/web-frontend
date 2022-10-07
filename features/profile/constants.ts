import {
  HostingStatusEnum,
  MeetupStatusEnum,
  ParkingDetailsEnum,
  SleepingArrangementEnum,
  SmokingAllowedEnum,
} from "api";
import { TFunction } from "i18n";
import { ReferenceType } from "proto/references_pb";

export const referencesQueryStaleTime = 10 * 60 * 1000;
export const contactLink = "mailto:support@couchers.org";
export const hostRequestReferenceSuccessDialogId =
  "hostRequestReferneceSuccessDialog";

export const sectionLabels = (t: TFunction) => ({
  about: t("profile:heading.about_me"),
  home: t("profile:heading.home"),
  references: t("profile:heading.references"),
});

export const referencesFilterLabels = (t: TFunction) => ({
  [ReferenceType.REFERENCE_TYPE_FRIEND]: t(
    "profile:reference_filter_label.friend"
  ),
  [ReferenceType.REFERENCE_TYPE_HOSTED]: t(
    "profile:reference_filter_label.hosted"
  ),
  [ReferenceType.REFERENCE_TYPE_SURFED]: t(
    "profile:reference_filter_label.surfed"
  ),
  all: "All references",
  given: "Given to others",
});
export const referenceBadgeLabel = (t: TFunction) => ({
  [ReferenceType.REFERENCE_TYPE_FRIEND]: t(
    "profile:reference_badge_label.surfed"
  ),
  [ReferenceType.REFERENCE_TYPE_HOSTED]: t(
    "profile:reference_badge_label.hosted"
  ),
  [ReferenceType.REFERENCE_TYPE_SURFED]: t(
    "profile:reference_badge_label.friend"
  ),
});

export const smokingLocationLabels = (t: TFunction) => ({
  [SmokingAllowedEnum.No]: t("profile:smoking_location.no"),
  [SmokingAllowedEnum.Outside]: t(
    "profile:smoking_location.outside"
  ),
  [SmokingAllowedEnum.Window]: t(
    "profile:smoking_location.window"
  ),
  [SmokingAllowedEnum.Yes]: t("profile:smoking_location.yes"),
});

export const hostingStatusLabels = (t: TFunction) => ({
  [HostingStatusEnum.CanHost]: t("global:hosting_status.can_host"),
  [HostingStatusEnum.Maybe]: t("global:hosting_status.maybe"),
  [HostingStatusEnum.CantHost]: t(
    "global:hosting_status.cant_host"
  ),
});

export const meetupStatusLabels = (t: TFunction) => ({
  [MeetupStatusEnum.WantsToMeetup]: t(
    "global:meetup_status.wants_to_meetup"
  ),
  [MeetupStatusEnum.OpenToMeetup]: t(
    "global:meetup_status.open_to_meetup"
  ),
  [MeetupStatusEnum.DoesNotWantToMeetup]: t(
    "global:meetup_status.does_not_want_to_meetup"
  ),
});

export const sleepingArrangementLabels = (t: TFunction) => ({
  [SleepingArrangementEnum.Private]: t(
    "profile:sleeping_arrangement.private"
  ),
  [SleepingArrangementEnum.Common]: t(
    "profile:sleeping_arrangement.common"
  ),
  [SleepingArrangementEnum.SharedRoom]: t(
    "profile:sleeping_arrangement.shared_room"
  ),
  [SleepingArrangementEnum.SharedSpace]: t(
    "profile:sleeping_arrangement.shared_space"
  ),
});

export const parkingDetailsLabels = (t: TFunction) => ({
  [ParkingDetailsEnum.FreeOnsite]: t(
    "profile:parking_details.free_onsite"
  ),
  [ParkingDetailsEnum.FreeOffsite]: t(
    "profile:parking_details.free_offsite"
  ),
  [ParkingDetailsEnum.PaidOnsite]: t(
    "profile:parking_details.paid_onsite"
  ),
  [ParkingDetailsEnum.PaidOffsite]: t(
    "profile:parking_details.paid_offsite"
  ),
});

export function booleanConversion(t: TFunction, value: boolean | undefined | null) {
  return (value === undefined || value === null)
    ? t("profile:info_unanswered")
    : value
    ? t("global:yes")
    : t("global:no");
}
