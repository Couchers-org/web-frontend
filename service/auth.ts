import {
  ConfirmDeleteAccountReq,
  RecoverAccountReq,
  UnsubscribeReq,
} from "proto/auth_pb";
import { http } from "service";
import client from "service/client";

export type HostingStatus = "can_host" | "maybe" | "cant_host";

export type ContributeOption = "yes" | "maybe" | "no" | null;

export interface Feedback {
  ideas?: string;
  features?: string;
  experience?: string;
  contribute?: ContributeOption;
  contributeWaysList?: Array<string>;
  expertise?: string;
}

export interface AccountDetails {
  username: string;
  birthdate: string;
  city: string;
  geom: string;
  geomRadius: number;
  hostingStatus: HostingStatus;
  gender: string;
  acceptedTOS: number;
}

export interface SignupFlowRes {
  flow_token: string;
  user_created?: true;
  account_is_filled?: boolean;
  accepted_current_community_guidelines?: boolean;
  created_at?: string;
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  birthdate?: string;
  gender?: string;
  hosting_status?: HostingStatus;
  city?: string;
  geom?: string;
  geom_radius?: number;
  accepted_tos?: number;
  filled_feedback?: boolean;
  ideas?: string;
  features?: string;
  experience?: string;
  contribute?: string;
  contribute_ways?: string[];
  expertise?: string;
  accepted_community_guidelines?: number;
}

interface CreateUserRes {
  email: string;
  username: string;
  id: number;
}

export interface ActivateUserReq {
  uid: string;
  token: string;
}

export interface ActivateUserRes {
  uid: string;
  token: string;
}

export async function createUser(
  username: string,
  email: string,
  password: string
): Promise<CreateUserRes> {
  return http.post(
    "users/",
    {
      username,
      email,
      password,
    },
    { omitAuthentication: true }
  );
}

export async function startSignup(
  name: string,
  email: string,
  password: string
): Promise<SignupFlowRes> {
  return http.post(
    "signup_flows/",
    {
      name,
      email,
      password,
    },
    { omitAuthentication: true }
  );
}

export async function signupFlowAccount(
  flowToken: string,
  accountDetails: AccountDetails
): Promise<SignupFlowRes> {
  return http.patch(
    `signup_flows/${flowToken}/`,
    {
      username: accountDetails.username,
      birthdate: accountDetails.birthdate,
      city: accountDetails.city,
      geom: accountDetails.geom,
      geom_radius: accountDetails.geomRadius,
      hosting_status: accountDetails.hostingStatus,
      gender: accountDetails.gender,
      accepted_tos: accountDetails.acceptedTOS,
    },
    { omitAuthentication: true }
  );
}

export async function signupFlowFeedback(
  flowToken: string,
  feedback: Feedback
): Promise<SignupFlowRes> {
  return http.patch(
    `signup_flows/${flowToken}/`,
    {
      filled_feedback: true,
      ideas: feedback.ideas,
      features: feedback.features,
      experience: feedback.experience,
      contribute: feedback.contribute,
      contribute_ways: feedback.contributeWaysList,
      expertise: feedback.expertise,
    },
    { omitAuthentication: true }
  );
}

export async function activateUser(
  uid: string,
  token: string
): Promise<ActivateUserRes> {
  return http.post(
    "users/activation/",
    {
      uid,
      token,
    },
    { omitAuthentication: true }
  );
}

export async function signupFlowCommunityGuidelines(
  flowToken: string,
  guidelinesVersion: number
): Promise<SignupFlowRes> {
  return http.patch(
    `signup_flows/${flowToken}/`,
    {
      accepted_community_guidelines: guidelinesVersion,
    },
    { omitAuthentication: true }
  );
}

export async function validateUsername(username: string) {
  return http.post("users/", { username }, { omitAuthentication: true });
}

export async function unsubscribe(payload: string, sig: string) {
  const req = new UnsubscribeReq();
  req.setPayload(payload);
  req.setSig(sig);
  const res = await client.auth.unsubscribe(req);
  return res.toObject();
}

export async function confirmDeleteAccount(token: string) {
  const req = new ConfirmDeleteAccountReq();
  req.setToken(token);
  await client.auth.confirmDeleteAccount(req);
}

export async function recoverAccount(token: string) {
  const req = new RecoverAccountReq();
  req.setToken(token);
  await client.auth.recoverAccount(req);
}
