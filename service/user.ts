import {
  NullableBoolValue,
  NullableStringValue,
  NullableUInt32Value,
  UpdateProfileReq,
//   User,
} from "proto/api_pb";
import { http } from "service";
import client from "service/client";
import { CurrentUser } from "types/CurrentUser.type";
import { User } from "types/User.type";
import { ProtoToJsTypes } from "utils/types";

export interface LoginRes {
  auth_token: string;
  user_id: number;
}

type RequiredUpdateProfileReq = Required<UpdateProfileReq.AsObject>;
type ProfileFormData = {
  [K in keyof RequiredUpdateProfileReq]: ProtoToJsTypes<
    RequiredUpdateProfileReq[K]
  >;
};

export type UpdateUserProfileData = Pick<
  ProfileFormData,
  | "name"
  | "city"
  | "hometown"
  | "lat"
  | "lng"
  | "radius"
  | "pronouns"
  | "occupation"
  | "education"
  | "aboutMe"
  | "myTravels"
  | "thingsILike"
  | "hostingStatus"
  | "meetupStatus"
  | "languageAbilities"
  | "regionsVisited"
  | "regionsLived"
  | "additionalInformation"
  | "avatarKey"
>;

export type HostingPreferenceData = Omit<
  ProfileFormData,
  keyof UpdateUserProfileData | "gender"
>;

/**
 * Login user using password
 */
export async function passwordLogin(
  username: string,
  password: string
): Promise<LoginRes> {
  return http.post(
    "login/",
    { username, password },
    { omitAuthentication: true }
  );
}


// This isn't actually used anywhere at the moment. ATM we're using getUser with the current user's id instead.
/**
 * Returns User record of logged in user
 *
 */
export async function getCurrentUser(): Promise<CurrentUser> {
    // const req = new PingReq();

    // const response = await client.api.ping(req);
        const snakeCaseRes = await http.get(
            "users/me",
        )
        return snakeToCamelKeysObject(snakeCaseRes);
  }
  

/**
 * Returns User record by Username or id
 *
 * @param {string} user
 * @returns {Promise<User.AsObject>}
 */
export async function getUser(user: string): Promise<User> {
    const snakeCaseRes = await  http.get(`users/${user}/`);
    console.log({snakeCaseRes});
    const res =  snakeToCamelKeysObject(snakeCaseRes);
    return res;
}

/**
 * Updates user profile
 */

export async function updateProfile(profile: UpdateUserProfileData): Promise<CurrentUser> {
    console.log("profile data in updateProfile: ")
    console.log({profile})
    const snakeCaseProfile = camelToSnakeKeysObject(profile);
    console.log({snakeCaseProfile})
    return http.patch(
        "users/me/",
        snakeCaseProfile
    )
}
// export async function updateProfile(
//   profile: UpdateUserProfileData
// ): Promise<Empty> {
//   const req = new UpdateProfileReq();

//   const avatarKey = profile.avatarKey
//     ? new NullableStringValue().setValue(profile.avatarKey)
//     : undefined;
//   const name = new wrappers.StringValue().setValue(profile.name);
//   const city = new wrappers.StringValue().setValue(profile.city);
//   const hometown = new NullableStringValue().setValue(profile.hometown);
//   const lat = new wrappers.DoubleValue().setValue(profile.lat);
//   const lng = new wrappers.DoubleValue().setValue(profile.lng);
//   const radius = new wrappers.DoubleValue().setValue(profile.radius);
//   const pronouns = new NullableStringValue().setValue(profile.pronouns);
//   const occupation = new NullableStringValue().setValue(profile.occupation);
//   const education = new NullableStringValue().setValue(profile.education);
//   const aboutMe = new NullableStringValue().setValue(profile.aboutMe);
//   const myTravels = new NullableStringValue().setValue(profile.myTravels);
//   const thingsILike = new NullableStringValue().setValue(profile.thingsILike);
//   const hostingStatus = profile.hostingStatus;
//   const meetupStatus = profile.meetupStatus;

//   const regionsVisited = new RepeatedStringValue().setValueList(
//     profile.regionsVisited
//   );
//   const regionsLived = new RepeatedStringValue().setValueList(
//     profile.regionsLived
//   );
//   const additionalInformation = new NullableStringValue().setValue(
//     profile.additionalInformation
//   );

//   const languageAbilities = new RepeatedLanguageAbilityValue().setValueList(
//     profile.languageAbilities.valueList.map((languageAbility) =>
//       new LanguageAbility()
//         .setCode(languageAbility.code)
//         .setFluency(languageAbility.fluency)
//     )
//   );

//   req
//     .setAvatarKey(avatarKey)
//     .setName(name)
//     .setCity(city)
//     .setHometown(hometown)
//     .setLat(lat)
//     .setLng(lng)
//     .setRadius(radius)
//     .setPronouns(pronouns)
//     .setOccupation(occupation)
//     .setEducation(education)
//     .setLanguageAbilities(languageAbilities)
//     .setAboutMe(aboutMe)
//     .setMyTravels(myTravels)
//     .setThingsILike(thingsILike)
//     .setHostingStatus(hostingStatus)
//     .setMeetupStatus(meetupStatus)
//     .setRegionsVisited(regionsVisited)
//     .setRegionsLived(regionsLived)
//     .setAdditionalInformation(additionalInformation);

