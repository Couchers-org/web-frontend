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
  all: t("profile:reference_filter_label.all"),
  given: t("profile:reference_filter_label.given"),
});

export const referenceBadgeLabel = (t: TFunction) => ({
  [ReferenceType.REFERENCE_TYPE_FRIEND]: t(
    "profile:reference_badge_label.friend"
  ),
  [ReferenceType.REFERENCE_TYPE_HOSTED]: t(
    "profile:reference_badge_label.hosted"
  ),
  [ReferenceType.REFERENCE_TYPE_SURFED]: t(
    "profile:reference_badge_label.surfed"
  ),
});

export enum SmokingLocation {
    YES = 'yes',
    OUTSIDE = 'outside',
    NO = 'no',
    WINDOW = 'window',
    UNSPECIFIED = 'unspecified'
}

export const smokingLocationLabels = (t: TFunction) => ({
  [SmokingLocation.NO]: t("profile:smoking_location.no"),
  [SmokingLocation.OUTSIDE]: t(
    "profile:smoking_location.outside"
  ),
  [SmokingLocation.WINDOW]: t(
    "profile:smoking_location.window"
  ),
  [SmokingLocation.YES]: t("profile:smoking_location.yes"),
  [SmokingLocation.UNSPECIFIED]: t("profile:unspecified_info"),
});

export enum HostingStatus {
    CAN = 'can_host',
    MAYBE = 'maybe',
    CANT = 'cant_host',
    UNSPECIFIED = 'unspecified'
}

export const hostingStatusLabels = (t: TFunction) => ({
  [HostingStatus.CAN]: t("global:hosting_status.can_host"),
  [HostingStatus.MAYBE]: t("global:hosting_status.maybe"),
  [HostingStatus.CANT]: t(
    "global:hosting_status.cant_host"
  ),
  [HostingStatus.UNSPECIFIED]: t(
    "global:hosting_status.unspecified_info"
  ),
});


export enum MeetupStatus {
    CAN = 'wants_to_meetup',
    MAYBE = 'open_to_meetup',
    WONT = 'does_not_want_to_meetup',
    UNSPECIFIED = 'unspecified'
}

export const meetupStatusLabels = (t: TFunction) => ({
  [MeetupStatus.CAN]: t(
    "global:meetup_status.wants_to_meetup"
  ),
  [MeetupStatus.MAYBE]: t(
    "global:meetup_status.open_to_meetup"
  ),
  [MeetupStatus.WONT]: t(
    "global:meetup_status.does_not_want_to_meetup"
  ),
  [MeetupStatus.UNSPECIFIED]: t(
    "global:meetup_status.unspecified_info"
  ),
});

export enum SleepingArrangement {
    PRIVATE = 'private',
    COMMON = 'common',
    SHARED_SPACE = 'shared_space',
    SHARED_ROOM = 'shared_room',
    UNSPECIFIED = 'unspecified'
}

export const sleepingArrangementLabels = (t: TFunction) => ({
  [SleepingArrangement.PRIVATE]: t(
    "profile:sleeping_arrangement.private"
  ),
  [SleepingArrangement.COMMON]: t(
    "profile:sleeping_arrangement.common"
  ),
  [SleepingArrangement.SHARED_ROOM]: t(
    "profile:sleeping_arrangement.shared_room"
  ),
  [SleepingArrangement.SHARED_SPACE]: t(
    "profile:sleeping_arrangement.shared_space"
  ),
  [SleepingArrangement.UNSPECIFIED]: t(
    "profile:unspecified_info"
  )
});

export enum ParkingDetails {
    FREE_ONSITE = 'free_onsite',
    FREE_OFFSITE = 'free_offsite',
    PAID_ONSITE = 'paid_onsite',
    PAID_OFFSITE = 'paid_offsite',
    UNSPECIFIED = 'unspecified'
}

export const parkingDetailsLabels = (t: TFunction) => ({
  [ParkingDetails.FREE_ONSITE]: t(
    "profile:parking_details.free_onsite"
  ),
  [ParkingDetails.FREE_OFFSITE]: t(
    "profile:parking_details.free_offsite"
  ),
  [ParkingDetails.PAID_ONSITE]: t(
    "profile:parking_details.paid_onsite"
  ),
  [ParkingDetails.PAID_OFFSITE]: t(
    "profile:parking_details.paid_offsite"
  ),
  [ParkingDetails.UNSPECIFIED]: t("profile:unspecified_info"),
});

export function booleanConversion(t: TFunction, value: boolean | undefined) {
  return value === undefined
    ? t("profile:info_unanswered")
    : value
    ? t("global:yes")
    : t("global:no");
}
