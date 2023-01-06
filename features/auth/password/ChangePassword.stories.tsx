import { Meta, Story } from "@storybook/react";
import ChangePassword from "features/auth/password/ChangePassword";
import React from "react";
import { mockedService } from "stories/serviceMocks";

export default {
  component: ChangePassword,
  title: "Me/Auth/ChangePasswordPage",
} as Meta;

interface ChangePasswordArgs {
  shouldChangePasswordSucceed?: boolean;
}

const Template: Story<ChangePasswordArgs> = ({
  shouldChangePasswordSucceed = true,
} = {}) => {
  setMocks({
    shouldChangePasswordSucceed,
  });
  return <ChangePassword />;
};

export const Success = Template.bind({});

export const Failed = Template.bind({});
Failed.args = {
  shouldChangePasswordSucceed: false,
};

function setMocks({
  shouldChangePasswordSucceed,
}: Required<ChangePasswordArgs>) {
  mockedService.account.changePassword = () =>
    shouldChangePasswordSucceed
      ? Promise.resolve()
      : Promise.reject({
          error_messages: ["Error completing password change"],
          status_code: 500,
        });
}
