import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { loginRoute } from "routes";
import { service } from "service";
import wrapper from "test/hookWrapper";
import { MockedService, t } from "test/utils";

import CompleteResetPassword from "./CompleteResetPassword";

const completePasswordResetMock = service.account
  .completePasswordReset as MockedService<
  typeof service.account.completePasswordReset
>;

describe("CompleteResetPassword", () => {
  beforeEach(async () => {
    completePasswordResetMock.mockResolvedValue();
    mockRouter.setCurrentUrl("?uid=test-uid&token=test-token");
    render(<CompleteResetPassword />, { wrapper });
  });

  it("shows the change password form", async () => {
    expect(
      screen.getByRole("heading", {
        name: t("auth:jail_set_password_form.title"),
      })
    ).toBeVisible();
    expect(
      screen.getByLabelText(t("auth:change_password_form.new_password"))
    ).toBeVisible();
    expect(
      screen.getByLabelText(t("auth:change_password_form.confirm_password"))
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: t("global:submit") })
    ).toBeVisible();
  });

  it("does not try to submit the form if the new and confirm password values don't match", async () => {
    userEvent.type(
      await screen.findByLabelText(t("auth:change_password_form.new_password")),
      "password"
    );
    userEvent.type(
      screen.getByLabelText(t("auth:change_password_form.confirm_password")),
      "password1"
    );
    userEvent.click(screen.getByRole("button", { name: t("global:submit") }));

    expect(
      await screen.findByText(
        t("auth:change_password_form.password_mismatch_error")
      )
    ).toBeVisible();
    expect(completePasswordResetMock).not.toHaveBeenCalled();
  });

  it("updates the user's password successfully", async () => {
    userEvent.type(
      screen.getByLabelText(t("auth:change_password_form.new_password")),
      "new_password"
    );
    userEvent.type(
      screen.getByLabelText(t("auth:change_password_form.confirm_password")),
      "new_password"
    );
    userEvent.click(screen.getByRole("button", { name: t("global:submit") }));

    const successAlert = await screen.findByRole("alert");
    expect(successAlert).toBeVisible();
    expect(successAlert).toHaveTextContent(
      t("auth:change_password_form.password_changed_success")
    );
    expect(completePasswordResetMock).toHaveBeenCalledTimes(1);
    expect(completePasswordResetMock).toHaveBeenCalledWith(
      "test-uid",
      "test-token",
      "new_password"
    );

    // Check form has been cleared
    expect(
      screen.queryByLabelText(t("auth:change_password_form.new_password"))
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(t("auth:change_password_form.confirm_password"))
    ).not.toBeInTheDocument();

    // Login link can be followed after password reset
    userEvent.click(
      await screen.findByRole("link", { name: t("auth:login_prompt") })
    );
    expect(mockRouter.pathname).toBe(loginRoute);
  });

  it("shows an error alert if change password request failed", async () => {
    jest.spyOn(console, "error").mockReturnValue(undefined);
    completePasswordResetMock.mockRejectedValue({
      error_messages: ["Invalid token"],
      status_code: 500,
    });

    userEvent.type(
      screen.getByLabelText(t("auth:change_password_form.new_password")),
      "new_password"
    );
    userEvent.type(
      screen.getByLabelText(t("auth:change_password_form.confirm_password")),
      "new_password"
    );
    userEvent.click(screen.getByRole("button", { name: t("global:submit") }));

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toBeVisible();
    expect(errorAlert).toHaveTextContent("Invalid token");

    expect(
      screen.queryByText(
        t("auth:change_password_form.password_changed_success")
      )
    ).not.toBeInTheDocument();
  });
});
