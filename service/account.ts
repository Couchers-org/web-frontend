import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import {
  ChangeEmailReq,
  ChangePasswordReq,
  FillContributorFormReq,
} from "proto/account_pb";
import {
  CompletePasswordResetReq,
  ConfirmChangeEmailReq,
  ContributorForm as ContributorFormPb,
  ResetPasswordReq,
} from "proto/auth_pb";
import client from "service/client";

import { contributorFormFromObject } from "./auth";

export async function getAccountInfo() {
  const res = await client.account.getAccountInfo(new Empty());
  return res.toObject();
}

export function resetPassword(userId: string) {
  const req = new ResetPasswordReq();
  req.setUser(userId);
  return client.auth.resetPassword(req);
}

export function completePasswordReset(resetToken: string) {
  const req = new CompletePasswordResetReq();
  req.setPasswordResetToken(resetToken);
  return client.auth.completePasswordReset(req);
}

export function changePassword(oldPassword: string, newPassword: string) {
  const req = new ChangePasswordReq();
  req.setOldPassword(oldPassword);
  req.setNewPassword(newPassword);
  return client.account.changePassword(req);
}

export function changeEmail(newEmail: string, currentPassword: string) {
  const req = new ChangeEmailReq();
  req.setPassword(currentPassword);
  req.setNewEmail(newEmail);
  return client.account.changeEmail(req);
}

export async function confirmChangeEmail(resetToken: string) {
  const req = new ConfirmChangeEmailReq();
  req.setChangeEmailToken(resetToken);
  return (await client.auth.confirmChangeEmail(req)).toObject();
}

export async function getContributorFormInfo() {
  const res = await client.account.getContributorFormInfo(new Empty());
  return res.toObject();
}

export async function fillContributorForm(form: ContributorFormPb.AsObject) {
  const res = await client.account.fillContributorForm(
    new FillContributorFormReq().setContributorForm(
      contributorFormFromObject(form)
    )
  );
  return res.toObject();
}
