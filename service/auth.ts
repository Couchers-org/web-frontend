import {
  ConfirmDeleteAccountReq,
  LoginReq,
  RecoverAccountReq,
  UnsubscribeReq,
  UsernameValidReq,
} from "proto/auth_pb";
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

interface CreateSignupFlowReq {
  email: string;
  name: string;
  password: string;
}

interface CreateUserReq {
  email: string;
  username: string;
  password: string;
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
) {
  return client.post<CreateUserReq, CreateUserRes>("users/", {
    username,
    email,
    password,
  });
}

export async function checkUsername(username: string) {
  const req = new LoginReq();
  req.setUser(username);
  const res = await client.auth.login(req);
  return res.getNextStep();
}

export async function startSignup(
  name: string,
  email: string,
  password: string
) {
  return client.post<CreateSignupFlowReq, SignupFlowRes>("signup_flows/", {
    name,
    email,
    password,
  });
}

export async function signupFlowAccount(
  flowToken: string,
  accountDetails: AccountDetails
): Promise<SignupFlowRes> {
  return client.patch(`signup_flows/${flowToken}/`, {
    username: accountDetails.username,
    birthdate: accountDetails.birthdate,
    city: accountDetails.city,
    geom: accountDetails.geom,
    geom_radius: accountDetails.geomRadius,
    hosting_status: accountDetails.hostingStatus,
    gender: accountDetails.gender,
    accepted_tos: accountDetails.acceptedTOS,
  });
}

export async function signupFlowFeedback(
  flowToken: string,
  feedback: Feedback
): Promise<SignupFlowRes> {
  return client.patch(`signup_flows/${flowToken}/`, {
    filled_feedback: true,
    ideas: feedback.ideas,
    features: feedback.features,
    experience: feedback.experience,
    contribute: feedback.contribute,
    contribute_ways: feedback.contributeWaysList,
    expertise: feedback.expertise,
  });
}

export async function activateUser(uid: string, token: string) {
  return client.post<ActivateUserReq, ActivateUserRes>("users/activation/", {
    uid,
    token,
  });
}

export async function signupFlowCommunityGuidelines(
  flowToken: string,
  guidelinesVersion: number
): Promise<SignupFlowRes> {
  return client.patch(`signup_flows/${flowToken}/`, {
    accepted_community_guidelines: guidelinesVersion,
  });
}

export async function validateUsername(username: string) {
  const req = new UsernameValidReq();
  req.setUsername(username);
  const res = await client.auth.usernameValid(req);
  return res.getValid();
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
