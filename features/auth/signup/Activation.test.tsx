import { render, screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { userActivationRoute } from "routes";
import { service } from "service";
import wrapper from "test/hookWrapper";
import { assertErrorAlert, MockedService, t } from "test/utils";

import Activation from "./Activation";

const activateUserMock = service.auth.activateUser as MockedService<
  typeof service.auth.activateUser
>;

const View = () => {
  return <Activation />;
};

describe("User Activation", () => {
  it("activates the user", async () => {
    activateUserMock.mockResolvedValue({
      uid: "fakeUID",
      token: "fakeToken",
    });

    mockRouter.setCurrentUrl(
      `${userActivationRoute}?uid=fakeUID&token=fakeToken`
    );

    render(<View />, {
      wrapper,
    });

    await waitFor(() => {
      expect(activateUserMock).toBeCalledWith("fakeUID", "fakeToken");
    });

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: t("auth:login_prompt") })
      ).toBeVisible();
    });
  });

  it("displays invalid token errors", async () => {
    activateUserMock.mockRejectedValue({
      errors: {
        token: ["Invalid token for given user."],
      },
      error_messages: ["The data submitted was invalid"],
      status_code: 400,
    });

    mockRouter.setCurrentUrl(
      `${userActivationRoute}?uid=fakeUID&token=fakeEmailToken`
    );

    render(<View />, {
      wrapper,
    });

    await assertErrorAlert("Invalid token for given user.");
  });

  it("displays stale token errors", async () => {
    activateUserMock.mockRejectedValue({
      error_messages: ["Stale token for given user."],
      status_code: 403,
    });

    mockRouter.setCurrentUrl(
      `${userActivationRoute}?uid=fakeUID&token=fakeEmailToken`
    );

    render(<View />, {
      wrapper,
    });

    await assertErrorAlert("Stale token for given user");
  });
});
