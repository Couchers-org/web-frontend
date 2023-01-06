import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangePassword from "features/auth/password/ChangePassword";
import { service } from "service";
import wrapper from "test/hookWrapper";
import { MockedService, t } from "test/utils";

const changePasswordMock = service.account.changePassword as MockedService<
  typeof service.account.changePassword
>;

describe("ChangePassword", () => {
  beforeEach(() => {
    changePasswordMock.mockResolvedValue();
    render(<ChangePassword />, { wrapper });
  });

  it("shows the change password form", async () => {
    expect(
      screen.getByRole("heading", {
        name: t("auth:change_password_form.title"),
      })
    ).toBeVisible();
    expect(
      await screen.findByLabelText(t("auth:change_password_form.old_password"))
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

  it("does not try to submit the form if the user doesn't provide its old password", async () => {
    userEvent.click(
      await screen.findByRole("button", { name: t("global:submit") })
    );

    await waitFor(() => {
      expect(changePasswordMock).not.toHaveBeenCalled();
    });
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
    expect(changePasswordMock).not.toHaveBeenCalled();
  });

  it("updates the user's password successfully if a new password has been given", async () => {
    userEvent.type(
      await screen.findByLabelText(t("auth:change_password_form.old_password")),
      "old_password"
    );
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
    expect(changePasswordMock).toHaveBeenCalledTimes(1);
    expect(changePasswordMock).toHaveBeenCalledWith(
      "old_password",
      "new_password"
    );

    // Also check form has been cleared
    expect(
      screen.getByLabelText(t("auth:change_password_form.old_password"))
    ).not.toHaveValue();
    expect(
      screen.getByLabelText(t("auth:change_password_form.new_password"))
    ).not.toHaveValue();
    expect(
      screen.getByLabelText(t("auth:change_password_form.confirm_password"))
    ).not.toHaveValue();
  });

  it("shows an error alert if change password request failed", async () => {
    jest.spyOn(console, "error").mockReturnValue(undefined);
    changePasswordMock.mockRejectedValue({
      error_messages: ["Unexpected error"],
      status_code: 500,
    });

    userEvent.type(
      await screen.findByLabelText(t("auth:change_password_form.old_password")),
      "old_password"
    );
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
    expect(errorAlert).toHaveTextContent("Unexpected error");

    expect(
      screen.queryByText(
        t("auth:change_password_form.password_changed_success")
      )
    ).not.toBeInTheDocument();
  });
});
