import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { service } from "service";
import wrapper from "test/hookWrapper";
import { MockedService, t } from "test/utils";

import ResetPassword from "./ResetPassword";

const resetPasswordMock = service.account.resetPassword as MockedService<
  typeof service.account.resetPassword
>;

describe("ResetPassword", () => {
  beforeEach(() => {
    resetPasswordMock.mockResolvedValue();
  });

  it("shows the reset password form correctly", async () => {
    render(<ResetPassword />, { wrapper });

    expect(
      screen.getByRole("heading", { level: 1, name: t("auth:reset_password") })
    ).toBeVisible();
    expect(
      screen.getByLabelText(t("auth:reset_password_form.enter_email"))
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: t("global:submit") })
    ).toBeVisible();

    // Does not show error state or success message, since we've done nothing yet
    expect(
      screen.queryByText(t("auth:reset_password_form.success_message"))
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not try to submit the reset password form if the field is not filled in", async () => {
    render(<ResetPassword />, { wrapper });

    userEvent.click(screen.getByRole("button", { name: t("global:submit") }));

    await waitFor(() => {
      expect(resetPasswordMock).not.toHaveBeenCalled();
    });
  });

  it("submits the reset password request successfully", async () => {
    render(<ResetPassword />, { wrapper });

    userEvent.type(
      screen.getByLabelText(t("auth:reset_password_form.enter_email")),
      "test"
    );
    userEvent.click(screen.getByRole("button", { name: t("global:submit") }));

    expect(
      await screen.findByText(t("auth:reset_password_form.success_message"))
    ).toBeVisible();
    expect(resetPasswordMock).toHaveBeenCalledTimes(1);
    expect(resetPasswordMock).toHaveBeenCalledWith("test");
  });

  it("submits the reset password request even if the username is typed in mixed casing", async () => {
    render(<ResetPassword />, { wrapper });

    userEvent.type(
      screen.getByLabelText(t("auth:reset_password_form.enter_email")),
      "TeST"
    );
    userEvent.click(screen.getByRole("button", { name: t("global:submit") }));

    expect(
      await screen.findByText(t("auth:reset_password_form.success_message"))
    ).toBeVisible();
    expect(resetPasswordMock).toHaveBeenCalledTimes(1);
    expect(resetPasswordMock).toHaveBeenCalledWith("test");
  });

  it("shows an error alert if the reset password request failed", async () => {
    jest.spyOn(console, "error").mockReturnValue(undefined);
    resetPasswordMock.mockRejectedValue({
      errors: { email: ["Enter a valid email address."] },
      error_messages: ["The data submitted was invalid"],
      status_code: 400,
    });
    render(<ResetPassword />, { wrapper });

    userEvent.type(
      screen.getByLabelText(t("auth:reset_password_form.enter_email")),
      "test"
    );
    userEvent.click(screen.getByRole("button", { name: t("global:submit") }));

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toBeVisible();
    expect(errorAlert).toHaveTextContent("The data submitted was invalid");
    expect(
      screen.queryByText(t("auth:reset_password_form.success_message"))
    ).not.toBeInTheDocument();
  });
});
