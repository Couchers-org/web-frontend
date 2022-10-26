import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { service } from "service";
import wrapper from "test/hookWrapper";
import { assertErrorAlert, t } from "test/utils";

import Login from "./Login";

const passwordLoginMock = service.user.passwordLogin as jest.MockedFunction<
  typeof service.user.passwordLogin
>;

it("shows the known error from the API", async () => {
  passwordLoginMock.mockRejectedValue({
    error_messages: [
      "Unable to log in with provided credentials."
    ],
    errors: {},
    status_code: 400
  });
  render(<Login />, { wrapper });

  userEvent.type(
    await screen.findByLabelText(
      t("auth:login_page.form.username_field_label")
    ),
    "test-user"
  );

  userEvent.type(
    await screen.findByLabelText(
      t("auth:login_page.form.password_field_label")
    ),
    "test-password"
  );

  userEvent.click(screen.getByRole("button", { name: t("global:continue") }));

  await assertErrorAlert("Unable to log in with provided credentials");
});

it("shows the fatal error message for unknown errors", async () => {
  passwordLoginMock.mockRejectedValue({
    status_code: 500
  });
  render(<Login />, { wrapper });

  userEvent.type(
    await screen.findByLabelText(
      t("auth:login_page.form.username_field_label")
    ),
    "test-user"
  );

  userEvent.type(
    await screen.findByLabelText(
      t("auth:login_page.form.password_field_label")
    ),
    "test-password"
  );

  userEvent.click(screen.getByRole("button", { name: t("global:continue") }));

  await assertErrorAlert(t("global:error.fatal_message"));
});
