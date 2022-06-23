import { UserDetail } from "api";
import client from "service/rest/client";

/**
 * Login user using password
 */
export async function passwordLogin(username: string, password: string) {
  const res = await client.login({
    tokenCreate: { email: username, password },
  });
  return res;
}

/**
 * Returns User record of logged in user
 */
export async function getCurrentUser() {
  const user = await client.users.usersMeRetrieve();
  return user;
}

/**
 * Returns User record by Username or id
 */
export async function getUser(user: string): Promise<UserDetail> {
  const userId = parseInt(user, 10);
  // @todo: if we don't need to fetch by username ,remove this, otherwise ask team for supporting it
  if (Number.isNaN(userId)) {
    throw new Error(
      "Only numeric IDs supported by `usersRetrieve` API type for now"
    );
  }
  return client.users.usersRetrieve({ id: userId });
}

/**
 * Updates user profile
 */
// export async function updateProfile(
//   profile
// ) {

// }

// export function updateAvatar(avatarKey: string) {
// }

// export function updateHostingPreference(preferences: HostingPreferenceData) {
// }

/**
 * Logout user
 */
export function logout() {
  return client.logout();
}
