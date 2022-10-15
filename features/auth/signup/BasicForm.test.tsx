import { render, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import userEvent from "@testing-library/user-event";
import { service } from "service";
import wrapper from "test/hookWrapper";
import {
  assertErrorAlert,
  mockConsoleError,
  MockedService,
  t,
} from "test/utils";

import { useAuthContext } from "../AuthProvider";
import BasicForm from "./BasicForm";

const createUserMock = service.auth.createUser as MockedService<
  typeof service.auth.createUser
>;

describe("basic signup form", () => {
  it("cannot be submitted empty", async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);

    render(<BasicForm />, { wrapper });
    userEvent.click(
      await screen.findByRole("button", { name: t("global:continue") })
    );

    await waitFor(() => {
      expect(createUserMock).not.toBeCalled();
    });

    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);
  });

  it("cannot be submitted without username", async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);

    render(<BasicForm />, { wrapper });
    userEvent.type(await screen.findByLabelText(t("auth:basic_form.email.field_label")), "frodo@couchers.org.invalid");
    userEvent.type(await screen.findByLabelText(t("auth:basic_form.password.field_label")), "P@ssword123");
    userEvent.click(
      await screen.findByRole("button", { name: t("global:continue") })
    );

    await waitFor(() => {
      expect(createUserMock).not.toBeCalled()
    });

    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);
  });

  it("cannot be submitted without email", async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);

    render(<BasicForm />, { wrapper });
    userEvent.type(await screen.findByLabelText("Username"), "testuser");
    userEvent.type(await screen.findByLabelText("Password"), "P@ssword123");
    userEvent.click(
      await screen.findByRole("button", { name: t("global:continue") })
    );

    await waitFor(() => {
      expect(createUserMock).toBeCalledTimes(0)
    });

    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);
  });

  it("cannot be submitted without password", async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);

    render(<BasicForm />, { wrapper });
    userEvent.type(
      await screen.findByLabelText("Username"),
      "testuser"
    );
    userEvent.type(
      await screen.findByLabelText(t("auth:basic_form.email.field_label")),
      "frodo@couchers.org.invalid"
    );
    userEvent.click(
      await screen.findByRole("button", { name: t("global:continue") })
    );

    await waitFor(() => {
      expect(createUserMock).not.toBeCalled();
    });

    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);
  });

  it("submits when filled in", async () => {
    createUserMock.mockResolvedValue({
      email: "frodo@couchers.org.invalid",
      username: "frodo@couchers.org.invalid",
      id: 1,
    });
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);

    render(<BasicForm />, { wrapper });
    userEvent.type(
      await screen.findByLabelText("Username"),
      "testuser"
    );
    userEvent.type(
      await screen.findByLabelText(t("auth:basic_form.email.field_label")),
      "frodo@couchers.org.invalid"
    );
    userEvent.type(await screen.findByLabelText("Password"), "P@ssword123");

    userEvent.click(
      await screen.findByRole("button", { name: t("global:continue") })
    );

    await waitFor(() => {
      expect(createUserMock).toBeCalledWith(
        "testuser",
        "frodo@couchers.org.invalid",
        "P@ssword123"
      );
    });
  });

  it("displays an error when present", async () => {
    createUserMock.mockRejectedValueOnce({
      errors: {
        email: ["A user with that email address already exists."],
      },
      error_messages: ["The data submitted was invalid"],
      status_code: 400,
    });
    render(<BasicForm />, {
      wrapper,
    });

    userEvent.type(
      screen.getByLabelText(t("auth:basic_form.username.field_label")),
      "testuser"
    );
    userEvent.type(
      screen.getByLabelText(t("auth:basic_form.email.field_label")),
      "test@example.com"
    );
    userEvent.type(screen.getByLabelText("Password"), "P@ssword123{enter}");
    mockConsoleError();
    await assertErrorAlert("A user with that email address already exists.");
  });
});
