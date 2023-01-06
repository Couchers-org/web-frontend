import { Meta, Story } from "@storybook/react";
import React from "react";
import { mockedService } from "stories/serviceMocks";

import ResetPassword from "./ResetPassword";

export default {
  component: ResetPassword,
  title: "Me/Auth/ResetPasswordPage",
} as Meta;

export const Success: Story = () => {
  mockedService.account.resetPassword = () => Promise.resolve();
  return <ResetPassword />;
};

export const Failed: Story = () => {
  mockedService.account.resetPassword = () =>
    Promise.reject({
      error_messages: ["Error"],
      status_code: 400,
    });
  return <ResetPassword />;
};