//   return client.api.updateProfile(req);
// }

export function updateAvatar(avatarKey: string) {
  const req = new UpdateProfileReq();
  req.setAvatarKey(new NullableStringValue().setValue(avatarKey));
  return client.api.updateProfile(req);
}

export function updateHostingPreference(preferences: HostingPreferenceData) {
  const req = new UpdateProfileReq();

  const maxGuests =
    preferences.maxGuests !== null
      ? new NullableUInt32Value()
          .setValue(preferences.maxGuests)
          .setIsNull(false)
      : new NullableUInt32Value().setIsNull(true);
  const lastMinute = new NullableBoolValue()
    .setValue(preferences.lastMinute)
    .setIsNull(false);
  const hasPets = new NullableBoolValue()
    .setValue(preferences.hasPets)
    .setIsNull(false);
  const acceptsPets = new NullableBoolValue()
    .setValue(preferences.acceptsPets)
    .setIsNull(false);
  const petDetails = new NullableStringValue().setValue(preferences.petDetails);
  const hasKids = new NullableBoolValue()
    .setValue(preferences.hasKids)
    .setIsNull(false);
  const acceptsKids = new NullableBoolValue()
    .setValue(preferences.acceptsKids)
    .setIsNull(false);
  const kidDetails = new NullableStringValue().setValue(preferences.kidDetails);
  const hasHousemates = new NullableBoolValue()
    .setValue(preferences.hasHousemates)
    .setIsNull(false);
  const housemateDetails = new NullableStringValue().setValue(
    preferences.housemateDetails
  );
  const wheelchairAccessible = new NullableBoolValue()
    .setValue(preferences.wheelchairAccessible)
    .setIsNull(false);
  const smokingAllowed = preferences.smokingAllowed;
  const smokesAtHome = new NullableBoolValue()
    .setValue(preferences.smokesAtHome)
    .setIsNull(false);
  const drinkingAllowed = new NullableBoolValue()
    .setValue(preferences.drinkingAllowed)
    .setIsNull(false);
  const drinksAtHome = new NullableBoolValue()
    .setValue(preferences.drinksAtHome)
    .setIsNull(false);
  const otherHostInfo = new NullableStringValue().setValue(
    preferences.otherHostInfo
  );
  const sleepingArrangement = preferences.sleepingArrangement;
  const sleepingDetails = new NullableStringValue().setValue(
    preferences.sleepingDetails
  );
  const area = new NullableStringValue().setValue(preferences.area);
  const houseRules = new NullableStringValue().setValue(preferences.houseRules);
  const parking = new NullableBoolValue()
    .setValue(preferences.parking)
    .setIsNull(false);
  const parkingDetails = preferences.parkingDetails;
  const campingOk = new NullableBoolValue()
    .setValue(preferences.campingOk)
    .setIsNull(false);
  const aboutPlace = new NullableStringValue().setValue(preferences.aboutPlace);

  req
    .setMaxGuests(maxGuests)
    .setLastMinute(lastMinute)
    .setHasPets(hasPets)
    .setAcceptsPets(acceptsPets)
    .setPetDetails(petDetails)
    .setHasKids(hasKids)
    .setAcceptsKids(acceptsKids)
    .setKidDetails(kidDetails)
    .setHasHousemates(hasHousemates)
    .setHousemateDetails(housemateDetails)
    .setWheelchairAccessible(wheelchairAccessible)
    .setSmokingAllowed(smokingAllowed)
    .setSmokesAtHome(smokesAtHome)
    .setDrinkingAllowed(drinkingAllowed)
    .setDrinksAtHome(drinksAtHome)
    .setOtherHostInfo(otherHostInfo)
    .setSleepingArrangement(sleepingArrangement)
    .setSleepingDetails(sleepingDetails)
    .setArea(area)
    .setHouseRules(houseRules)
    .setParking(parking)
    .setParkingDetails(parkingDetails)
    .setCampingOk(campingOk)
    .setAboutPlace(aboutPlace);

  return client.api.updateProfile(req);
}

/**
 * Logout user
 */
export function logout() {
  return http.post("logout/", {});
}


export function snakeToCamelKeysObject(object: any) {

    function snakeToCamel(str: string){
        return str.toLowerCase().replace(/([-_][a-z])/g, group =>
        group
          .toUpperCase()
          .replace('-', '')
          .replace('_', '')
      );
    }
    const camelCaseObj: any  = {};
    for (const snakeCaseKey of Object.keys(object)) {
      const newKey = snakeToCamel(snakeCaseKey);
      camelCaseObj[newKey as keyof typeof camelCaseObj] = object[snakeCaseKey];
    }
    return camelCaseObj;
  }

export function camelToSnakeKeysObject(object: any) {
    const snakeCaseObj: any  = {};
    function camelToSnake(str: string) {
        return str.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
    }

    for (const snakeCaseKey of Object.keys(object)) {
      const newKey = camelToSnake(snakeCaseKey);
      snakeCaseObj[newKey as keyof typeof snakeCaseObj] = object[snakeCaseKey];
    }
    return snakeCaseObj;
}
