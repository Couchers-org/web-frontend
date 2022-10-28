import { renderHook } from "@testing-library/react-hooks";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { act } from "react-test-renderer";
import { service } from "service";

import wrapper from "../../test/hookWrapper";
import { addDefaultUser } from "../../test/utils";
import useAuthStore, { usePersistedState } from "./useAuthStore";

const getCurrentUserMock = service.user.getCurrentUser as jest.Mock;
const passwordLoginMock = service.user.passwordLogin as jest.Mock;
const getIsJailedMock = service.jail.getIsJailed as jest.Mock;
const logoutMock = service.user.logout as jest.Mock;

describe("usePersistedState hook", () => {
  it("uses a default value", () => {
    const defaultValue = "Test string";
    const { result } = renderHook(() => usePersistedState("key", defaultValue));
    expect(result.current[0]).toBe(defaultValue);
  });

  it("saves then loads a value", () => {
    const value = { test: "Test string" };
    const { result } = renderHook(() => usePersistedState("key", { test: "" }));
    expect(result.current[0]).toStrictEqual({ test: "" });
    act(() => result.current[1](value));
    expect(result.current[0]).toStrictEqual(value);
    expect(localStorage.getItem("key")).toBe(JSON.stringify(value));
    const { result: result2 } = renderHook(() =>
      usePersistedState("key", { test: "" })
    );
    expect(result2.current[0]).toStrictEqual(value);
  });

  it("saves then loads a value from sessionStorage", () => {
    const value = { test: "session test" };
    const { result } = renderHook(() =>
      usePersistedState("key", { test: "" }, "sessionStorage")
    );
    expect(result.current[0]).toStrictEqual({ test: "" });
    act(() => result.current[1](value));
    expect(result.current[0]).toStrictEqual(value);
    expect(sessionStorage.getItem("key")).toBe(JSON.stringify(value));
    const { result: result2 } = renderHook(() =>
      usePersistedState("key", { test: "" }, "sessionStorage")
    );
    expect(result2.current[0]).toStrictEqual(value);
  });

  it("clears a value", () => {
    const { result } = renderHook(() =>
      usePersistedState("key", { test: "" }, "sessionStorage")
    );
    expect(result.current[0]).toStrictEqual({ test: "" });
    act(() => result.current[2]());
    expect(result.current[0]).toStrictEqual(undefined);
    expect(sessionStorage.getItem("key")).toBe(null);
  });
});

describe("useAuthStore hook", () => {
  it("sets and clears an error", async () => {
    const { result } = renderHook(() => useAuthStore(), { wrapper });
    act(() => result.current.authActions.authError("error1"));
    expect(result.current.authState.error).toBe("error1");
    act(() => result.current.authActions.clearError());
    expect(result.current.authState.error).toBeNull();
  });

  it("logs out", async () => {
    logoutMock.mockResolvedValue(new Empty());
    addDefaultUser();
    const { result } = renderHook(() => useAuthStore(), { wrapper });
    expect(result.current.authState.authenticated).toBe(true);
    await act(() => result.current.authActions.logout());
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.token).toBeNull();
    expect(result.current.authState.error).toBeNull();
    expect(result.current.authState.userId).toBeNull();
  });

  it("logs out with an expired token", async () => {
    logoutMock.mockRejectedValue({
      error_messages: ["Invalid token."],
      status_code: 401
    });
    addDefaultUser();
    const { result } = renderHook(() => useAuthStore(), { wrapper });
    expect(result.current.authState.authenticated).toBe(true);
    await act(() => result.current.authActions.logout());
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.token).toBeNull();
    expect(result.current.authState.error).toBeNull();
    expect(result.current.authState.userId).toBeNull();
  });

  it("clears sessionStorage on logout", async () => {
    logoutMock.mockResolvedValue(new Empty());
    addDefaultUser();
    const { result } = renderHook(() => useAuthStore(), { wrapper });
    expect(result.current.authState.authenticated).toBe(true);
    sessionStorage.setItem("test key", "test value");
    expect(sessionStorage.length).toBe(1);
    await act(() => result.current.authActions.logout());
    expect(sessionStorage.length).toBe(0);
  });
});

describe("passwordLogin action", () => {
  it("sets authenticated state correctly", async () => {
    passwordLoginMock.mockResolvedValue({ auth_token: 'test-token', user_id: 1 });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper,
    });
    expect(result.current.authState.authenticated).toBe(false);
    await act(() =>
      result.current.authActions.passwordLogin({
        password: "pass",
        username: "user",
      })
    );
    expect(result.current.authState.authenticated).toBe(true);
    expect(result.current.authState.token).toBe("test-token");
    expect(result.current.authState.userId).toBe(1);
  });
  it("sets error correctly for login fail", async () => {
    passwordLoginMock.mockRejectedValue({
      error_messages: [
        "Unable to log in with provided credentials."
      ],
      errors: {},
      status_code: 400
    });
    const { result } = renderHook(() => useAuthStore(), { wrapper });
    expect(result.current.authState.authenticated).toBe(false);
    await act(() =>
      result.current.authActions.passwordLogin({
        password: "pass",
        username: "user",
      })
    );
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.error).toBe(
      "Unable to log in with provided credentials."
    );
  });
});

describe("updateSignupState action", () => {
  it("sets state correctly if in progress", async () => {
    const { result } = renderHook(() => useAuthStore(), { wrapper });
    expect(result.current.authState.error).toBe(null);
    expect(result.current.authState.userId).toBe(null);
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);
    await act(() =>
      result.current.authActions.updateSignupState({
        flow_token: "dummy-token",
        account_is_filled: false,
        filled_feedback: false,
        accepted_current_community_guidelines: false,
      })
    );
    expect(result.current.authState.error).toBe(null);
    expect(result.current.authState.userId).toBe(null);
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState?.flowToken).toBe("dummy-token");
  });

  it("sets state correctly if success", async () => {
    const { result } = renderHook(() => useAuthStore(), { wrapper });
    expect(result.current.authState.error).toBe(null);
    expect(result.current.authState.userId).toBe(null);
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);
    await act(() =>
      result.current.authActions.updateSignupState({
        flow_token: "",
        user_created: true,
      })
    );
    expect(result.current.authState.error).toBe(null);
    expect(result.current.authState.userId).toBe(null);
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toBe(null);
  });
});

describe("updateJailStatus action", () => {
  it("sets jailed to true for jailed user", async () => {
    getIsJailedMock.mockResolvedValue({ isJailed: true });
    addDefaultUser();
    const { result } = renderHook(() => useAuthStore(), { wrapper });
    await act(() => result.current.authActions.updateJailStatus());
    expect(result.current.authState.jailed).toBe(true);
    expect(result.current.authState.authenticated).toBe(true);
  });
  it("sets jailed to false for non-jailed user", async () => {
    getIsJailedMock.mockResolvedValue({ isJailed: false, user: defaultUser });
    getCurrentUserMock.mockResolvedValue({});
    addDefaultUser();
    const { result } = renderHook(() => useAuthStore(), { wrapper });
    await act(() => result.current.authActions.updateJailStatus());
    expect(result.current.authState.jailed).toBe(false);
    expect(result.current.authState.authenticated).toBe(true);
  });
});
