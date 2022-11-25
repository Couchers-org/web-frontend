import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QUESTIONS_OPTIONAL } from "components/ContributorForm/constants";
import { EditLocationMapProps } from "components/EditLocationMap";
import { SignupFlow } from "features/auth/useAuthStore";
import { hostingStatusLabels } from "features/profile/constants";
import mockRouter from "next-router-mock";
import { HostingStatus } from "proto/api_pb";
import TagManager from "react-gtm-module";
import { dashboardRoute,loginRoute, signupRoute } from "routes";
import { service } from "service";
import wrapper from "test/hookWrapper";
import {
  assertErrorAlert,
  mockConsoleError,
  MockedService,
  t,
} from "test/utils";

import Signup from "./Signup";

const startSignupMock = service.auth.startSignup as MockedService<
  typeof service.auth.startSignup
>;
const signupFlowAccountMock = service.auth.signupFlowAccount as MockedService<
  typeof service.auth.signupFlowAccount
>;
const signupFlowCommunityGuidelinesMock = service.auth
  .signupFlowCommunityGuidelines as MockedService<
  typeof service.auth.signupFlowCommunityGuidelines
>;
const signupFlowFeedbackMock = service.auth.signupFlowFeedback as MockedService<
  typeof service.auth.signupFlowFeedback
>;
const validateUsernameMock = service.auth.validateUsername as MockedService<
  typeof service.auth.validateUsername
>;

const View = () => {
  return <Signup />;
};

jest.mock("components/EditLocationMap", () => ({
  __esModule: true,
  default: (props: EditLocationMapProps) => (
    <input
      data-testid="edit-location-map"
      onChange={(event) => {
        props.updateLocation({
          lat: 1,
          lng: 2,
          address: event.target.value,
          radius: 5,
        });
      }}
    />
  ),
}));

