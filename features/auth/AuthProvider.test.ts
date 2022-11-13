import { act, renderHook } from "@testing-library/react-hooks";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { service } from "service";
import { HttpError } from "service/http";

import * as client from "../../service/client";
import wrapper from "../../test/hookWrapper";
import { addDefaultUser, t } from "../../test/utils";
import { useAuthContext } from "./AuthProvider";

const logoutMock = service.user.logout as jest.Mock;

describe("AuthProvider", () => {
  it("sets an unauthenticatedErrorHandler function that logs out correctly", async () => {
    logoutMock.mockResolvedValue(new Empty());
    addDefaultUser();

    //mock out setUnauthenticatedErrorHandler to set our own handler var
    const initialHandler = async () => {};
    let handler: (e: HttpError) => Promise<void> = initialHandler;
    const mockSetHandler = jest.fn((fn: (e: HttpError) => Promise<void>) => {
      handler = fn;
    });
    jest
      .spyOn(client, "setUnauthenticatedErrorHandler")
      .mockImplementation(mockSetHandler);

    const { result } = renderHook(() => useAuthContext(), {
      wrapper,
    });

    expect(mockSetHandler).toBeCalled();
    await act(async () => {
      await handler({
        error_messages: ["Unable to log in with provided credentials."],
        errors: {},
        status_code: 400,
      } as HttpError);
    });
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.error).toBe(t("auth:logged_out_message"));
  });
});
