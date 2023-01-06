import { Meta, Story } from "@storybook/react";
import React from "react";
import { mockedService } from "stories/serviceMocks";

import CompleteResetPassword from "./CompleteResetPassword";

export default {
  component: CompleteResetPassword,
  title: "Me/Auth/CompleteResetPasswordPage",
} as Meta;

interface CompleteResetPasswordArgs {
  shouldSucceed?: boolean;
}

const Template: Story<CompleteResetPasswordArgs> = ({
  shouldSucceed = true,
} = {}) => {
  setMocks({ shouldSucceed });
  return <CompleteResetPassword />;
};

export const Success = Template.bind({});

export const Failed = Template.bind({});
Failed.args = {
  shouldSucceed: false,
};

function setMocks({ shouldSucceed }: Required<CompleteResetPasswordArgs>) {
  mockedService.account.completePasswordReset = () =>
    shouldSucceed
      ? Promise.resolve()
      : Promise.reject({
          error_messages: ["Error"],
          status_code: 400,
        });
}