describe("Signup", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl(signupRoute);
  });

  describe("flow steps", () => {
    it("basic -> account form works", async () => {
      startSignupMock.mockResolvedValue({
        flow_token: "token",
        account_is_filled: false,
      });

      render(<View />, { wrapper });

      userEvent.type(
        screen.getByLabelText(t("auth:basic_form.name.field_label")),
        "test user"
      );
      userEvent.type(
        screen.getByLabelText(t("auth:basic_form.email.field_label")),
        "test@example.com"
      );
      userEvent.type(screen.getByLabelText("Password"), "Password123{enter}");
      expect(
        await screen.findByLabelText(
          t("auth:account_form.username.field_label")
        )
      ).toBeVisible();
    });

    it("account -> guidelines form works", async () => {
      window.localStorage.setItem(
        "auth.flowState",
        JSON.stringify({
          flowToken: "token",
          needAccount: true,
          needAcceptCommunityGuidelines: true,
          needFeedback: true,
        })
      );
      signupFlowAccountMock.mockResolvedValue({
        flow_token: "token",
        account_is_filled: true,
        accepted_community_guidelines: -1,
        filled_feedback: false,
      });
      validateUsernameMock.mockResolvedValue(true);

      render(<View />, { wrapper });

      userEvent.type(
        await screen.findByLabelText(
          t("auth:account_form.username.field_label")
        ),
        "test"
      );
      const birthdayField = screen.getByLabelText(
        t("auth:account_form.birthday.field_label")
      );
      userEvent.clear(birthdayField);
      userEvent.type(birthdayField, "01/01/1990");

      userEvent.type(
        screen.getByTestId("edit-location-map"),
        "test city, test country"
      );

      userEvent.selectOptions(
        screen.getByLabelText(
          t("auth:account_form.hosting_status.field_label")
        ),
        hostingStatusLabels(t)[HostingStatus.HOSTING_STATUS_CAN_HOST]
      );

      userEvent.click(
        screen.getByLabelText(t("auth:account_form.gender.woman"))
      );
      userEvent.click(
        await screen.findByLabelText(t("auth:account_form.tos_accept_label"))
      );

      userEvent.click(
        screen.getByRole("button", { name: t("global:sign_up") })
      );

      expect(await screen.findByText(t("auth:community_guidelines_form.header"))).toBeVisible();
    });

    it("guidelines -> contributor form works", async () => {
      window.localStorage.setItem(
        "auth.flowState",
        JSON.stringify({
          flowToken: "token",
          needAccount: false,
          needAcceptCommunityGuidelines: true,
          needFeedback: true,
        })
      );
      signupFlowCommunityGuidelinesMock.mockResolvedValue({
        flow_token: "token",
        account_is_filled: true,
        accepted_current_community_guidelines: true,
        filled_feedback: false,
      });
      render(<View />, { wrapper });

      const checkboxes = await screen.findAllByLabelText(
        t("auth:community_guidelines_form.guideline.checkbox_label")
      );
      checkboxes.forEach((checkbox) => userEvent.click(checkbox));
      const button = screen.getByRole("button", { name: t("global:continue") });

      await waitFor(() => expect(button).not.toBeDisabled());
      userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(QUESTIONS_OPTIONAL)).toBeVisible();
      });
    });
  });

  it("contributor form -> success", async () => {
    jest.spyOn(console, "warn").mockImplementation(undefined);
    window.localStorage.setItem(
      "auth.flowState",
      JSON.stringify({
        flowToken: "token",
        needAccount: false,
        needAcceptCommunityGuidelines: false,
        needFeedback: true,
      })
    );
    signupFlowFeedbackMock.mockResolvedValue({
      flow_token: "token",
      user_created: true,
      account_is_filled: true,
      accepted_current_community_guidelines: true,
      filled_feedback: true,
    });

    render(<View />, { wrapper });

    userEvent.click(screen.getByRole("button", { name: t("global:submit") }));
    await waitFor(() => expect(mockRouter.pathname).toBe(loginRoute));

    expect(TagManager.dataLayer).toHaveBeenCalledTimes(1);
    expect(TagManager.dataLayer).toHaveBeenCalledWith({
      dataLayer: {
        event: "sign_up",
        signupMethod: "email",
        userId: expect.any(String),
        "gtm.elementUrl": expect.any(String),
      },
    });
  });

  it("displays the account form when account, feedback, and guidelines pending", async () => {
    const state: SignupFlow = {
      isCompleted: false,
      needAccount: true,
      needFeedback: true,
      needAcceptCommunityGuidelines: true,
      flowToken: "token",
    };
    window.localStorage.setItem("auth.flowState", JSON.stringify(state));
    render(<View />, { wrapper });
    expect(
      screen.getByLabelText(t("auth:account_form.username.field_label"))
    ).toBeVisible();
  });

  it("displays the account form when account and guidelines are pending", async () => {
    const state: SignupFlow = {
      isCompleted: false,
      needAccount: true,
      needAcceptCommunityGuidelines: true,
      needFeedback: false,
      flowToken: "token",
    };
    window.localStorage.setItem("auth.flowState", JSON.stringify(state));
    render(<View />, { wrapper });
    expect(
      screen.getByLabelText(t("auth:account_form.username.field_label"))
    ).toBeVisible();
  });

  it("displays the account form when only account is pending", async () => {
    const state: SignupFlow = {
      isCompleted: false,
      needAccount: true,
      needAcceptCommunityGuidelines: false,
      needFeedback: false,
      flowToken: "token",
    };
    window.localStorage.setItem("auth.flowState", JSON.stringify(state));
    render(<View />, { wrapper });
    expect(
      screen.getByLabelText(t("auth:account_form.username.field_label"))
    ).toBeVisible();
  });

  it("displays the guidelines form when guidelines and feedback are pending", async () => {
    const state: SignupFlow = {
      isCompleted: false,
      needAccount: false,
      needAcceptCommunityGuidelines: true,
      needFeedback: true,
      flowToken: "token",
    };
    window.localStorage.setItem("auth.flowState", JSON.stringify(state));
    render(<View />, { wrapper });
    expect(await screen.findByText(t("auth:community_guidelines_form.header"))).toBeVisible();
  });

  it("displays the guidelines form when only it and feedback are pending", async () => {
    const state: SignupFlow = {
      isCompleted: false,
      needAccount: false,
      needAcceptCommunityGuidelines: true,
      needFeedback: true,
      flowToken: "token",
    };
    window.localStorage.setItem("auth.flowState", JSON.stringify(state));
    render(<View />, { wrapper });
    expect(await screen.findByText(t("auth:community_guidelines_form.header"))).toBeVisible();
  });

  it("displays the feedback form when feedback is pending", async () => {
    const state: SignupFlow = {
      isCompleted: false,
      needAccount: false,
      needAcceptCommunityGuidelines: false,
      needFeedback: true,
      flowToken: "token",
    };
    window.localStorage.setItem("auth.flowState", JSON.stringify(state));
    render(<View />, { wrapper });
    expect(screen.getByText(QUESTIONS_OPTIONAL)).toBeVisible();
  });

  it("displays the redirect message when signup is complete", async () => {
    const state: SignupFlow = {
      isCompleted: true,
      needAccount: false,
      needAcceptCommunityGuidelines: false,
      needFeedback: false,
      flowToken: "token",
    };
    window.localStorage.setItem("auth.flowState", JSON.stringify(state));
    render(<View />, { wrapper });
    expect(
      await screen.findByText(t("auth:sign_up_confirmed_prompt"))
    ).toBeVisible();
  });

  it("displays an error when present", async () => {
    const signupFlowFeedbackMock = service.auth
      .signupFlowFeedback as MockedService<
      typeof service.auth.signupFlowFeedback
    >;
    signupFlowFeedbackMock.mockRejectedValue({
      error_messages: ["Permission denied"],
      status_code: 401,
    });
    window.localStorage.setItem(
      "auth.flowState",
      JSON.stringify({
        flowToken: "token",
        isCompleted: false,
        needAccount: false,
        needAcceptCommunityGuidelines: false,
        needFeedback: true,
      })
    );
    render(<View />, { wrapper });

    userEvent.click(
      await screen.findByRole("button", { name: t("global:submit") })
    );
    mockConsoleError();
    await assertErrorAlert("Permission denied");
  });

  it("redirects authenticated users away from the signup flow", async () => {
    window.localStorage.setItem("auth.authenticated", "true");
    render(<View />, { wrapper });
    await waitFor(() => expect(mockRouter.pathname).toBe(dashboardRoute));
  })
});
