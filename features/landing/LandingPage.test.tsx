import { render, screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { dashboardRoute } from "routes";
import wrapper from "test/hookWrapper";
import { t } from "test/utils";

import LandingPage from "./LandingPage";

describe("LandingPage", () => {
  it("shows the signup form", async () => {
    render(<LandingPage />, { wrapper });
    expect(screen.getByText(t("landing:signup_header"))).toBeVisible();
  });
  it("redirects authenticated users to the dashboard", async () => {
    mockRouter.setCurrentUrl("/");
    window.localStorage.setItem("auth.authenticated", "true");
    render(<LandingPage />, { wrapper });
    await waitFor(() => expect(mockRouter.pathname).toBe(dashboardRoute));
  });
});
