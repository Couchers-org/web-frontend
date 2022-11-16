import { render, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import userEvent from "@testing-library/user-event";
import {
  CONTRIBUTE_LABEL,
  EXPERTISE_LABEL,
  SUBMIT,
} from "components/ContributorForm/constants";
import { service } from "service";
import wrapper from "test/hookWrapper";
import { MockedService } from "test/utils";

import { useAuthContext } from "../AuthProvider";
import FeedbackForm from "./FeedbackForm";

const signupFlowFeedbackMock = service.auth.signupFlowFeedback as MockedService<
  typeof service.auth.signupFlowFeedback
>;

const stateBeforeFeedback = {
  flowToken: "dummy-token",
  needAccount: false,
  needFeedback: true,
  needAcceptCommunityGuidelines: true,
};

const stateAfterFeedback = {
  flowToken: "dummy-token",
  needAccount: false,
  needFeedback: false,
  needAcceptCommunityGuidelines: true,
};

const flowResponseAfterFeedback = {
  flow_token: "dummy-token",
  is_completed: false,
  account_is_filled: true,
  filled_feedback: true,
  accepted_community_guidelines: -1,
};

describe("signup form (feedback part)", () => {
  beforeEach(() => {
    signupFlowFeedbackMock.mockResolvedValue(flowResponseAfterFeedback);
    window.localStorage.setItem(
      "auth.flowState",
      JSON.stringify(stateBeforeFeedback)
    );
  });

  it("works", async () => {
    const { result } = renderHook(() => useAuthContext(), {
      wrapper,
    });
    expect(result.current.authState.authenticated).toBe(false);
    expect(result.current.authState.flowState).toStrictEqual(
      stateBeforeFeedback
    );

    render(<FeedbackForm />, { wrapper });
    userEvent.type(
      await screen.findByLabelText(EXPERTISE_LABEL),
      "I have lots of expertise!"
    );
    userEvent.click(await screen.findByLabelText("Yes"));
    userEvent.click(await screen.findByRole("button", { name: SUBMIT }));

    await waitFor(() => {
      expect(signupFlowFeedbackMock).toBeCalledTimes(1);
      const params = signupFlowFeedbackMock.mock.calls[0];
      expect(params[0]).toBe("dummy-token");
      expect(params[1].contribute).toBe("yes");
      expect(params[1].expertise).toBe("I have lots of expertise!");
    });

    const { result: result2 } = renderHook(() => useAuthContext(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result2.current.authState.authenticated).toBe(false);
      expect(result2.current.authState.flowState).toMatchObject(
        stateAfterFeedback
      );
    });
  });

  it("skips the form successfully if the skip link is used", async () => {
    render(<FeedbackForm />, { wrapper });

    userEvent.click(
      await screen.findByRole("link", { name: "Skip this step" })
    );

    await waitFor(() => {
      expect(signupFlowFeedbackMock).toBeCalledTimes(1);
    });
    expect(signupFlowFeedbackMock).toHaveBeenCalledWith(
      "dummy-token",
      expect.objectContaining({
        contribute: "no",
      })
    );

    const { result } = renderHook(() => useAuthContext(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.authState.authenticated).toBe(false);
    });
    expect(result.current.authState.flowState).toMatchObject(
      stateAfterFeedback
    );
  });
});
