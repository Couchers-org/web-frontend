import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommunityGuidelinesForm from "features/auth/signup/CommunityGuidelinesForm";
import { service } from "service";
import wrapper from "test/hookWrapper";
import {
  assertErrorAlert,
  mockConsoleError,
  MockedService,
  t,
} from "test/utils";

const signupFlowCommunityGuidelinesMock = service.auth
  .signupFlowCommunityGuidelines as MockedService<
  typeof service.auth.signupFlowCommunityGuidelines
>;
const getCommunityGuidelinesMock = service.resources
  .getCommunityGuidelines as MockedService<
  typeof service.resources.getCommunityGuidelines
>;

describe("community guidelines signup form", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      "auth.flowState",
      JSON.stringify({
        flowToken: "dummy-token",
        needAccount: true,
        needFeedback: false,
        needAcceptCommunityGuidelines: true,
      })
    );
    getCommunityGuidelinesMock.mockResolvedValue([
      {
        title: "Guideline 1",
        guideline: "Follow guideline 1",
        icon: "<svg></svg>",
      },
      {
        title: "Guideline 2",
        guideline: "Follow guideline 2",
        icon: "<svg></svg>",
      },
    ]);
  });
  it("works only with all boxes checked", async () => {
    signupFlowCommunityGuidelinesMock.mockResolvedValue({
      flow_token: "dummy-token",
    });
    render(<CommunityGuidelinesForm />, { wrapper });

    const checkboxes = await screen.findAllByLabelText(
      t("auth:community_guidelines_form.guideline.checkbox_label")
    );
    const button = await screen.findByRole("button", {
      name: t("global:continue"),
    });
    checkboxes.forEach((checkbox) => {
      expect(button).toBeDisabled();
      expect(signupFlowCommunityGuidelinesMock).not.toBeCalled();
      userEvent.click(checkbox);
    });
    await waitFor(() => expect(button).not.toBeDisabled());
    userEvent.click(button);

    await waitFor(() => {
      expect(signupFlowCommunityGuidelinesMock).toBeCalledWith(
        "dummy-token",
        1
      );
    });
  });

  it("displays an error when present", async () => {
    signupFlowCommunityGuidelinesMock.mockRejectedValueOnce({
      status_code: 401,
      error_messages: ["Permission denied"],
    });
    render(<CommunityGuidelinesForm />, {
      wrapper,
    });

    const checkboxes = await screen.findAllByLabelText(
      t("auth:community_guidelines_form.guideline.checkbox_label")
    );
    const button = screen.getByRole("button", { name: t("global:continue") });
    checkboxes.forEach((checkbox) => {
      userEvent.click(checkbox);
    });
    await waitFor(() => expect(button).not.toBeDisabled());
    userEvent.click(button);

    mockConsoleError();
    await assertErrorAlert("Permission denied");
  });
});
