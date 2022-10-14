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

  it("cannot be submitted without email", async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);

    render(<BasicForm />, { wrapper });
    userEvent.type(await screen.findByLabelText("Password"), "P@ssword123");
    userEvent.click(
      await screen.findByRole("button", { name: t("global:continue") })
    );

    await waitFor(() => {
      expect(createUserMock).not.toBeCalled();
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
      await screen.findByLabelText(t("auth:basic_form.email.field_label")),
      "frodo@couchers.org.invalid"
    );
    userEvent.type(await screen.findByLabelText("Password"), "P@ssword123");

    userEvent.click(
      await screen.findByRole("button", { name: t("global:continue") })
    );

    await waitFor(() => {
      expect(createUserMock).toBeCalledWith(
        "frodo@couchers.org.invalid",
        "frodo@couchers.org.invalid",
        "P@ssword123"
      );
    });
  });

  it("displays an error when present", async () => {
    createUserMock.mockRejectedValueOnce({
      error_messages: {
        email: ["A user with that email address already exists."],
      },
      errors: ["The data submitted was invalid"],
      status_code: 400,
    });
    render(<BasicForm />, {
      wrapper,
    });

    userEvent.type(
      screen.getByLabelText(t("auth:basic_form.email.field_label")),
      "test@example.com{enter}"
    );
    userEvent.type(screen.getByLabelText("Password"), "P@ssword123");
    mockConsoleError();
    await assertErrorAlert("A user with that email address already exists.");
  });
});
